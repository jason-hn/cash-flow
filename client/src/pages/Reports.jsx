import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TransactionAPI } from '../api/transactions';
import ExpensesPieChart from '../components/dashboard/ExpensesPieChart';
import MonthlyTrendsChart from '../components/dashboard/MonthlyTrendsChart';

export default function Reports() {
  const [dateRange, setDateRange] = useState('30days');
  
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: TransactionAPI.getAll
  });

  // Filter transactions based on selected date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    
    switch (dateRange) {
      case '30days':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return transactionDate >= thirtyDaysAgo;
        
      case '6months':
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        return transactionDate >= sixMonthsAgo;
        
      default:
        return true;
    }
  });

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toISOString().split('T')[0],
        t.type,
        t.category,
        t.amount,
        `"${t.description}"` // Wrap description in quotes to handle commas
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="flex gap-4 mb-6">
        <select
          className="p-3 border border-gray-200 rounded-lg"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="all">All Time</option>
        </select>

        <button
          onClick={handleExportCSV}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
        >
          Export CSV
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-6 rounded-xl shadow-card w-full">
            <h3 className="text-center text-gray-600 mb-6">Spending by Category</h3>
            <div className="h-[500px]">
              <ExpensesPieChart transactions={filteredTransactions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-card w-full">
            <h3 className="text-center text-gray-600 mb-6">Income vs. Expenses Trend</h3>
            <div className="h-[500px]">
              <MonthlyTrendsChart transactions={filteredTransactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 