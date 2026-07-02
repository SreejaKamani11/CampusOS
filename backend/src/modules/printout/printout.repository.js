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
async function findAllPrintJobs() {
  const result = await query(
    `SELECT
        pj.id,
        pj.user_id,
        u.name AS user_name,
        u.email,
        pj.file_name,
        pj.file_path,
        pj.page_count,
        pj.options,
        pj.calculated_price,
        pj.status,
        pj.created_at,
        pj.updated_at
     FROM print_jobs pj
     INNER JOIN users u
        ON u.id = pj.user_id
     ORDER BY pj.created_at DESC`
  );

  return result.rows;
}

async function updatePrintJobStatus(id, status) {
  const result = await query(
    `UPDATE print_jobs
     SET
        status = $2,
        updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status]
  );

  return result.rows[0];
}
module.exports = {
  createPrintJob,
  findPrintJobsByUserId,
  findPrintJobById,
  findAllPrintJobs,
  updatePrintJobStatus,
  
};