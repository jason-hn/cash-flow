import { useState } from 'react';
import CategoryManager from './CategoryManager';
export default function SettingsForm() {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    currency: 'USD',
    budgetAlerts: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement settings update logic
    console.log('Settings updated:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="max-w-md space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-200 rounded-lg"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border border-gray-200 rounded-lg"
            value={formData.newPassword}
            onChange={e => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryManager />

      {/* Preferences Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="max-w-md space-y-4">
          <select
            className="w-full p-3 border border-gray-200 rounded-lg"
            value={formData.currency}
            onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.budgetAlerts}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                budgetAlerts: e.target.checked 
              }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-gray-700">Receive Budget Alerts</span>
          </label>
        </div>
      </section>
    </form>
  );
} 