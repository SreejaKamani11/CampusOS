const adminRepository = require("./admin.repository");

const getDashboard = async () => {
    return await adminRepository.getDashboardStats();
};

const getUsers = async (search) => {
    return await adminRepository.getUsers(search);
};

const updateUserStatus = async (userId, active) => {
    return await adminRepository.updateUserStatus(userId, active);
};

const updateUserRole = async (userId, role) => {
    return await adminRepository.updateUserRole(userId, role);
};

module.exports = {
    getDashboard,
    getUsers,
    updateUserStatus,
    updateUserRole
};