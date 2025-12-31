import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles } from 'lucide-react';
import { Badge, UserStats } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AchievementsViewProps {
  badges: Badge[];
  stats: UserStats;
}

export const AchievementsView = ({ badges, stats }: AchievementsViewProps) => {
  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const lockedBadges = badges.filter(b => !b.unlockedAt);

  const getProgress = (badge: Badge) => {
    switch (badge.requirement.type) {
      case 'streak':
        return Math.min(100, (stats.currentStreak / badge.requirement.count) * 100);
      case 'total':
        return Math.min(100, (stats.totalHabitsCompleted / badge.requirement.count) * 100);
      case 'goals':
        return Math.min(100, (stats.totalGoalsCompleted / badge.requirement.count) * 100);
      case 'journal':
        return Math.min(100, (stats.totalJournalEntries / badge.requirement.count) * 100);
      default:
        return 0;
    }
  };

  const getProgressText = (badge: Badge) => {
    let current = 0;
    switch (badge.requirement.type) {
      case 'streak':
        current = stats.currentStreak;
        break;
      case 'total':
        current = stats.totalHabitsCompleted;
        break;
      case 'goals':
        current = stats.totalGoalsCompleted;
        break;
      case 'journal':
        current = stats.totalJournalEntries;
        break;
    }
    return `${current}/${badge.requirement.count}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and unlock badges</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6 text-center"
        >
          <p className="text-4xl font-display font-bold text-primary mb-1">{stats.currentStreak}</p>
          <p className="text-sm text-muted-foreground">Current Streak</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-6 text-center"
        >
          <p className="text-4xl font-display font-bold text-accent mb-1">{stats.longestStreak}</p>
          <p className="text-sm text-muted-foreground">Longest Streak</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6 text-center"
        >
          <p className="text-4xl font-display font-bold text-success mb-1">{stats.totalHabitsCompleted}</p>
          <p className="text-sm text-muted-foreground">Habits Completed</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated p-6 text-center"
        >
          <p className="text-4xl font-display font-bold text-foreground mb-1">{stats.totalJournalEntries}</p>
          <p className="text-sm text-muted-foreground">Journal Entries</p>
        </motion.div>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-semibold text-foreground">
              Unlocked ({unlockedBadges.length})
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {unlockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card-elevated p-6 text-center bg-gradient-to-b from-primary/5 to-transparent border-primary/20"
              >
                <motion.span 
                  className="text-5xl block mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {badge.icon}
                </motion.span>
                <h3 className="font-display font-semibold text-foreground mb-1">{badge.name}</h3>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Locked Badges */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-display text-xl font-semibold text-foreground">
            Locked ({lockedBadges.length})
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {lockedBadges.map((badge, index) => {
            const progress = getProgress(badge);
            const progressText = getProgressText(badge);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card-elevated p-6 text-center relative overflow-hidden"
              >
                <div className="relative z-10">
                  <span className="text-5xl block mb-3 grayscale opacity-50">{badge.icon}</span>
                  <h3 className="font-display font-semibold text-foreground mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{progressText}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {badges.length === 0 && (
        <div className="card-elevated p-12 text-center">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No badges available yet</p>
        </div>
      )}
    </motion.div>
  );
};
