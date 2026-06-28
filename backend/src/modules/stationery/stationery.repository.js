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

module.exports = {
  findAllProducts,
  findAllCategories,
};