import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CATEGORIES, CATEGORY_DETAILS } from '../../utils/constants';
import { BudgetAPI } from '../../api/budgets';

export default function BudgetModal({ isOpen, onClose, budget, mode = 'create' }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    category: budget?.category || 'groceries',
    amount: budget?.amount || ''
  });

  // Only show expense categories for budgets
  const expenseCategories = CATEGORIES.filter(cat => 
    CATEGORY_DETAILS[cat].type === 'expense'
  );

  const mutation = useMutation({
    mutationFn: (data) => {
      if (mode === 'edit') {
        return BudgetAPI.update(budget._id, data);
      }
      return BudgetAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      onClose();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      category: formData.category,
      amount: Number(formData.amount)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-[400px] relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {mode === 'edit' ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Category</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {expenseCategories.map(category => (
                <option key={category} value={category}>
                  {CATEGORY_DETAILS[category].label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Monthly Budget Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="$0.00"
              className="w-full p-3 border border-gray-200 rounded-lg"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Budget
          </button>
        </form>
      </div>
    </div>
  );
} 