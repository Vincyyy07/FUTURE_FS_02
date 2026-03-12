import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Phone, Globe, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotesSection } from '@/components/NotesSection';
import { useUpdateLeadStatus } from '@/hooks/useLeads';
import type { Lead } from '@/services/supabaseApi';

const statusBadge: Record<string, { cls: string; dot: string }> = {
  New:       { cls: 'badge-new',       dot: 'bg-status-new' },
  Contacted: { cls: 'badge-contacted', dot: 'bg-status-contacted' },
  Converted: { cls: 'badge-converted', dot: 'bg-status-converted' },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  const updateStatus = useUpdateLeadStatus();

  return (
    <AnimatePresence>
      {lead && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/30 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-card z-50 overflow-y-auto flex flex-col"
            style={{ boxShadow: '-20px 0 60px rgba(0,0,0,0.12)', borderLeft: '1px solid hsl(var(--border))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: `hsl(${(lead.name.charCodeAt(0) * 17) % 360} 60% 52%)` }}
                >
                  {getInitials(lead.name)}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground leading-tight">{lead.name}</h2>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors duration-150"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Lead Info */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Lead Information
                </h3>
                <div className="space-y-2">
                  <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
                  <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone || '—'} />
                  <InfoRow icon={<Globe className="h-4 w-4" />} label="Source" value={lead.source || '—'} />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={format(new Date(lead.created_at), 'MMM d, yyyy')}
                  />
                </div>
              </section>

              {/* Status */}
              <section className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pipeline Status</p>
                    <p className="text-xs text-muted-foreground">Track where this lead is in your pipeline</p>
                  </div>
                  <Select
                    value={lead.status}
                    onValueChange={(val) => updateStatus.mutate({ id: lead.id, status: val })}
                  >
                    <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0 shadow-none focus:ring-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge[lead.status]?.cls ?? ''}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge[lead.status]?.dot ?? 'bg-muted-foreground'}`} />
                        {lead.status}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pipeline steps */}
                <div className="flex items-center gap-1 mt-3">
                  {['New', 'Contacted', 'Converted'].map((step, i) => {
                    const steps = ['New', 'Contacted', 'Converted'];
                    const currentIdx = steps.indexOf(lead.status);
                    const active = i <= currentIdx;
                    return (
                      <div key={step} className="flex items-center gap-1 flex-1">
                        <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${active ? (step === 'New' ? 'bg-status-new' : step === 'Contacted' ? 'bg-status-contacted' : 'bg-status-converted') : 'bg-muted'}`} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {['New', 'Contacted', 'Converted'].map(step => (
                    <span key={step} className="text-[10px] text-muted-foreground">{step}</span>
                  ))}
                </div>
              </section>

              <div className="border-t border-border" />

              {/* Notes */}
              <NotesSection leadId={lead.id} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-sm text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}
