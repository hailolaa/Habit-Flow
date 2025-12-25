import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JournalViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

const moods = [
  { value: 'great', emoji: '😄', label: 'Great', color: 'bg-success/20 text-success' },
  { value: 'good', emoji: '🙂', label: 'Good', color: 'bg-primary/20 text-primary' },
  { value: 'okay', emoji: '😐', label: 'Okay', color: 'bg-warning/20 text-warning' },
  { value: 'bad', emoji: '😔', label: 'Bad', color: 'bg-accent/20 text-accent' },
  { value: 'terrible', emoji: '😢', label: 'Terrible', color: 'bg-destructive/20 text-destructive' },
] as const;

export const JournalView = ({ entries, onSaveEntry }: JournalViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const existingEntry = entries.find(e => e.date === dateStr);

  const [content, setContent] = useState(existingEntry?.content || '');
  const [remarks, setRemarks] = useState(existingEntry?.remarks || '');
  const [mood, setMood] = useState<JournalEntry['mood']>(existingEntry?.mood || 'okay');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const entry = entries.find(e => e.date === format(date, 'yyyy-MM-dd'));
    setContent(entry?.content || '');
    setRemarks(entry?.remarks || '');
    setMood(entry?.mood || 'okay');
  };

  const handleSave = () => {
    if (content.trim() || remarks.trim()) {
      onSaveEntry({ date: dateStr, content, remarks, mood });
    }
  };

  // Get last 7 days for quick navigation
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Journal</h1>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDateChange(subDays(selectedDate, 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-display text-xl font-semibold text-foreground min-w-64 text-center">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDateChange(new Date(selectedDate.getTime() + 86400000))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Date Selection */}
      <div className="flex justify-center gap-2 mb-6">
        {last7Days.map((day) => {
          const hasEntry = entries.some(e => e.date === format(day, 'yyyy-MM-dd'));
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => handleDateChange(day)}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl transition-all min-w-14",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs font-medium">{format(day, 'EEE')}</span>
              <span className="text-lg font-bold">{format(day, 'd')}</span>
              {hasEntry && !isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Journal Entry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              How are you feeling today?
            </h3>
            <div className="flex gap-3 flex-wrap">
              {moods.map((m) => (
                <motion.button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl transition-all",
                    mood === m.value 
                      ? `${m.color} ring-2 ring-offset-2 ring-current` 
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="font-medium">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Daily Remarks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Daily Remarks
            </h3>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Quick notes about your day... What happened? What did you accomplish?"
              className="resize-none h-24"
            />
          </motion.div>

          {/* Journal Entry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Journal Entry
            </h3>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, reflections, gratitude, or anything on your mind..."
              className="resize-none h-48"
            />
          </motion.div>

          <Button onClick={handleSave} className="w-full" size="lg">
            Save Entry
          </Button>
        </div>

        {/* Recent Entries Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Recent Entries
          </h3>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {entries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((entry) => {
                const entryMood = moods.find(m => m.value === entry.mood);
                return (
                  <motion.div
                    key={entry.id}
                    className="p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleDateChange(new Date(entry.date))}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {format(new Date(entry.date), 'MMM d')}
                      </span>
                      <span className="text-lg">{entryMood?.emoji}</span>
                    </div>
                    {entry.remarks && (
                      <p className="text-sm text-foreground line-clamp-2">{entry.remarks}</p>
                    )}
                  </motion.div>
                );
              })}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No entries yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
