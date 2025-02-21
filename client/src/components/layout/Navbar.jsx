import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import TransactionModal from '../transactions/TransactionModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  
  return (
    <>
      <div className="bg-white px-8 py-4 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            <span>💰</span>
            CashFlow
          </h2>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 whitespace-nowrap"
          >
            + Add Transaction
          </button>
          
          {user && (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 min-w-[160px]"
              >
                <span className="text-sm">{user.email}</span>
                <span className="text-xs">▼</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-6 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <span className="mr-2">⚙️</span>
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <span className="mr-2">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
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