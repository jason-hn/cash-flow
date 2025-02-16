import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionAPI } from '../../api/transactions';
import { CATEGORIES, CATEGORY_DETAILS } from '../../utils/constants';
import { parseISO, format, startOfDay, addHours } from 'date-fns';

export default function TransactionModal({ isOpen, onClose, transaction, mode = 'create' }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  
  // Initialize type and formData using a function to ensure consistent default values
  const getInitialType = () => transaction?.type || 'income';
  const getInitialFormData = () => ({
    amount: transaction?.amount || '',
    category: transaction?.category || (transaction?.type === 'expense' ? 'groceries' : 'salary'),
    date: transaction?.date ? 
      format(parseISO(transaction.date), 'yyyy-MM-dd') : 
      format(new Date(), 'yyyy-MM-dd'),
    description: transaction?.description || ''
  });

  const [type, setType] = useState(getInitialType());
  const [formData, setFormData] = useState(getInitialFormData());

  // Reset form when modal opens/closes or transaction changes
  useEffect(() => {
    if (isOpen) {
      setType(getInitialType());
      setFormData(getInitialFormData());
    }
  }, [isOpen, transaction]);

  const categories = {
    income: CATEGORIES.filter(cat => CATEGORY_DETAILS[cat].type === 'income')
      .map(cat => ({
        value: cat,
        label: CATEGORY_DETAILS[cat].label
      })),
    expense: CATEGORIES.filter(cat => CATEGORY_DETAILS[cat].type === 'expense')
      .map(cat => ({
        value: cat,
        label: CATEGORY_DETAILS[cat].label
      }))
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      if (mode === 'edit') {
        return TransactionAPI.update(transaction._id, data);
      }
      return TransactionAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      setError(null);
      onClose();
    },
    onError: (error) => {
      setError(error.message || 'Failed to save transaction');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse the date string and set to start of day in local timezone
    const baseDate = startOfDay(parseISO(formData.date));
    
    // Add 1 hour buffer to ensure same date across timezones
    const adjustedDate = addHours(baseDate, 1);
    
    mutation.mutate({
      type,
      amount: Math.abs(Number(formData.amount)),
      category: formData.category,
      date: adjustedDate.toISOString(),
      description: formData.description
    });
  };

   // Reset category when type changes
   const handleTypeChange = (newType) => {
    setType(newType);
    setFormData(prev => ({
      ...prev,
      category: newType === 'income' ? 'salary' : 'groceries' // Default categories
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-[400px] relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${
              type === 'income' 
                ? 'bg-income-green text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Income 💰
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${
              type === 'expense' 
                ? 'bg-expense-red text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Expense 🛒
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Amount</label>
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

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Category</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories[type].map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Date</label>
            <input
              type="date"
              required
              className="w-full p-3 border border-gray-200 rounded-lg"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Description</label>
            <input
              type="text"
              placeholder="Notes"
              className="w-full p-3 border border-gray-200 rounded-lg"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
} 