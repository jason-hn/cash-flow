import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '📝' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/budgets', label: 'Budgets', icon: '💰' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="bg-white w-52 h-screen fixed left-0 p-4 shadow-[2px_0_10px_rgba(0,0,0,0.1)]">
      <h3 className="text-lg font-semibold mb-4 text-gray-600">Menu</h3>
      {menuItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center p-3 rounded-lg mb-2 hover:bg-gray-100 transition-colors ${
            location.pathname === item.path ? 'bg-gray-100' : ''
          }`}
        >
          <span className="mr-3 text-lg">{item.icon}</span>
          <span className="text-gray-700">{item.label}</span>
        </Link>
      ))}
    </div>
  );
} 