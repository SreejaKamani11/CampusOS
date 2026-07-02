import api from "../api/axios";

/* ==========================
   STUDENT ORDER APIs
========================== */

export async function createOrder() {
  const response = await api.post("/orders");
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

/* ==========================
   ADMIN ORDER APIs
========================== */

export async function getAllOrders() {
  const response = await api.get("/admin/orders");
  return response.data;
}

export async function getOrderDetails(id) {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await api.patch(
    `/admin/orders/${id}/status`,
    { status }
  );

  return response.data;
}