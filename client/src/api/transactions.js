export class APIError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new APIError(error.message, response.status);
  }
  return response.json();
};

export const TransactionAPI = {
  // GET operations
  getAll: () => fetch(`${import.meta.env.VITE_API_URL}/transactions`).then(handleResponse),
  
  getByPeriod: (period) => 
    fetch(`${import.meta.env.VITE_API_URL}/transactions/period?period=${period}`)
      .then(handleResponse),

  // CRUD operations
  create: (data) => fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  update: (id, data) => fetch(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  delete: (id) => fetch(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
    method: 'DELETE'
  }).then(handleResponse)
}; 