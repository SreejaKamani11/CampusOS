import api from "../api/axios";

/* ===========================
   STUDENT APIs
=========================== */

export async function getMenu() {
  const response = await api.get("/canteen/menu");
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/canteen/categories");
  return response.data;
}

export async function addToCart(menuItemId) {
  const response = await api.post("/cart/items", {
    serviceType: "canteen",
    referenceId: menuItemId,
    quantity: 1,
  });

  return response.data;
}

/* ===========================
   ADMIN MENU APIs
=========================== */

export async function getAdminMenu() {
  const response = await api.get("/admin/canteen/menu");
  return response.data;
}

export async function createMenuItem(data) {
  const response = await api.post("/admin/canteen/menu", data);
  return response.data;
}

export async function updateMenuItem(id, data) {
  const response = await api.put(`/admin/canteen/menu/${id}`, data);
  return response.data;
}

export async function deleteMenuItem(id) {
  const response = await api.delete(`/admin/canteen/menu/${id}`);
  return response.data;
}

export async function updateAvailability(id, available) {
  const response = await api.patch(
    `/admin/canteen/menu/${id}/availability`,
    { available }
  );

  return response.data;
}

/* ===========================
   ADMIN CATEGORY APIs
=========================== */

export async function getAdminCategories() {
  const response = await api.get("/admin/canteen/categories");
  return response.data;
}

export async function createCategory(data) {
  const response = await api.post("/admin/canteen/categories", data);
  return response.data;
}

export async function updateCategory(id, data) {
  const response = await api.put(`/admin/canteen/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/admin/canteen/categories/${id}`);
  return response.data;
}