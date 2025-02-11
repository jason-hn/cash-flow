import { useState, useEffect } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TransactionAPI } from '../api/transactions';
import { handleAPIError } from '../utils/error';

export default function TransactionList({ transactions, period, onTransactionChange }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: ''
  });
  const queryClient = useQueryClient();

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (transaction) => TransactionAPI.update(transaction._id, {
      ...transaction,
      amount: editForm.amount
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setEditingId(null);
    },
    onError: handleAPIError
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => TransactionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: handleAPIError
  });

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return "Today's";
      case 'monthly':
        return "This Month's";
      default:
        return 'All';
    }
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    // Parse the ISO string and get date in YYYY-MM-DD format
    const dateKey = format(parseISO(transaction.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {});

  // Format date for display
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d');
    }
  };

  const startEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      amount: transaction.amount
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {getPeriodLabel()} Transactions
      </h2>
      <div className="space-y-6">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-gray-50 py-2">
                {formatDate(date)}
              </h3>
              <div className="space-y-2">
                {dayTransactions.map(transaction => (
                  <div 
                    key={transaction._id}
                    className="grid grid-cols-[140px_1fr_120px_100px] items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white gap-4"
                  >
                    <span className={`px-3 py-1 rounded-full text-sm text-center ${
                      transaction.category === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                    </span>
                    <span className="text-gray-600 text-left truncate">
                      {transaction.description || '-'}
                    </span>
                    {editingId === transaction._id ? (
                      <div className="col-span-2 flex items-center gap-2">
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className="w-24 p-1 border rounded"
                        />
                        <button
                          onClick={() => updateMutation.mutate(transaction)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-lg font-semibold text-right ${
                          transaction.category === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.category === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                        </span>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(transaction)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 