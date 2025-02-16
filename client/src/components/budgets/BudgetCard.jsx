import { CATEGORY_DETAILS } from '../../utils/constants';

export default function BudgetCard({ budget, spent, onEdit }) {
  const percentage = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;
  const isOverBudget = remaining < 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {CATEGORY_DETAILS[budget.category].label}
          </h3>
          <p className="text-gray-600 mt-2">
            ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
          </p>
        </div>
        
        <div className="w-[60%]">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isOverBudget ? 'bg-expense-red' : 'bg-income-green'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          
          <p className={`mt-2 text-sm font-medium ${
            isOverBudget ? 'text-expense-red' : 'text-income-green'
          }`}>
            {isOverBudget 
              ? `$${Math.abs(remaining).toFixed(2)} over budget`
              : `$${remaining.toFixed(2)} remaining`
            }
          </p>
        </div>
      </div>
    </div>
  );
} 