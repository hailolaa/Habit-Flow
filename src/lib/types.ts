export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDays: string[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  remarks: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'yearly' | 'seasonal';
  checklist: ChecklistItem[];
  deadline?: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: {
    type: 'streak' | 'total' | 'goals' | 'journal';
    count: number;
  };
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalHabitsCompleted: number;
  totalGoalsCompleted: number;
  totalJournalEntries: number;
}
