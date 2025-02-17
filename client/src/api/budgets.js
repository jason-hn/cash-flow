import api from './api';

const handleResponse = (response) => {
  return response.data;
};

export const BudgetAPI = {
  // GET operations
  getAll: () => api.get('/budgets').then(handleResponse),
  
  // CRUD operations
  create: (data) => api.post('/budgets', data).then(handleResponse),
  
  update: (id, data) => api.put(`/budgets/${id}`, data).then(handleResponse),
  
  delete: (id) => api.delete(`/budgets/${id}`).then(handleResponse)
}; 