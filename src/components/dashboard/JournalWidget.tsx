import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { JournalEntry } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface JournalWidgetProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  selectedDate: Date;
}

const moods = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'bad', emoji: '😔', label: 'Bad' },
  { value: 'terrible', emoji: '😢', label: 'Terrible' },
] as const;

export const JournalWidget = ({ entries, onSaveEntry, selectedDate }: JournalWidgetProps) => {
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const existingEntry = entries.find(e => e.date === dateStr);

  const [content, setContent] = useState(existingEntry?.content || '');
  const [remarks, setRemarks] = useState(existingEntry?.remarks || '');
  const [mood, setMood] = useState<JournalEntry['mood']>(existingEntry?.mood || 'okay');

  useEffect(() => {
    const existing = entries.find(e => e.date === dateStr);
    setContent(existing?.content || '');
    setRemarks(existing?.remarks || '');
    setMood(existing?.mood || 'okay');
  }, [dateStr, entries]);

  const handleSave = () => {
    if (content.trim() || remarks.trim()) {
      onSaveEntry({
        date: dateStr,
        content,
        remarks,
        mood,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Today's Journal</h2>
        <span className="text-sm text-muted-foreground">{format(selectedDate, 'MMM d')}</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
        <div className="flex gap-2">
          {moods.map((m) => (
            <motion.button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xl transition-all",
                mood === m.value 
                  ? "bg-primary/20 ring-2 ring-primary" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {m.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Daily Remarks</label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            onBlur={handleSave}
            placeholder="Quick notes about your day..."
            className="resize-none h-16"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Journal Entry</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            placeholder="Write your thoughts..."
            className="resize-none h-24"
          />
        </div>
      </div>
    </motion.div>
  );
};
