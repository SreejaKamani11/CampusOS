import api from '../api/axios'

export async function createPrintJob(formData) {
  const response = await api.post('/printout', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function getPrintJobs() {
  const response = await api.get('/printout')
  return response.data
}

export async function getPrintJob(id) {
  const response = await api.get(`/printout/${id}`)
  return response.data
}
/* ==========================
   ADMIN PRINT JOB APIs
========================== */

export async function getAllPrintJobs() {
  const response = await api.get("/admin/printjobs");
  return response.data;
}

export async function updatePrintJobStatus(id, status) {
  const response = await api.patch(
    `/admin/printjobs/${id}/status`,
    { status }
  );

  return response.data;
}