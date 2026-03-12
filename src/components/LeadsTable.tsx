import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads';
import type { Lead } from '@/services/supabaseApi';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = ['All', 'New', 'Contacted', 'Converted'];

const statusBadge: Record<string, { cls: string; dot: string }> = {
  New:       { cls: 'badge-new',       dot: 'bg-status-new' },
  Contacted: { cls: 'badge-contacted', dot: 'bg-status-contacted' },
  Converted: { cls: 'badge-converted', dot: 'bg-status-converted' },
};

interface LeadsTableProps {
  onSelectLead: (lead: Lead) => void;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function LeadsTable({ onSelectLead }: LeadsTableProps) {
  const { data: leads, isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [flashedId, setFlashedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!leads) return [];
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateStatus.mutate({ id: leadId, status: newStatus }, {
      onSuccess: () => {
        setFlashedId(leadId);
        setTimeout(() => setFlashedId(null), 600);
      },
    });
  };

  return (
    <div className="bg-card rounded-xl card-shadow overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-lg bg-background border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold hidden md:table-cell">Phone</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold hidden lg:table-cell">Source</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold hidden sm:table-cell">Created</th>
              <th className="py-3 px-4 w-10" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[1,2,3,4].map(j => (
                    <td key={j} className="py-3.5 px-4">
                      <div className="h-4 bg-muted rounded animate-pulse" style={{ width: `${60 + j * 10}%` }} />
                    </td>
                  ))}
                  <td className="py-3.5 px-4 hidden md:table-cell"><div className="h-4 bg-muted rounded animate-pulse w-3/4" /></td>
                  <td className="py-3.5 px-4 hidden lg:table-cell"><div className="h-4 bg-muted rounded animate-pulse w-1/2" /></td>
                  <td />
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">No leads found</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {filtered.map((lead, idx) => {
                  const badge = statusBadge[lead.status] ?? { cls: '', dot: 'bg-muted-foreground' };
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      onClick={() => onSelectLead(lead)}
                      className={`border-b border-border cursor-pointer transition-colors duration-150 hover:bg-muted/50 group ${flashedId === lead.id ? 'animate-status-flash' : ''}`}
                    >
                      {/* Name + Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 text-white"
                            style={{ background: `hsl(${(lead.name.charCodeAt(0) * 17) % 360} 60% 52%)` }}
                          >
                            {getInitials(lead.name)}
                          </div>
                          <span className="text-sm font-medium text-foreground">{lead.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{lead.email}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{lead.phone || '—'}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">{lead.source || '—'}</td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <Select value={lead.status} onValueChange={(val) => handleStatusChange(lead.id, val)}>
                          <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0 shadow-none focus:ring-0">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                              {lead.status}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground tabular-nums hidden sm:table-cell">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-150" />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!isLoading && filtered.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''}{statusFilter !== 'All' ? ` · ${statusFilter}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
