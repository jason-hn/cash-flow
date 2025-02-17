import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import TransactionModal from '../transactions/TransactionModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuthStore();
  
  return (
    <>
      <div className="bg-white px-8 py-4 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] fixed top-0 left-0 right-0 z-50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>💰</span>
          CashFlow - Personal Finance Tracker
          {user?.email || 'CashFlow'}
        </h2>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 whitespace-nowrap"
          >
            + Add Transaction
          </button>
          {user && (
            <button 
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 whitespace-nowrap"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 