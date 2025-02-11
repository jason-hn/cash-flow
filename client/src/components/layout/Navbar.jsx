import { useState } from 'react';
import TransactionModal from '../transactions/TransactionModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white px-8 py-4 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>💰</span>
          CashFlow - Personal Finance Tracker
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
        >
          + Add Transaction
        </button>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 