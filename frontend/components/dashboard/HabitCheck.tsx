import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCheckProps {
  checked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const HabitCheck = ({ checked, onToggle, size = 'md' }: HabitCheckProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        "rounded-lg border-2 flex items-center justify-center transition-all duration-300",
        sizeClasses[size],
        checked 
          ? "bg-primary border-primary" 
          : "border-border hover:border-primary hover:bg-primary/10"
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className={cn(iconSizes[size], "text-primary-foreground")} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
