import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, ChevronDown, ChevronUp, Calendar, Award } from 'lucide-react';
import { Goal, ChecklistItem } from '@/lib/types';
import { HabitCheck } from '@/components/dashboard/HabitCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (goalId: string) => void;
  onToggleChecklistItem: (goalId: string, itemId: string) => void;
  onAddChecklistItem: (goalId: string, text: string) => void;
}

const goalTypes: { value: Goal['type']; label: string; icon: typeof Calendar }[] = [
  { value: 'monthly', label: 'Monthly', icon: Calendar },
  { value: 'seasonal', label: 'Seasonal', icon: Award },
  { value: 'yearly', label: 'Yearly', icon: Target },
];

export const GoalsView = ({ 
  goals, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal,
  onToggleChecklistItem,
  onAddChecklistItem 
}: GoalsViewProps) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', type: 'monthly' as Goal['type'] });
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<Goal['type'] | 'all'>('all');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title.trim()) {
      onAddGoal({
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        type: newGoal.type,
        checklist: [],
      });
      setNewGoal({ title: '', description: '', type: 'monthly' });
      setShowAddGoal(false);
    }
  };

  const toggleExpanded = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleAddItem = (goalId: string) => {
    const text = newItemText[goalId]?.trim();
    if (text) {
      onAddChecklistItem(goalId, text);
      setNewItemText(prev => ({ ...prev, [goalId]: '' }));
    }
  };

  const filteredGoals = activeFilter === 'all' 
    ? goals 
    : goals.filter(g => g.type === activeFilter);

  const getGoalProgress = (goal: Goal) => {
    if (goal.checklist.length === 0) return 0;
    const completed = goal.checklist.filter(item => item.completed).length;
    return Math.round((completed / goal.checklist.length) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Goals</h1>
        <Button onClick={() => setShowAddGoal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: 'all', label: 'All' }, ...goalTypes].map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveFilter(filter.value as Goal['type'] | 'all')}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-elevated p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Create New Goal</h3>
              <button onClick={() => setShowAddGoal(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleAddGoal} className="space-y-4">
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Goal title..."
                autoFocus
              />
              
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description (optional)..."
                className="resize-none h-20"
              />
              
              <div className="flex gap-2">
                {goalTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={newGoal.type === type.value ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setNewGoal(prev => ({ ...prev, type: type.value }))}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
              
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => {
          const isExpanded = expandedGoals.includes(goal.id);
          const progress = getGoalProgress(goal);
          
          return (
            <motion.div
              key={goal.id}
              layout
              className="card-elevated overflow-hidden"
            >
              {/* Goal Header */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleExpanded(goal.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        goal.type === 'monthly' && "bg-primary/10 text-primary",
                        goal.type === 'seasonal' && "bg-accent/10 text-accent",
                        goal.type === 'yearly' && "bg-success/10 text-success"
                      )}>
                        {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-foreground">{progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {goal.checklist.filter(i => i.completed).length}/{goal.checklist.length} tasks
                      </p>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-border pt-4">
                      {/* Checklist */}
                      <div className="space-y-2 mb-4">
                        {goal.checklist.map((item) => (
                          <motion.div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                          >
                            <HabitCheck
                              checked={item.completed}
                              onToggle={() => onToggleChecklistItem(goal.id, item.id)}
                              size="sm"
                            />
                            <span className={cn(
                              "flex-1 text-sm",
                              item.completed && "line-through text-muted-foreground"
                            )}>
                              {item.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Add Item */}
                      <div className="flex gap-2">
                        <Input
                          value={newItemText[goal.id] || ''}
                          onChange={(e) => setNewItemText(prev => ({ ...prev, [goal.id]: e.target.value }))}
                          placeholder="Add a task..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddItem(goal.id)}
                        />
                        <Button size="icon" onClick={() => handleAddItem(goal.id)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Delete Goal */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteGoal(goal.id);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Delete Goal
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="card-elevated p-12 text-center">
          <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-4">No goals yet</p>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </motion.div>
  );
};
