import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Budgets from './pages/Budgets';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="h-screen">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected app routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-bg">
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 pt-8 overflow-x-auto min-w-0 ml-32 lg:ml-48">
                        <div className="p-6 mx-auto w-full max-w-[120rem]">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/budgets" element={<Budgets />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </div>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
