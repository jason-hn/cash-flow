import { create } from 'zustand';
import api from '../api/api';
import { queryClient } from '../App';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  
  // Actions
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isLoading: false });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    queryClient.clear();
    set({ user: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      
      set({ isLoading: true, token });
      const res = await api.get('/me');
      set({ user: res.data.user, token, isLoading: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));

export default useAuthStore; 