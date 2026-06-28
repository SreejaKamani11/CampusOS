const { query } = require('../../config/database');

async function createPrintJob({ userId, filePath, fileName, pageCount, options, calculatedPrice }) {
  const result = await query(
    `INSERT INTO print_jobs (
       user_id,
       file_path,
       file_name,
       page_count,
       options,
       calculated_price
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       user_id,
       file_path,
       file_name,
       page_count,
       options,
       calculated_price,
       created_at,
       updated_at`,
    [userId, filePath, fileName, pageCount, options, calculatedPrice]
  );

  return result.rows[0];
}

async function findPrintJobsByUserId(userId) {
  const result = await query(
    `SELECT
       id,
       user_id,
       file_path,
       file_name,
       page_count,
       options,
       calculated_price,
       created_at,
       updated_at
     FROM print_jobs
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function findPrintJobById(userId, id) {
  const result = await query(
    `SELECT
       id,
       user_id,
       file_path,
       file_name,
       page_count,
       options,
       calculated_price,
       created_at,
       updated_at
     FROM print_jobs
     WHERE user_id = $1
       AND id = $2`,
    [userId, id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createPrintJob,
  findPrintJobsByUserId,
  findPrintJobById,
};