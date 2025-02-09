import { useState } from 'react'
import './App.css'
import TransactionForm from './components/TransactionForm'
import Dashboard from './components/Dashboard'

export default function App() {
  const [period, setPeriod] = useState('all');

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="grid gap-8">
        <Dashboard period={period} setPeriod={setPeriod} />
        <TransactionForm />
      </div>
    </div>
  )
}
