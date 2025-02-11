export default function SummaryCard({ title, amount, type = 'neutral' }) {
  const colors = {
    expense: 'text-expense-red',
    income: 'text-income-green',
    neutral: 'text-primary'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${colors[type]}`}>
        {amount}
      </p>
    </div>
  );
} 