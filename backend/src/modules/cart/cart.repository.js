const { pool } = require('../../config/database');

function buildCartItem(row) {
const baseItem = {
  id: row.item_id,
  service_type: row.service_type,
  reference_id: row.reference_id,
  quantity: row.quantity,
  options: row.options,
  unit_price: row.unit_price,
  subtotal: Number(row.quantity) * Number(row.unit_price),
  created_at: row.item_created_at,
  updated_at: row.item_updated_at,
};

  if (row.service_type === 'canteen') {
    return {
      ...baseItem,
      menu_item: {
        id: row.menu_item_id,
        category_id: row.category_id,
        category_name: row.category_name,
        name: row.menu_item_name,
        description: row.menu_item_description,
        price: row.menu_item_price,
        available: row.menu_item_available,
        meal_periods: row.menu_item_meal_periods,
        created_at: row.menu_item_created_at,
        updated_at: row.menu_item_updated_at,
      },
    };
  }

  if (row.service_type === 'printout') {
  return {
    ...baseItem,
    print_job: {
      id: row.print_job_id,
      file_name: row.file_name,
      page_count: row.page_count,
      calculated_price: row.calculated_price,
      options: row.print_options,
      created_at: row.print_created_at,
      updated_at: row.print_updated_at,
    },
  };
}
  return {
    ...baseItem,
    product: {
      id: row.product_id,
      category_id: row.category_id,
      category_name: row.category_name,
      name: row.product_name,
      description: row.product_description,
      price: row.product_price,
      stock: row.product_stock,
      image_url: row.product_image_url,
      active: row.product_active,
      created_at: row.product_created_at,
      updated_at: row.product_updated_at,
    },
  };
}

function buildCart(rows) {
  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];

  const cart = {
    id: firstRow.cart_id,
    user_id: firstRow.user_id,
    created_at: firstRow.cart_created_at,
    updated_at: firstRow.cart_updated_at,
    items: [],
  };

  for (const row of rows) {
    if (!row.item_id) {
      continue;
    }

    cart.items.push(buildCartItem(row));
  }

  return cart;
}

async function withTransaction(work) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function findOrCreateCart(client, userId) {
  const result = await client.query(
    `WITH inserted AS (
       INSERT INTO carts (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING id, user_id, created_at, updated_at
     )
     SELECT id, user_id, created_at, updated_at
     FROM inserted
     UNION ALL
     SELECT id, user_id, created_at, updated_at
     FROM carts
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0];
}

async function findProductById(client, serviceType, referenceId) {
  if (serviceType === 'canteen') {
    const result = await client.query(
      `SELECT
         cmi.id,
         cmi.category_id,
         cc.name AS category_name,
         cmi.name,
         cmi.description,
         cmi.price,
         cmi.available,
         cmi.meal_periods,
         cmi.created_at,
         cmi.updated_at
       FROM canteen_menu_items cmi
       LEFT JOIN canteen_categories cc
         ON cc.id = cmi.category_id
       WHERE cmi.id = $1
AND cmi.available = true`,
      [referenceId]
    );

    return result.rows[0] || null;
  }
  if (serviceType === 'printout') {
  const result = await client.query(
    `SELECT
       id,
       file_name,
       page_count,
       options,
       calculated_price,
       created_at,
       updated_at
     FROM print_jobs
     WHERE id = $1`,
    [referenceId]
  );

  return result.rows[0] || null;
}

  const result = await client.query(
    `SELECT
       sp.id,
       sp.category_id,
       sc.name AS category_name,
       sp.name,
       sp.description,
       sp.price,
       sp.stock,
       sp.image_url,
       sp.active,
       sp.created_at,
       sp.updated_at
     FROM stationery_products sp
     LEFT JOIN stationery_categories sc
       ON sc.id = sp.category_id
     WHERE sp.id = $1
AND sp.active = true`,
    [referenceId]
  );

  return result.rows[0] || null;
}

async function findCartItemById(client, cartId, itemId, serviceType) {
  const params = [itemId, cartId];
  let serviceTypeClause = '';

  if (serviceType) {
    params.push(serviceType);
    serviceTypeClause = 'AND service_type = $3';
  }

  const result = await client.query(
    `SELECT id, quantity
     FROM cart_items
     WHERE id = $1
       AND cart_id = $2
       ${serviceTypeClause}`,
    params
  );

  return result.rows[0] || null;
}

async function findCartItemByReferenceId(client, cartId, serviceType, referenceId) {
  const result = await client.query(
    `SELECT id, quantity
     FROM cart_items
     WHERE cart_id = $1
       AND service_type = $2
       AND reference_id = $3`,
    [cartId, serviceType, referenceId]
  );

  return result.rows[0] || null;
}

async function getCartRows(client, userId) {
  const result = await client.query(
    `SELECT
       c.id AS cart_id,
       c.user_id,
       c.created_at AS cart_created_at,
       c.updated_at AS cart_updated_at,
       ci.id AS item_id,
       ci.service_type,
       ci.reference_id,
       ci.quantity,
       ci.options,
       ci.unit_price,
       ci.created_at AS item_created_at,
       ci.updated_at AS item_updated_at,
       sp.id AS product_id,
       sp.category_id AS stationery_category_id,
       sc.name AS stationery_category_name,
       sp.name AS product_name,
       sp.description AS product_description,
       sp.price AS product_price,
       sp.stock AS product_stock,
       sp.image_url AS product_image_url,
       sp.active AS product_active,
       sp.created_at AS product_created_at,
       sp.updated_at AS product_updated_at,
       cmi.id AS menu_item_id,
       cmi.category_id AS canteen_category_id,
       cc.name AS canteen_category_name,
       cmi.name AS menu_item_name,
       cmi.description AS menu_item_description,
       cmi.price AS menu_item_price,
       cmi.available AS menu_item_available,
       cmi.meal_periods AS menu_item_meal_periods,
       cmi.created_at AS menu_item_created_at,
       cmi.updated_at AS menu_item_updated_at,
       pj.id AS print_job_id,
pj.file_name,
pj.page_count,
pj.options AS print_options,
pj.calculated_price,
pj.created_at AS print_created_at,
pj.updated_at AS print_updated_at,
       COALESCE(sp.category_id, cmi.category_id) AS category_id,
       COALESCE(sc.name, cc.name) AS category_name
     FROM carts c
     LEFT JOIN cart_items ci
       ON ci.cart_id = c.id
     LEFT JOIN stationery_products sp
       ON ci.service_type = 'stationery'
      AND sp.id = ci.reference_id
     LEFT JOIN stationery_categories sc
       ON sc.id = sp.category_id
     LEFT JOIN canteen_menu_items cmi
       ON ci.service_type = 'canteen'
      AND cmi.id = ci.reference_id
     LEFT JOIN canteen_categories cc
       ON cc.id = cmi.category_id
       
    LEFT JOIN print_jobs pj
  ON ci.service_type = 'printout'
 AND pj.id = ci.reference_id
     WHERE c.user_id = $1
     ORDER BY ci.created_at ASC NULLS LAST`,
    [userId]
  );

  return buildCart(result.rows);
}

async function getCartByUserId(userId) {
  return withTransaction(async (client) => {
    await findOrCreateCart(client, userId);
    return getCartRows(client, userId);
  });
}

async function addItemToCart({ userId, serviceType = 'stationery', referenceId, quantity }) {
  return withTransaction(async (client) => {
    const product = await findProductById(client, serviceType, referenceId);

    if (!product) {
      return null;
    }

    const cart = await findOrCreateCart(client, userId);
    const existingItem = await findCartItemByReferenceId(client, cart.id, serviceType, referenceId);

    if (existingItem) {
      await client.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE id = $2`,
        [quantity, existingItem.id]
      );
    } else {
      await client.query(
        `INSERT INTO cart_items (
           cart_id,
           service_type,
           reference_id,
           quantity,
           options,
           unit_price
         )
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
  cart.id,
  serviceType,
  referenceId,
  quantity,
  {},
  serviceType === 'printout'
    ? product.calculated_price
    : product.price,
]
      );
    }

    return getCartRows(client, userId);
  });
}

async function updateCartItemQuantity({ userId, itemId, quantity }) {
  return withTransaction(async (client) => {
    const cart = await findOrCreateCart(client, userId);
    const existingItem = await findCartItemById(client, cart.id, itemId);

    if (!existingItem) {
      return null;
    }

    await client.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE id = $2`,
      [quantity, itemId]
    );

    return getCartRows(client, userId);
  });
}

async function deleteCartItem({ userId, itemId }) {
  return withTransaction(async (client) => {
    const cart = await findOrCreateCart(client, userId);
    const existingItem = await findCartItemById(client, cart.id, itemId);

    if (!existingItem) {
      return null;
    }

    await client.query(
      `DELETE FROM cart_items
       WHERE id = $1`,
      [itemId]
    );

    return getCartRows(client, userId);
  });
}

module.exports = {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
};