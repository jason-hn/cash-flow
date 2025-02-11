import { useQuery } from '@tanstack/react-query';
import { TransactionAPI } from '../api/transactions';
import SummaryCard from '../components/dashboard/SummaryCard';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import ExpensesPieChart from '../components/dashboard/ExpensesPieChart';
import MonthlyTrendsChart from '../components/dashboard/MonthlyTrendsChart';

export default function Dashboard() {
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: TransactionAPI.getAll
  });

  // Calculate summary statistics
  const stats = transactions.reduce((acc, t) => {
    const amount = Math.abs(Number(t.amount));
    if (t.category === 'income') {
      acc.totalIncome += amount;
    } else {
      acc.totalExpenses += amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0 });

  const netSavings = stats.totalIncome - stats.totalExpenses;

  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Total Income" 
          amount={`$${stats.totalIncome.toFixed(2)}`}
          type="income"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={`$${stats.totalExpenses.toFixed(2)}`}
          type="expense"
        />
        <SummaryCard 
          title="Net Savings" 
          amount={`$${Math.abs(netSavings).toFixed(2)}`}
          type={netSavings >= 0 ? "income" : "expense"}
        />
        <SummaryCard 
          title="Remaining Budget" 
          amount="$500.00"
          type="income"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-card">
          <h3 className="text-center text-gray-600 mb-4">Expenses by Category</h3>
          <ExpensesPieChart transactions={transactions} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <h3 className="text-center text-gray-600 mb-4">Monthly Trends</h3>
          <MonthlyTrendsChart transactions={transactions} />
        </div>
      </div>

      <TransactionsTable transactions={transactions} />
    </div>
  );
} 