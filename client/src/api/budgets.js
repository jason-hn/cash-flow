const BASE_URL = 'http://localhost:5001/api';

export const BudgetAPI = {
  async getAll() {
    const response = await fetch(`${BASE_URL}/budgets`);
    if (!response.ok) {
      throw new Error('Failed to fetch budgets');
    }
    return response.json();
  },

  async create(data) {
    const response = await fetch(`${BASE_URL}/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create budget');
    }
    return response.json();
  },

  async update(id, data) {
    const response = await fetch(`${BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update budget');
    }
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete budget');
    }
    return response.json();
  },
}; 