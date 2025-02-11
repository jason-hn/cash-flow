import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionAPI } from '../../api/transactions';
import TransactionModal from '../transactions/TransactionModal';

export default function TransactionsTable({ transactions }) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => TransactionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-4 text-left text-gray-600 font-semibold">Date</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Type</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Category</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Amount</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Description</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id} className="border-t border-gray-100">
              <td className="p-4 text-gray-600">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="p-4">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                  transaction.type === 'expense' 
                    ? 'bg-expense-red text-white' 
                    : 'bg-income-green text-white'
                }`}>
                  {transaction.type.toUpperCase()}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                {getEmoji(transaction.category)} {transaction.category}
              </td>
              <td className={`p-4 font-medium ${
                transaction.type === 'expense' 
                  ? 'text-expense-red' 
                  : 'text-income-green'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}
                ${transaction.amount.toFixed(2)}
              </td>
              <td className="p-4 text-gray-600">{transaction.description}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="px-3 py-1 text-sm font-medium text-expense-red hover:bg-expense-red/10 rounded-lg transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          mode="edit"
        />
      )}
    </div>
  );
}

// Helper function to get emoji for category
function getEmoji(category) {
  const emojis = {
    // Income categories
    salary: '💼',
    freelance: '💻',
    investments: '📈',
    
    // Expense categories
    clothing: '👕',
    groceries: '🛒',
    restaurant: '🍽️',
    rent: '🏠',
    utilities: '💡',
    transportation: '🚗',
    entertainment: '🎬'
  };
  return emojis[category.toLowerCase()] || '📝';
} 