import api from './api';
// import { APIError } from './error';

const handleResponse = (response) => {
  return response.data;
};

export const TransactionAPI = {
  // GET operations
  getAll: () => api.get('/transactions').then(handleResponse),
  
  getByPeriod: (period) => 
    api.get(`/transactions/period?period=${period}`).then(handleResponse),

  // CRUD operations
  create: (data) => api.post('/transactions', data).then(handleResponse),

  update: (id, data) => api.put(`/transactions/${id}`, data).then(handleResponse),

  delete: (id) => api.delete(`/transactions/${id}`).then(handleResponse)
}; 