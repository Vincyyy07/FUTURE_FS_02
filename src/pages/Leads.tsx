import { useState } from 'react';
import { LeadsTable } from '@/components/LeadsTable';
import { LeadDetailPanel } from '@/components/LeadDetailPanel';
import { AddLeadDialog } from '@/components/AddLeadDialog';
import type { Lead } from '@/services/supabaseApi';

export default function Leads() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your lead pipeline</p>
        </div>
        <AddLeadDialog />
      </div>

      <LeadsTable onSelectLead={setSelectedLead} />
      <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
