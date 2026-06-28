const { query } = require('../../config/database');

async function findAllCategories() {
  const result = await query(
    `SELECT
       id,
       name,
       sort_order,
       created_at,
       updated_at
     FROM canteen_categories
     ORDER BY sort_order ASC, name ASC`,
    []
  );

  return result.rows;
}

async function findAllMenuItems() {
  const result = await query(
    `SELECT
       ci.id,
       ci.category_id,
       cc.name AS category_name,
       ci.name,
       ci.description,
       ci.price,
       ci.available,
       ci.meal_periods,
       ci.created_at,
       ci.updated_at
     FROM canteen_menu_items ci
     INNER JOIN canteen_categories cc
       ON cc.id = ci.category_id
     WHERE ci.available = TRUE
     ORDER BY cc.sort_order ASC, cc.name ASC, ci.name ASC`,
    []
  );

  return result.rows;
}

async function findMenuItemById(id) {
  const result = await query(
    `SELECT
       ci.id,
       ci.category_id,
       cc.name AS category_name,
       ci.name,
       ci.description,
       ci.price,
       ci.available,
       ci.meal_periods,
       ci.created_at,
       ci.updated_at
     FROM canteen_menu_items ci
     INNER JOIN canteen_categories cc
       ON cc.id = ci.category_id
     WHERE ci.id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function findMenuItemsByCategoryId(categoryId) {
  const result = await query(
    `SELECT
       ci.id,
       ci.category_id,
       cc.name AS category_name,
       ci.name,
       ci.description,
       ci.price,
       ci.available,
       ci.meal_periods,
       ci.created_at,
       ci.updated_at
     FROM canteen_menu_items ci
     INNER JOIN canteen_categories cc
       ON cc.id = ci.category_id
     WHERE ci.category_id = $1
       AND ci.available = TRUE
     ORDER BY ci.name ASC`,
    [categoryId]
  );

  return result.rows;
}

module.exports = {
  findAllCategories,
  findAllMenuItems,
  findMenuItemById,
  findMenuItemsByCategoryId,
};