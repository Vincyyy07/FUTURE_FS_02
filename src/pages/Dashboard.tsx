import { useState } from 'react';
import { StatsCards } from '@/components/StatsCards';
import { LeadsTable } from '@/components/LeadsTable';
import { LeadDetailPanel } from '@/components/LeadDetailPanel';
import { AddLeadDialog } from '@/components/AddLeadDialog';
import { useLeads } from '@/hooks/useLeads';
import type { Lead } from '@/services/supabaseApi';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { data: leads } = useLeads();

  // Update selected lead when the underlying data changes (real-time)
  const currentLead = selectedLead
    ? (leads?.find(l => l.id === selectedLead.id) ?? selectedLead)
    : null;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <Activity className="h-3 w-3" />
              Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Overview of your lead pipeline</p>
        </div>
        <AddLeadDialog />
      </div>

      <div className="space-y-5">
        <StatsCards />
        <LeadsTable onSelectLead={setSelectedLead} />
      </div>

      <LeadDetailPanel lead={currentLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
