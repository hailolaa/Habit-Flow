import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { TodoItem } from '@/lib/types';
import { HabitCheck } from './HabitCheck';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DailyTodosProps {
  todos: TodoItem[];
  onAddTodo: (text: string, date: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  selectedDate: Date;
}

export const DailyTodos = ({ 
  todos, 
  onAddTodo, 
  onToggleTodo, 
  onDeleteTodo,
  selectedDate 
}: DailyTodosProps) => {
  const [newTodo, setNewTodo] = useState('');
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const todaysTodos = todos.filter(todo => todo.date === dateStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim(), dateStr);
      setNewTodo('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-elevated p-6"
    >
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">Daily To-Do</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a task..."
          className="flex-1"
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {todaysTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 group"
            >
              <HabitCheck
                checked={todo.completed}
                onToggle={() => onToggleTodo(todo.id)}
                size="sm"
              />
              <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {todo.text}
              </span>
              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
              >
                <X className="w-4 h-4 text-destructive" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {todaysTodos.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-4">
          No tasks for today. Add one above!
        </p>
      )}
    </motion.div>
  );
};
