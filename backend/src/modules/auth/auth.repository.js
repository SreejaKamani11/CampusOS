const { query } = require('../../config/database');

const USER_COLUMNS = `
  id,
  email,
  password_hash,
  name,
  campus_id,
  role,
  active,
  deleted_at,
  created_at,
  updated_at
`;

function mapPublicUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    campus_id: row.campus_id,
    role: row.role,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function findUserByEmail(email) {
  const result = await query(
    `SELECT ${USER_COLUMNS}
     FROM users
     WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await query(
    `SELECT ${USER_COLUMNS}
     FROM users
     WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );
  return result.rows[0] || null;
}

async function createUser({ email, passwordHash, name, campusId }) {
  const result = await query(
    `INSERT INTO users (email, password_hash, name, campus_id)
     VALUES ($1, $2, $3, $4)
     RETURNING ${USER_COLUMNS}`,
    [email, passwordHash, name, campusId]
  );
  return result.rows[0];
}

async function createRefreshToken({ userId, tokenHash, expiresAt }) {
  const result = await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at, created_at`,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
}

async function deleteRefreshTokenByHash(tokenHash) {
  const result = await query(
    `DELETE FROM refresh_tokens
     WHERE token_hash = $1
     RETURNING id`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

async function findRefreshTokenByHash(tokenHash) {
  const result = await query(
    `SELECT rt.id, rt.user_id, rt.token_hash, rt.expires_at
     FROM refresh_tokens rt
     INNER JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1
       AND rt.expires_at > NOW()
       AND u.deleted_at IS NULL
       AND u.active = TRUE`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

async function deleteRefreshTokenById(id) {
  const result = await query(
    `DELETE FROM refresh_tokens
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  mapPublicUser,
  findUserByEmail,
  findUserById,
  createUser,
  createRefreshToken,
  deleteRefreshTokenByHash,
  findRefreshTokenByHash,
  deleteRefreshTokenById,
};
