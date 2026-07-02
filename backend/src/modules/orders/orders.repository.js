const crypto = require('crypto');
const { pool } = require('../../config/database');

function mapOrderSummary(row) {
  return {
    id: row.id,
    order_number: row.order_number,
    user_id: row.user_id,
    service_type: row.service_type,
    status: row.status,
    total: row.total,
    created_at: row.created_at,
    updated_at: row.updated_at,
    item_count: Number(row.item_count || 0),
  };
}

function mapOrderItem(row) {
  return {
    id: row.item_id,
    name: row.name,
    quantity: row.quantity,
    unit_price: row.unit_price,
    options: row.options,
    created_at: row.item_created_at,
    updated_at: row.item_updated_at,
  };
}

function mapStatusHistory(row) {
  return {
    id: row.history_id,
    order_id: row.order_id,
    status: row.status,
    changed_by: row.changed_by,
    changed_at: row.changed_at,
    created_at: row.history_created_at,
    updated_at: row.history_updated_at,
  };
}

function determineOrderServiceType(cartItems) {
  const serviceTypes = new Set(
    cartItems.map((item) => item.service_type)
  );

  if (serviceTypes.size === 1) {
    return serviceTypes.values().next().value;
  }

  return 'mixed';
}

function buildOrderDetails(rows, historyRows = []) {
  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];

  const order = {
    id: firstRow.order_id,
    order_number: firstRow.order_number,
    user_id: firstRow.user_id,
    service_type: firstRow.service_type,
    status: firstRow.status,
    total: firstRow.total,
    created_at: firstRow.created_at,
    updated_at: firstRow.updated_at,
    items: [],
    status_history: historyRows.map(mapStatusHistory),
  };

  for (const row of rows) {
    if (!row.item_id) {
      continue;
    }

    order.items.push({
      ...mapOrderItem(row),
      subtotal: Number(row.quantity) * Number(row.unit_price),
    });
  }

  return order;
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

async function findCartByUserId(client, userId) {
  const result = await client.query(
    `SELECT id, user_id, created_at, updated_at
     FROM carts
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0] || null;
}

async function getCartItemsForOrder(client, cartId) {
  const result = await client.query(
    `SELECT
       ci.id,
       ci.cart_id,
       ci.service_type,
       ci.reference_id,
       ci.quantity,
       ci.options,
       ci.unit_price,
       ci.created_at,
       ci.updated_at,
       sp.name AS product_name,
       sp.description AS product_description,
       sp.price AS product_price,
       sp.stock AS product_stock,
       sp.image_url AS product_image_url,
       sp.active AS product_active,
       sp.category_id,
       sc.name AS product_category_name,
       sp.created_at AS product_created_at,
       sp.updated_at AS product_updated_at,
       cmi.name AS menu_item_name,
       cmi.description AS menu_item_description,
       cmi.price AS menu_item_price,
       cmi.available AS menu_item_available,
       cmi.meal_periods AS menu_item_meal_periods,
       cmi.created_at AS menu_item_created_at,
       cmi.updated_at AS menu_item_updated_at,
       cmi.category_id AS menu_item_category_id,
       cc.name AS menu_item_category_name,
       pj.id AS print_job_id,
pj.file_name,
pj.page_count,
pj.options AS print_options,
pj.calculated_price,
pj.created_at AS print_created_at,
pj.updated_at AS print_updated_at
     FROM cart_items ci
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
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at ASC`,
    [cartId]
  );

  return result.rows;
}

async function createOrderFromCart({ userId }) {
  return withTransaction(async (client) => {
    const cart = await findCartByUserId(client, userId);

    if (!cart) {
      return null;
    }

    const cartItems = await getCartItemsForOrder(client, cart.id);

    if (cartItems.length === 0) {
      return { emptyCart: true };
    }

    const orderNumber = `ORD-${crypto.randomUUID()}`;
    const serviceType = determineOrderServiceType(cartItems);
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0
    );

    const orderResult = await client.query(
      `INSERT INTO orders (
         order_number,
         user_id,
         service_type,
         status,
         total
       )
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id, order_number, user_id, service_type, status, total, created_at, updated_at`,
      [orderNumber, userId, serviceType, total]
    );

    const order = orderResult.rows[0];
    order.service_type = serviceType;

    for (const item of cartItems) {
       let itemName;

if (item.service_type === 'canteen') {
  itemName = item.menu_item_name;
} else if (item.service_type === 'printout') {
  itemName = item.file_name;
} else {
  itemName = item.product_name;
}

      await client.query(
        `INSERT INTO order_items (
           order_id,
           name,
           quantity,
           unit_price,
           options
         )
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          itemName,
          item.quantity,
          item.unit_price,
          item.options,
        ]
      );
    }

    await client.query(
      `INSERT INTO order_status_history (
         order_id,
         status,
         changed_by
       )
       VALUES ($1, 'pending', $2)`,
      [order.id, userId]
    );

    await client.query(
      `DELETE FROM cart_items
       WHERE cart_id = $1`,
      [cart.id]
    );

    return order;
  });
}

async function findOrdersByUserId(userId) {
  const result = await pool.query(
    `SELECT
       o.id,
       o.order_number,
       o.user_id,
       o.service_type,
       o.status,
       o.total,
       o.created_at,
       o.updated_at,
       COUNT(oi.id) AS item_count
     FROM orders o
     LEFT JOIN order_items oi
       ON oi.order_id = o.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  );

  return result.rows.map(mapOrderSummary);
}

async function findOrderById(userId, orderId) {
  const orderResult = await pool.query(
    `SELECT
       o.id AS order_id,
       o.order_number,
       o.user_id,
       o.service_type,
       o.status,
       o.total,
       o.created_at,
       o.updated_at,
       oi.id AS item_id,
       oi.name,
       oi.quantity,
       oi.unit_price,
       oi.options,
       oi.created_at AS item_created_at,
       oi.updated_at AS item_updated_at
     FROM orders o
     LEFT JOIN order_items oi
       ON oi.order_id = o.id
     WHERE o.user_id = $1
       AND o.id = $2
     ORDER BY oi.created_at ASC`,
    [userId, orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const historyResult = await pool.query(
    `SELECT
       id AS history_id,
       order_id,
       status,
       changed_by,
       changed_at,
       created_at AS history_created_at,
       updated_at AS history_updated_at
     FROM order_status_history
     WHERE order_id = $1
     ORDER BY changed_at ASC, created_at ASC`,
    [orderId]
  );

  return buildOrderDetails(orderResult.rows, historyResult.rows);
}
async function findAllOrders() {
  const result = await pool.query(
    `SELECT
        o.id,
        o.order_number,
        o.user_id,
        u.name,
        u.email,
        o.service_type,
        o.status,
        o.total,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) AS item_count
     FROM orders o
     JOIN users u
       ON u.id = o.user_id
     LEFT JOIN order_items oi
       ON oi.order_id = o.id
     GROUP BY
       o.id,
       u.name,
       u.email
     ORDER BY o.created_at DESC`
  );

  return result.rows;
}

async function updateOrderStatus(orderId, status, adminId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE orders
       SET
         status = $2,
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [orderId, status]
    );

    if (result.rows.length === 0) {
      throw new Error("ORDER_NOT_FOUND");
    }

    await client.query(
      `INSERT INTO order_status_history
       (
         order_id,
         status,
         changed_by
       )
       VALUES ($1,$2,$3)`,
      [
        orderId,
        status,
        adminId
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (err) {

    await client.query("ROLLBACK");
    throw err;

  } finally {

    client.release();

  }
}
async function findOrderByIdForAdmin(orderId) {

  const orderResult = await pool.query(
    `SELECT
        o.id AS order_id,
        o.order_number,
        o.user_id,
        u.name,
        u.email,
        u.campus_id,
        o.service_type,
        o.status,
        o.total,
        o.created_at,
        o.updated_at,
        oi.id AS item_id,
        oi.name,
        oi.quantity,
        oi.unit_price,
        oi.options,
        oi.created_at AS item_created_at,
        oi.updated_at AS item_updated_at
     FROM orders o
     JOIN users u
       ON u.id=o.user_id
     LEFT JOIN order_items oi
       ON oi.order_id=o.id
     WHERE o.id=$1
     ORDER BY oi.created_at`,
    [orderId]
  );

  if(orderResult.rows.length===0){
      return null;
  }

  const historyResult = await pool.query(
    `SELECT
        id AS history_id,
        order_id,
        status,
        changed_by,
        changed_at,
        created_at AS history_created_at,
        updated_at AS history_updated_at
     FROM order_status_history
     WHERE order_id=$1
     ORDER BY changed_at`,
    [orderId]
  );

  return buildOrderDetails(orderResult.rows,historyResult.rows);

}
module.exports = {
  createOrderFromCart,
  findOrdersByUserId,
  findOrderById,
  findAllOrders,
  updateOrderStatus,
  findOrderByIdForAdmin,
};