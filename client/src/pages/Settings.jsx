import SettingsForm from '../components/settings/SettingsForm';

export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-card">
        <SettingsForm />
      </div>
    </div>
  );
} 