import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyTrendsChart({ transactions }) {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      acc[monthKey].income += Number(t.amount);
    } else {
      acc[monthKey].expenses += Number(t.amount);
    }
    
    return acc;
  }, {});

  const months = Object.keys(monthlyData).sort();

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(month => monthlyData[month].income),
        borderColor: '#6AC259',
        backgroundColor: '#6AC259',
      },
      {
        label: 'Expenses',
        data: months.map(month => monthlyData[month].expenses),
        borderColor: '#E94F4F',
        backgroundColor: '#E94F4F',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Segoe UI', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.formattedValue}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value}`
        }
      }
    }
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
} 