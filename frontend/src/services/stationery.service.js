import api from "../api/axios";

// ============================
// Student APIs
// ============================

export async function getProducts() {
  const response = await api.get("/stationery/products");
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/stationery/categories");
  return response.data;
}

// ============================
// Admin APIs
// ============================

export async function getAdminProducts() {
  const response = await api.get("/admin/stationery");
  return response.data;
}

export async function createProduct(product) {
  const response = await api.post("/admin/stationery", product);
  return response.data;
}

export async function updateProduct(id, product) {
  const response = await api.put(`/admin/stationery/${id}`, product);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/admin/stationery/${id}`);
  return response.data;
}

export async function updateStock(id, stock) {
  const response = await api.patch(
    `/admin/stationery/${id}/stock`,
    {
      stock,
    }
  );

  return response.data;
}

// ============================
// Category APIs
// ============================

export async function getAdminCategories() {
  const response = await api.get("/admin/stationery/categories");
  return response.data;
}

export async function createCategory(category) {
  const response = await api.post(
    "/admin/stationery/categories",
    category
  );

  return response.data;
}

export async function updateCategory(id, category) {
  const response = await api.put(
    `/admin/stationery/categories/${id}`,
    category
  );

  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(
    `/admin/stationery/categories/${id}`
  );

  return response.data;
}