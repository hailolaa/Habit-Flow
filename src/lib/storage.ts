import { Habit, TodoItem, JournalEntry, Goal, Badge, UserStats } from './types';

const STORAGE_KEYS = {
  HABITS: 'habitflow_habits',
  TODOS: 'habitflow_todos',
  JOURNAL: 'habitflow_journal',
  GOALS: 'habitflow_goals',
  BADGES: 'habitflow_badges',
  STATS: 'habitflow_stats',
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getHabits = (): Habit[] => getFromStorage(STORAGE_KEYS.HABITS, defaultHabits);
export const setHabits = (habits: Habit[]) => setToStorage(STORAGE_KEYS.HABITS, habits);

export const getTodos = (): TodoItem[] => getFromStorage(STORAGE_KEYS.TODOS, []);
export const setTodos = (todos: TodoItem[]) => setToStorage(STORAGE_KEYS.TODOS, todos);

export const getJournalEntries = (): JournalEntry[] => getFromStorage(STORAGE_KEYS.JOURNAL, []);
export const setJournalEntries = (entries: JournalEntry[]) => setToStorage(STORAGE_KEYS.JOURNAL, entries);

export const getGoals = (): Goal[] => getFromStorage(STORAGE_KEYS.GOALS, defaultGoals);
export const setGoals = (goals: Goal[]) => setToStorage(STORAGE_KEYS.GOALS, goals);

export const getBadges = (): Badge[] => getFromStorage(STORAGE_KEYS.BADGES, defaultBadges);
export const setBadges = (badges: Badge[]) => setToStorage(STORAGE_KEYS.BADGES, badges);

export const getStats = (): UserStats => getFromStorage(STORAGE_KEYS.STATS, defaultStats);
export const setStats = (stats: UserStats) => setToStorage(STORAGE_KEYS.STATS, stats);

const defaultHabits: Habit[] = [
  { id: '1', name: 'Morning Meditation', icon: '🧘', color: 'primary', completedDays: [] },
  { id: '2', name: 'Exercise', icon: '💪', color: 'accent', completedDays: [] },
  { id: '3', name: 'Read 30 mins', icon: '📚', color: 'success', completedDays: [] },
  { id: '4', name: 'Drink 8 glasses', icon: '💧', color: 'primary', completedDays: [] },
  { id: '5', name: 'Sleep by 10pm', icon: '🌙', color: 'accent', completedDays: [] },
];

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: 'Read 4 books',
    description: 'Complete reading 4 books this month',
    type: 'monthly',
    checklist: [
      { id: '1', text: 'Atomic Habits', completed: false },
      { id: '2', text: 'Deep Work', completed: false },
      { id: '3', text: 'The Psychology of Money', completed: false },
      { id: '4', text: 'Thinking Fast and Slow', completed: false },
    ],
    completed: false,
  },
  {
    id: '2',
    title: 'Learn a new language',
    description: 'Reach conversational level in Spanish',
    type: 'yearly',
    checklist: [
      { id: '1', text: 'Complete beginner course', completed: false },
      { id: '2', text: '100 vocabulary words', completed: false },
      { id: '3', text: 'Have first conversation', completed: false },
    ],
    completed: false,
  },
];

const defaultBadges: Badge[] = [
  { id: '1', name: 'First Step', description: 'Complete your first habit', icon: '🌱', requirement: { type: 'total', count: 1 } },
  { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', requirement: { type: 'streak', count: 7 } },
  { id: '3', name: 'Goal Getter', description: 'Complete your first goal', icon: '🎯', requirement: { type: 'goals', count: 1 } },
  { id: '4', name: 'Consistency King', description: 'Maintain a 30-day streak', icon: '👑', requirement: { type: 'streak', count: 30 } },
  { id: '5', name: 'Journal Journey', description: 'Write 10 journal entries', icon: '📝', requirement: { type: 'journal', count: 10 } },
  { id: '6', name: 'Habit Master', description: 'Complete 100 habits', icon: '⭐', requirement: { type: 'total', count: 100 } },
];

const defaultStats: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalHabitsCompleted: 0,
  totalGoalsCompleted: 0,
  totalJournalEntries: 0,
};
