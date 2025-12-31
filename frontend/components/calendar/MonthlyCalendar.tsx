import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Habit } from '@/lib/types';
import { HabitCheck } from '@/components/dashboard/HabitCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MonthlyCalendarProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDays'>) => void;
  onDeleteHabit: (habitId: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HABIT_ICONS = ['🏃', '📚', '💪', '🧘', '💧', '🎨', '✍️', '🎸', '🍎', '🌙', '🚶', '🧠'];

export const MonthlyCalendar = ({ 
  habits, 
  onToggleHabit, 
  onAddHabit,
  onDeleteHabit 
}: MonthlyCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏃');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = getDay(monthStart);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit({
        name: newHabitName.trim(),
        icon: selectedIcon,
        color: 'primary',
      });
      setNewHabitName('');
      setShowAddHabit(false);
    }
  };

  const getHabitCompletionRate = (habit: Habit) => {
    const monthDays = days.map(d => format(d, 'yyyy-MM-dd'));
    const completed = habit.completedDays.filter(d => monthDays.includes(d)).length;
    return Math.round((completed / days.length) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Monthly Habits</h1>
        <Button onClick={() => setShowAddHabit(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Habit
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-display text-2xl font-semibold text-foreground min-w-48 text-center">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Add New Habit</h3>
            <button onClick={() => setShowAddHabit(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <form onSubmit={handleAddHabit} className="space-y-4">
            <Input
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Habit name..."
              autoFocus
            />
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Choose an icon</label>
              <div className="flex flex-wrap gap-2">
                {HABIT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={cn(
                      "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                      selectedIcon === icon 
                        ? "bg-primary/20 ring-2 ring-primary" 
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <Button type="submit" className="w-full">Add Habit</Button>
          </form>
        </motion.div>
      )}

      {/* Habits Grid */}
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{habit.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {getHabitCompletionRate(habit)}% complete this month
                </p>
              </div>
            </div>
            <button
              onClick={() => onDeleteHabit(habit.id)}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells for padding */}
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days */}
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCompleted = habit.completedDays.includes(dateStr);
              const isCurrentDay = isToday(day);
              
              return (
                <motion.div
                  key={dateStr}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all",
                    isCurrentDay && "ring-2 ring-primary",
                    "hover:bg-secondary/50"
                  )}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onToggleHabit(habit.id, dateStr)}
                >
                  <span className={cn(
                    "text-xs font-medium",
                    isCurrentDay ? "text-primary" : "text-muted-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className={cn(
                    "w-4 h-4 rounded-full transition-all",
                    isCompleted ? "bg-primary" : "bg-secondary"
                  )} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {habits.length === 0 && (
        <div className="card-elevated p-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">No habits yet for this month</p>
          <Button onClick={() => setShowAddHabit(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Habit
          </Button>
        </div>
      )}
    </motion.div>
  );
};
