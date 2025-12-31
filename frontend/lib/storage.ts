import { Habit, TodoItem, JournalEntry, Goal, Badge, UserStats } from './types';

const API_Base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper for API calls
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  // Add Auth Token if available
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  }

  const res = await fetch(`${API_Base}${endpoint}`, {
    headers: { ...headers, ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.statusText}`);
  }
  return res.json();
}

// Habits
export const getHabits = async (): Promise<Habit[]> => {
  try {
    return await fetchAPI<Habit[]>('/habits');
  } catch (err) {
    console.warn('Failed to fetch habits, using empty list', err);
    return [];
  }
};

export const setHabits = async (habits: Habit[]) => {
  // Note: This function signature in the old storage.ts implied replacing the whole list.
  // In a real API, we usually Add/Update/Delete individually.
  // For migration compatibility, we might not use this "setAll" function directly 
  // but rather rely on the individual Add/Toggle/Delete methods in the components.
  // However, if the frontend logic relies on "save whole state", we'd need a bulk update endpoint.
  // For now, we will log a warning that this is not optimal for API usage.
  console.warn('setHabits (bulk replace) is not fully supported in API mode. Use specific add/update actions.');
};

// TODOS
export const getTodos = async (): Promise<TodoItem[]> => {
  try { return await fetchAPI<TodoItem[]>('/todos'); }
  catch { return []; }
};
export const setTodos = async (todos: TodoItem[]) => { /* Warning: Bulk update not impl */ };

// JOURNAL
export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try { return await fetchAPI<JournalEntry[]>('/journal'); }
  catch { return []; }
};
export const setJournalEntries = async (entries: JournalEntry[]) => { };

// GOALS
export const getGoals = async (): Promise<Goal[]> => {
  try { return await fetchAPI<Goal[]>('/goals'); }
  catch { return []; }
};
export const setGoals = async (goals: Goal[]) => { };

// BADGES
export const getBadges = async (): Promise<Badge[]> => {
  try { return await fetchAPI<Badge[]>('/badges'); }
  catch { return []; }
};
export const setBadges = async (badges: Badge[]) => { };

// STATS
export const getStats = async (): Promise<UserStats> => {
  try { return await fetchAPI<UserStats>('/stats'); }
  catch {
    return { currentStreak: 0, longestStreak: 0, totalHabitsCompleted: 0, totalGoalsCompleted: 0, totalJournalEntries: 0 };
  }
};
export const setStats = async (stats: UserStats) => {
  await fetchAPI('/stats', { method: 'PUT', body: JSON.stringify(stats) });
};

// API specific actions (New exports to replace the "setXXX" patterns)

export const api = {
  auth: {
    login: (email: string, password: string) => fetchAPI<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name: string, email: string, password: string) => fetchAPI<any>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    getMe: () => fetchAPI<any>('/auth/me'),
  },
  habits: {
    create: (data: Partial<Habit>) => fetchAPI('/habits', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Habit>) => fetchAPI(`/habits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/habits/${id}`, { method: 'DELETE' }),
  },
  todos: {
    create: (data: Partial<TodoItem>) => fetchAPI('/todos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TodoItem>) => fetchAPI(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/todos/${id}`, { method: 'DELETE' }),
  },
  journal: {
    create: (data: Partial<JournalEntry>) => fetchAPI('/journal', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<JournalEntry>) => fetchAPI(`/journal/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  goals: {
    create: (data: Partial<Goal>) => fetchAPI('/goals', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Goal>) => fetchAPI(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/goals/${id}`, { method: 'DELETE' }),
  },
  badges: {
    create: (data: Partial<Badge>) => fetchAPI('/badges', { method: 'POST', body: JSON.stringify(data) }),
  }
};
