import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TransactionAPI } from '../api/transactions';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { CATEGORIES, CATEGORY_DETAILS } from '../utils/constants';

export default function Transactions() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    date: ''
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: TransactionAPI.getAll
  });

  // Filter transactions based on search, category, and date
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = 
      filters.category === 'all' || transaction.category === filters.category;
    
    const matchesDate = 
      !filters.date || transaction.date.split('T')[0] === filters.date;

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-[300px] p-3 border border-gray-200 rounded-lg"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />

        <select
          className="p-3 border border-gray-200 rounded-lg"
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {CATEGORY_DETAILS[category].label}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="p-3 border border-gray-200 rounded-lg"
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
} 