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

async function createMenuItem(item) {
  const result = await query(
    `INSERT INTO canteen_menu_items
    (
      category_id,
      name,
      description,
      price,
      available,
      meal_periods
    )
    VALUES
    ($1, $2, $3, $4, $5, $6::jsonb)
    RETURNING *`,
    [
      item.categoryId,
      item.name,
      item.description,
      item.price,
      item.available,
      JSON.stringify(item.mealPeriods)
    ]
  );

  return result.rows[0];
}
async function updateMenuItem(id, item) {
  const result = await query(
    `UPDATE canteen_menu_items
     SET
       category_id = $2,
       name = $3,
       description = $4,
       price = $5,
       available = $6,
       meal_periods = $7::jsonb,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      item.categoryId,
      item.name,
      item.description,
      item.price,
      item.available,
      JSON.stringify(item.mealPeriods)
    ]
  );

  return result.rows[0];
}
async function deleteMenuItem(id) {
  const result = await query(
    `UPDATE canteen_menu_items
     SET
       available = false,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
async function updateMenuAvailability(id, available) {
  const result = await query(
    `UPDATE canteen_menu_items
     SET
       available = $2,
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, available]
  );

  return result.rows[0];
}
async function createCategory(category) {
  const result = await query(
    `INSERT INTO canteen_categories
    (
      name,
      sort_order
    )
    VALUES
    ($1, $2)
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
    `UPDATE canteen_categories
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
  const result = await query(
    `DELETE FROM canteen_categories
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
module.exports = {
  findAllCategories,
  findAllMenuItems,
  findMenuItemById,
  findMenuItemsByCategoryId,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuAvailability,
  createCategory,
  updateCategory,
  deleteCategory
};