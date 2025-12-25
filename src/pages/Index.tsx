import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Flame, Target, BookOpen, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DailyHabits } from '@/components/dashboard/DailyHabits';
import { DailyTodos } from '@/components/dashboard/DailyTodos';
import { JournalWidget } from '@/components/dashboard/JournalWidget';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { GoalsView } from '@/components/goals/GoalsView';
import { JournalView } from '@/components/journal/JournalView';
import { AchievementsView } from '@/components/achievements/AchievementsView';
import { Button } from '@/components/ui/button';

import { 
  Habit, 
  TodoItem, 
  JournalEntry, 
  Goal, 
  Badge, 
  UserStats,
  ChecklistItem 
} from '@/lib/types';
import {
  getHabits, setHabits,
  getTodos, setTodos,
  getJournalEntries, setJournalEntries,
  getGoals, setGoals,
  getBadges, setBadges,
  getStats, setStats,
} from '@/lib/storage';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Data state
  const [habits, setHabitsState] = useState<Habit[]>([]);
  const [todos, setTodosState] = useState<TodoItem[]>([]);
  const [journalEntries, setJournalEntriesState] = useState<JournalEntry[]>([]);
  const [goals, setGoalsState] = useState<Goal[]>([]);
  const [badges, setBadgesState] = useState<Badge[]>([]);
  const [stats, setStatsState] = useState<UserStats>(getStats());

  // Load data on mount
  useEffect(() => {
    setHabitsState(getHabits());
    setTodosState(getTodos());
    setJournalEntriesState(getJournalEntries());
    setGoalsState(getGoals());
    setBadgesState(getBadges());
    setStatsState(getStats());
  }, []);

  // Habit handlers
  const handleToggleHabit = (habitId: string, date: string) => {
    setHabitsState(prev => {
      const updated = prev.map(habit => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDays.includes(date);
          return {
            ...habit,
            completedDays: isCompleted 
              ? habit.completedDays.filter(d => d !== date)
              : [...habit.completedDays, date]
          };
        }
        return habit;
      });
      setHabits(updated);
      
      // Update stats
      const totalCompleted = updated.reduce((acc, h) => acc + h.completedDays.length, 0);
      const newStats = { ...stats, totalHabitsCompleted: totalCompleted };
      setStats(newStats);
      setStatsState(newStats);
      
      // Check for badge unlocks
      checkBadgeUnlocks(newStats);
      
      return updated;
    });
  };

  const handleAddHabit = (habit: Omit<Habit, 'id' | 'completedDays'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      completedDays: [],
    };
    setHabitsState(prev => {
      const updated = [...prev, newHabit];
      setHabits(updated);
      return updated;
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabitsState(prev => {
      const updated = prev.filter(h => h.id !== habitId);
      setHabits(updated);
      return updated;
    });
  };

  // Todo handlers
  const handleAddTodo = (text: string, date: string) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      date,
    };
    setTodosState(prev => {
      const updated = [...prev, newTodo];
      setTodos(updated);
      return updated;
    });
  };

  const handleToggleTodo = (id: string) => {
    setTodosState(prev => {
      const updated = prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updated);
      return updated;
    });
  };

  const handleDeleteTodo = (id: string) => {
    setTodosState(prev => {
      const updated = prev.filter(todo => todo.id !== id);
      setTodos(updated);
      return updated;
    });
  };

  // Journal handlers
  const handleSaveJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournalEntriesState(prev => {
      const existingIndex = prev.findIndex(e => e.date === entry.date);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...entry };
      } else {
        updated = [...prev, { ...entry, id: crypto.randomUUID() }];
      }
      setJournalEntries(updated);
      
      // Update stats
      const newStats = { ...stats, totalJournalEntries: updated.length };
      setStats(newStats);
      setStatsState(newStats);
      checkBadgeUnlocks(newStats);
      
      return updated;
    });
  };

  // Goal handlers
  const handleAddGoal = (goal: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      completed: false,
    };
    setGoalsState(prev => {
      const updated = [...prev, newGoal];
      setGoals(updated);
      return updated;
    });
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoalsState(prev => {
      const updated = prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      );
      setGoals(updated);
      return updated;
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoalsState(prev => {
      const updated = prev.filter(g => g.id !== goalId);
      setGoals(updated);
      return updated;
    });
  };

  const handleToggleChecklistItem = (goalId: string, itemId: string) => {
    setGoalsState(prev => {
      const updated = prev.map(goal => {
        if (goal.id === goalId) {
          const checklist = goal.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          const allCompleted = checklist.every(item => item.completed);
          return { ...goal, checklist, completed: allCompleted };
        }
        return goal;
      });
      setGoals(updated);
      
      // Update stats
      const completedGoals = updated.filter(g => g.completed).length;
      const newStats = { ...stats, totalGoalsCompleted: completedGoals };
      setStats(newStats);
      setStatsState(newStats);
      checkBadgeUnlocks(newStats);
      
      return updated;
    });
  };

  const handleAddChecklistItem = (goalId: string, text: string) => {
    setGoalsState(prev => {
      const updated = prev.map(goal => {
        if (goal.id === goalId) {
          const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            text,
            completed: false,
          };
          return { ...goal, checklist: [...goal.checklist, newItem], completed: false };
        }
        return goal;
      });
      setGoals(updated);
      return updated;
    });
  };

  // Badge unlock check
  const checkBadgeUnlocks = (currentStats: UserStats) => {
    setBadgesState(prev => {
      const updated = prev.map(badge => {
        if (badge.unlockedAt) return badge;
        
        let shouldUnlock = false;
        switch (badge.requirement.type) {
          case 'streak':
            shouldUnlock = currentStats.currentStreak >= badge.requirement.count;
            break;
          case 'total':
            shouldUnlock = currentStats.totalHabitsCompleted >= badge.requirement.count;
            break;
          case 'goals':
            shouldUnlock = currentStats.totalGoalsCompleted >= badge.requirement.count;
            break;
          case 'journal':
            shouldUnlock = currentStats.totalJournalEntries >= badge.requirement.count;
            break;
        }
        
        if (shouldUnlock) {
          return { ...badge, unlockedAt: new Date().toISOString() };
        }
        return badge;
      });
      setBadges(updated);
      return updated;
    });
  };

  // Calculate daily progress
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const completedHabitsToday = habits.filter(h => h.completedDays.includes(dateStr)).length;
  const dailyProgress = habits.length > 0 
    ? Math.round((completedHabitsToday / habits.length) * 100) 
    : 0;

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Good {getTimeOfDay()}, friend! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Let's make today count
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(d => new Date(d.getTime() - 86400000))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium text-foreground min-w-32 text-center">
            {format(selectedDate, 'EEEE, MMM d')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(d => new Date(d.getTime() + 86400000))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Current Streak"
          value={stats.currentStreak}
          icon={Flame}
          trend={stats.currentStreak > 0 ? "Keep it up!" : undefined}
          variant="primary"
        />
        <StatsCard
          title="Today's Progress"
          value={`${completedHabitsToday}/${habits.length}`}
          icon={Target}
          delay={0.1}
        />
        <StatsCard
          title="Journal Entries"
          value={stats.totalJournalEntries}
          icon={BookOpen}
          delay={0.2}
        />
        <StatsCard
          title="Badges Earned"
          value={badges.filter(b => b.unlockedAt).length}
          icon={Trophy}
          variant="accent"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DailyHabits
            habits={habits}
            onToggleHabit={handleToggleHabit}
            selectedDate={selectedDate}
          />
          <DailyTodos
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            selectedDate={selectedDate}
          />
        </div>
        
        <div className="space-y-6">
          {/* Progress Ring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-6 flex flex-col items-center"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Today's Progress
            </h3>
            <ProgressRing progress={dailyProgress} label="completed" />
          </motion.div>
          
          <JournalWidget
            entries={journalEntries}
            onSaveEntry={handleSaveJournalEntry}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </motion.div>
  );

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'calendar':
        return (
          <MonthlyCalendar
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        );
      case 'goals':
        return (
          <GoalsView
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
            onToggleChecklistItem={handleToggleChecklistItem}
            onAddChecklistItem={handleAddChecklistItem}
          />
        );
      case 'journal':
        return (
          <JournalView
            entries={journalEntries}
            onSaveEntry={handleSaveJournalEntry}
          />
        );
      case 'achievements':
        return (
          <AchievementsView
            badges={badges}
            stats={stats}
          />
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
