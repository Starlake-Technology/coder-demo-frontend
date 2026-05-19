const apiClient = require('./apiClient');

async function getClients(lastName) {
  const params = lastName ? { lastName } : {};
  const response = await apiClient.get('/api/clients', { params });
  return response.data;
}

async function getClient(id) {
  const response = await apiClient.get(`/api/clients/${id}`);
  return response.data;
}

async function createClient(data) {
  const response = await apiClient.post('/api/clients', data);
  return response.data;
}

module.exports = { getClients, getClient, createClient };
