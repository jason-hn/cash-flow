import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionAPI } from '../../api/transactions';
import TransactionModal from '../transactions/TransactionModal';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function TransactionsTable({ transactions }) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

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

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination controls with ARIA labels
  const PaginationButton = ({ onClick, disabled, children, ariaLabel }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`px-3 py-1 border border-gray-200 rounded-md flex items-center gap-1 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="w-1/6 p-4 text-left text-gray-600 font-semibold">Date</th>
            <th className="w-1/6 p-4 text-left text-gray-600 font-semibold">Type</th>
            <th className="w-1/6 p-4 text-left text-gray-600 font-semibold">Category</th>
            <th className="w-1/6 p-4 text-left text-gray-600 font-semibold">Amount</th>
            <th className="w-2/6 p-4 text-left text-gray-600 font-semibold">Description</th>
            <th className="w-1/6 p-4 text-left text-gray-600 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Conditional rendering for empty table */}
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📭</span>
                  No transactions found
                </div>
              </td>
            </tr>
          )}
          {/* paginated transaction records */}
          {paginatedTransactions.map(transaction => (
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
              <td className="p-4 text-gray-600 max-w-xs truncate" title={transaction.description}>
                {transaction.description}
              </td>
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
      {/* Transaction modal */}
      {editingTransaction && ( 
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          mode="edit"
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-100 gap-4">
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, transactions.length)} of{' '}
          {transactions.length} results
        </span>
        
        <div className="flex gap-2">
          <PaginationButton
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            ariaLabel="Previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </PaginationButton>
          
          <PaginationButton
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            ariaLabel="Next page"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </PaginationButton>
        </div>
      </div>
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