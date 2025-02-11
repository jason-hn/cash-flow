import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TransactionList from './TransactionList';

const fetchTransactions = async (period) => {
  const url = period === 'all' 
    ? `${import.meta.env.VITE_API_URL}/transactions`
    : `${import.meta.env.VITE_API_URL}/transactions/period?period=${period}`;
  
  const response = await fetch(url);
  return response.json();
};

export default function Dashboard() {
  const [period, setPeriod] = useState('all');
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', period],
    queryFn: () => fetchTransactions(period)
  });

  const balance = transactions.reduce((acc, transaction) => (
    transaction.category === 'income' 
      ? acc + Number(transaction.amount)
      : acc - Number(transaction.amount)
  ), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="monthly">This Month</option>
          <option value="daily">Today</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div>
          <h2 className="text-lg text-gray-600 mb-2">
            {period === 'all' ? 'Total' : period === 'monthly' ? 'Monthly' : 'Daily'} Balance
          </h2>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <TransactionList transactions={transactions} period={period} />
    </div>
  );
} 