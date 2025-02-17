import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CATEGORIES, CATEGORY_DETAILS } from '../../utils/constants';
import { BudgetAPI } from '../../api/budgets';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function BudgetModal({ isOpen, onClose, budget, mode = 'create' }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      category: budget?.category || '',
      amount: budget?.amount || '',
    }
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
      toast.success(`Budget ${mode === 'edit' ? 'updated' : 'created'} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} budget`);
    }
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/30 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'edit' ? 'Edit Budget' : 'Create New Budget'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={`w-full p-2 border rounded-md ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={mode === 'edit'}
            >
              <option value="">Select Category</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>
                  {CATEGORY_DETAILS[category].label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              className={`w-full p-2 border rounded-md ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {mode === 'edit' ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 