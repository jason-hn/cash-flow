import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionAPI } from '../../api/transactions';

const CATEGORIES = ['grocery', 'entertainment', 'clothing', 'bills', 'restaurant', 'transportation', 'income'];

export default function TransactionForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'grocery',
    date: new Date().toLocaleString('sv', { dateStyle: 'short', timeStyle: 'short' }).replace(' ', 'T')
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const utcDate = new Date(data.date);
      return TransactionAPI.create({
        ...data,
        date: utcDate.toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setFormData({ 
        amount: '', 
        description: '', 
        category: 'grocery',
        date: new Date().toLocaleString('sv', { dateStyle: 'short', timeStyle: 'short' }).replace(' ', 'T')
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="space-y-4">
        <div>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Amount"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
        {mutation.isError && (
          <p className="text-red-500">Error submitting transaction</p>
        )}
      </div>
    </form>
  );
}