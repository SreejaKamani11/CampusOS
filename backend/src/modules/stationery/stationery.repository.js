const { query } = require('../../config/database');

async function findAllProducts() {
  const result = await query(
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
INNER JOIN stationery_categories sc
ON sc.id = sp.category_id
WHERE sp.active = true
ORDER BY sc.name ASC, sp.name ASC`,
    []
  );

  return result.rows;
}

async function findAllCategories() {
  const result = await query(
    `SELECT
       id,
       name,
       created_at,
       updated_at
     FROM stationery_categories
     ORDER BY name ASC`,
    []
  );

  return result.rows;
}
async function createProduct(product) {
  const result = await query(
    `INSERT INTO stationery_products
    (
      category_id,
      name,
      description,
      price,
      stock,
      image_url,
      active
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,true)
    RETURNING *`,
    [
      product.categoryId,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.imageUrl
    ]
  );

  return result.rows[0];
}
async function updateProduct(id, product) {
  const result = await query(
    `UPDATE stationery_products
     SET
       category_id = $2,
       name = $3,
       description = $4,
       price = $5,
       stock = $6,
       image_url = $7,
       active = $8,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      product.categoryId,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.imageUrl,
      product.active
    ]
  );

  return result.rows[0];
}

     
async function deleteProduct(id) {
  const result = await query(
    `UPDATE stationery_products
     SET
       active = false,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
async function updateStock(id, stock) {
  const result = await query(
    `UPDATE stationery_products
     SET
       stock = $2,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, stock]
  );

  return result.rows[0];
}
async function createCategory(category) {
  const result = await query(
    `INSERT INTO stationery_categories
    (
      name,
      sort_order
    )
    VALUES
    ($1,$2)
    RETURNING *`,
    [
      category.name,
      category.sortOrder
    ]
  );

  return result.rows[0];
}
async function updateCategory(id, category) {
  const result = await query(
    `UPDATE stationery_categories
     SET
       name = $2,
       sort_order = $3,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      category.name,
      category.sortOrder
    ]
  );

  return result.rows[0];
}
async function deleteCategory(id) {

  // Check if any products use this category
  const productCheck = await query(
    `
    SELECT COUNT(*) AS count
    FROM stationery_products
    WHERE category_id = $1
    `,
    [id]
  );

  if (Number(productCheck.rows[0].count) > 0) {
    throw new Error(
      "CATEGORY_IN_USE"
    );
  }

  const result = await query(
    `
    DELETE FROM stationery_categories
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}
module.exports = {
  findAllProducts,
  findAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
 createCategory,
  updateCategory,
  deleteCategory

};