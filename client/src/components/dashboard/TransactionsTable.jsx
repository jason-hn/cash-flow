export default function TransactionsTable({ transactions }) {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-4 text-left text-gray-600 font-semibold">Date</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Category</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Amount</th>
            <th className="p-4 text-left text-gray-600 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id} className="border-t border-gray-100">
              <td className="p-4 text-gray-600">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="p-4">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                  'bg-primary text-white'
                }`}>
                  {transaction.category.toUpperCase()}
                </span>
              </td>
              {/* <td className="p-4 text-gray-600">
                {getEmoji(transaction.category)} {transaction.category}
              </td> */}
              <td className={`p-4 font-medium ${
                transaction.category === 'income' 
                  ? 'text-income-green' : 'text-expense-red'
              }`}>
                {transaction.category === 'income' ? '+':'-'}
                ${Math.abs(transaction.amount).toFixed(2)}
              </td>
              <td className="p-4 text-gray-600">{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to get emoji for category
function getEmoji(category) {
  const emojis = {
    salary: '💼',
    freelance: '💻',
    investments: '📈',
    groceries: '🛒',
    rent: '🏠',
    utilities: '💡',
    entertainment: '🎬',
    transport: '🚗',
    other: '📝'
  };
  return emojis[category.toLowerCase()] || '📝';
} 