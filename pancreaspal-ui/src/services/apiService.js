import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const patientService = {
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/v1/patients/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  appendHistory: async (patientId, text) => {
    return apiClient.post(`/api/v1/patients/${patientId}/append`, {
      text
    });
  },

  query: async (patientId, query) => {
    return apiClient.post(`/api/v1/patients/${patientId}/query`, {
      query
    });
  },

  getHistory: async (patientId) => {
    return apiClient.get(`/api/v1/patients/${patientId}/history`);
  }
};

export default apiClient;
