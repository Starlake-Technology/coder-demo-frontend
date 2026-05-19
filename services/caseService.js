const apiClient = require('./apiClient');

async function getCases(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.caseType) params.caseType = filters.caseType;
  const response = await apiClient.get('/api/cases', { params });
  return response.data;
}

async function getCase(id) {
  const response = await apiClient.get(`/api/cases/${id}`);
  return response.data;
}

async function createCase(data) {
  const response = await apiClient.post('/api/cases', data);
  return response.data;
}

async function updateCaseStatus(id, status) {
  const response = await apiClient.patch(`/api/cases/${id}/status`, null, {
    params: { status }
  });
  return response.data;
}

module.exports = { getCases, getCase, createCase, updateCaseStatus };
