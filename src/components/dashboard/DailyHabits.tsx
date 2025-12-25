import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Habit } from '@/lib/types';
import { HabitCheck } from './HabitCheck';

interface DailyHabitsProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
  selectedDate: Date;
}

export const DailyHabits = ({ habits, onToggleHabit, selectedDate }: DailyHabitsProps) => {
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Daily Habits</h2>
        <span className="text-sm text-muted-foreground font-medium">
          {format(selectedDate, 'EEEE, MMM d')}
        </span>
      </div>

      <div className="space-y-3">
        {habits.map((habit, index) => {
          const isCompleted = habit.completedDays.includes(dateStr);
          
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <span className="text-2xl">{habit.icon}</span>
              <span className="flex-1 font-medium text-foreground">{habit.name}</span>
              <HabitCheck
                checked={isCompleted}
                onToggle={() => onToggleHabit(habit.id, dateStr)}
              />
            </motion.div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No habits yet. Add your first habit!</p>
        </div>
      )}
    </motion.div>
  );
};
