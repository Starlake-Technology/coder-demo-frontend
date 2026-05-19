const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

module.exports = apiClient;
