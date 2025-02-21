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
    const amount = Number(t.amount);
    if (t.type === 'income') {
      acc.totalIncome += amount;
    } else {
      acc.totalExpenses += amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0 });

  const netSavings = stats.totalIncome - stats.totalExpenses;
  const remainingBudget = 2000 - stats.totalExpenses; // Example monthly budget of $3000

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Monthly Income" 
          amount={`$${stats.totalIncome.toFixed(2)}`}
          type="income"
          className="min-w-[200px]"
        />
        <SummaryCard 
          title="Monthly Expenses" 
          amount={`$${stats.totalExpenses.toFixed(2)}`}
          type="expense"
          className="min-w-[200px]"
        />
        <SummaryCard 
          title="Monthly Savings" 
          amount={`$${Math.abs(netSavings).toFixed(2)}`}
          type={netSavings >= 0 ? "income" : "expense"}
          className="min-w-[200px]"
        />
        <SummaryCard 
          title="Remaining Budget" 
          amount={`$${remainingBudget.toFixed(2)}`}
          type={remainingBudget >= 0 ? "income" : "expense"}
          className="min-w-[200px]"
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