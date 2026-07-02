import api from "../api/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};
export const getUsers = async (search = "") => {
  const response = await api.get("/admin/users", {
    params: { search },
  });
  return response.data;
};

export const updateUserStatus = async (id, active) => {
  const response = await api.patch(
    `/admin/users/${id}/status`,
    { active }
  );
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(
    `/admin/users/${id}/role`,
    { role }
  );
  return response.data;
};
