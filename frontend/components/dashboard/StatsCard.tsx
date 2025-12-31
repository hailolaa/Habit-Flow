import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  delay?: number;
  variant?: 'default' | 'primary' | 'accent';
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  delay = 0,
  variant = 'default'
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary': return 'from-primary/20 to-primary/5 border-primary/20';
      case 'accent': return 'from-accent/20 to-accent/5 border-accent/20';
      default: return 'from-card to-card/50 border-border/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden p-6 rounded-2xl border backdrop-blur-sm bg-gradient-to-br",
        getVariantStyles()
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center",
        variant === 'default' && "bg-secondary",
        variant === 'primary' && "bg-primary/10",
        variant === 'accent' && "bg-accent/10"
      )}>
        <Icon className={cn(
          "w-7 h-7",
          variant === 'default' && "text-foreground",
          variant === 'primary' && "text-primary",
          variant === 'accent' && "text-accent"
        )} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-display font-bold text-foreground">{value}</p>
        {trend && (
          <p className="text-xs text-success font-medium mt-1">{trend}</p>
        )}
      </div>
    </motion.div>
  );
};
