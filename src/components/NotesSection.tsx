import { useState } from 'react';
import { format } from 'date-fns';
import { useLeadNotes, useAddNote } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotesSectionProps {
  leadId: string;
}

export function NotesSection({ leadId }: NotesSectionProps) {
  const { data: notes, isLoading } = useLeadNotes(leadId);
  const addNote = useAddNote();
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!content.trim()) return;
    addNote.mutate({ leadId, content: content.trim() }, {
      onSuccess: () => setContent(''),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Follow-up Notes
        </h3>
        {notes && notes.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 max-h-[220px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : notes && notes.length > 0 ? (
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-muted rounded-xl p-3"
              >
                <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
                  {format(new Date(note.created_at), 'MMM d, yyyy · h:mm a')}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-6 text-center">
            <StickyNote className="h-6 w-6 text-muted-foreground/30 mx-auto mb-1.5" />
            <p className="text-sm text-muted-foreground">No notes yet</p>
          </div>
        )}
      </div>

      <div className="relative">
        <Textarea
          placeholder="Add a note… (Ctrl+Enter to submit)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[80px] rounded-xl bg-background border-border text-sm resize-none pr-10"
        />
        <button
          onClick={handleAdd}
          disabled={!content.trim() || addNote.isPending}
          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-150"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
