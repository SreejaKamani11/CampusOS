const db = require("../../config/database");

const getDashboardStats = async () => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) AS total_users,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COALESCE(SUM(total), 0) FROM orders) AS total_revenue,
            (SELECT COUNT(*) FROM print_jobs) AS total_print_jobs
    `;

    const { rows } = await db.query(query);

    return rows[0];
};
const getUsers = async (search = "") => {
    let query = `
        SELECT
            id,
            name,
            email,
            campus_id,
            role,
            active,
            created_at
        FROM users
        WHERE deleted_at IS NULL
    `;

    const values = [];

    if (search) {
        query += `
            AND (
                LOWER(name) LIKE LOWER($1)
                OR LOWER(email) LIKE LOWER($1)
                OR LOWER(campus_id) LIKE LOWER($1)
            )
        `;

        values.push(`%${search}%`);
    }

    query += `
        ORDER BY created_at DESC
    `;

    const { rows } = await db.query(query, values);

    return rows;
};
const updateUserStatus = async (userId, active) => {
    const query = `
        UPDATE users
        SET
            active = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            name,
            email,
            active,
            role;
    `;

    const { rows } = await db.query(query, [userId, active]);

    return rows[0];
};
const updateUserRole = async (userId, role) => {
    const query = `
        UPDATE users
        SET
            role = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            name,
            email,
            role,
            active;
    `;

    const { rows } = await db.query(query, [userId, role]);

    return rows[0];
};


module.exports = {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    updateUserRole
};
