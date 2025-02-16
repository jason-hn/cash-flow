import { useState } from 'react';
import { CATEGORIES, CATEGORY_DETAILS } from '../../utils/constants';

export default function CategoryManager() {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    // TODO: Implement category addition logic
    console.log('Adding category:', newCategory);
    setNewCategory('');
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="New Category"
          className="flex-1 p-3 border border-gray-200 rounded-lg"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <span
            key={category}
            className="bg-gray-100 px-4 py-2 rounded-full text-gray-700"
          >
            {CATEGORY_DETAILS[category].label}
          </span>
        ))}
      </div>
    </section>
  );
} 