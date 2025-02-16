import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BudgetModal from '../components/budgets/BudgetModal';
import BudgetCard from '../components/budgets/BudgetCard';
import { BudgetAPI } from '../api/budgets';
import { TransactionAPI } from '../api/transactions';

export default function Budgets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: BudgetAPI.getAll
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: TransactionAPI.getAll
  });

  // Calculate spent amount for each budget
  const getSpentAmount = (category) => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category &&
        new Date(t.date) >= firstDayOfMonth
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
        >
          + Add Budget
        </button>
      </div>

      <div className="grid gap-4">
        {budgets.map(budget => (
          <BudgetCard
            key={budget._id}
            budget={budget}
            spent={getSpentAmount(budget.category)}
            onEdit={() => {
              setEditingBudget(budget);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        budget={editingBudget}
        mode={editingBudget ? 'edit' : 'create'}
      />
    </div>
  );
} 