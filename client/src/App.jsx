import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import TransactionForm from './components/TransactionForm'
import Dashboard from './components/Dashboard'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-2xl mx-auto p-4">
        <div className="grid gap-8">
          <Dashboard />
          <TransactionForm />
        </div>
      </div>
    </QueryClientProvider>
  )
}
