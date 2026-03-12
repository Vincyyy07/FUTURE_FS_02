import { supabase } from '@/lib/supabase';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
};

export async function fetchLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function fetchLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLeadStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function fetchNotesByLeadId(leadId: string) {
  const { data, error } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as LeadNote[];
}

export async function addNote(leadId: string, content: string) {
  const { data, error } = await supabase
    .from('lead_notes')
    .insert({ lead_id: leadId, content })
    .select()
    .single();
  if (error) throw error;
  return data as LeadNote;
}

export async function createLead(lead: { name: string; email: string; phone?: string; source?: string }) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function getLeadStats() {
  const { data, error } = await supabase.from('leads').select('status');
  if (error) throw error;
  const leads = data || [];
  return {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };
}
