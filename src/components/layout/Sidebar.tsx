import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Trophy, 
  BookOpen,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'calendar', icon: Calendar, label: 'Monthly Habits' },
  { id: 'goals', icon: Target, label: 'Goals' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'achievements', icon: Trophy, label: 'Achievements' },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border shadow-md"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <motion.div 
            className="flex items-center gap-3"
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">HabitFlow</span>
          </motion.div>
          
          <button
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-sidebar-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  className="font-medium"
                  animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <motion.div
            className="p-4 rounded-xl bg-sidebar-accent"
            animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : 'auto' }}
          >
            <p className="text-sm text-sidebar-foreground font-medium">Build better habits</p>
            <p className="text-xs text-muted-foreground mt-1">One day at a time 🌱</p>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};
