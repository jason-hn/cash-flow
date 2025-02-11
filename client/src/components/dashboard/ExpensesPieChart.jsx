import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function ExpensesPieChart({ transactions }) {
  // Group transactions by category
  const expensesByCategory = transactions
    .filter(t => t.category != 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount));
      return acc;
    }, {});

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Segoe UI', sans-serif",
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="h-[300px]">
      <Pie data={data} options={options} />
    </div>
  );
} 