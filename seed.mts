import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

const testLeads = [
  { name: 'Sarah Jenkins', email: 'sarah.j@acmecorp.com', phone: '+1 (555) 123-4567', source: 'Website', status: 'New' },
  { name: 'Michael Chen', email: 'mchen@startup.io', phone: '+1 (555) 987-6543', source: 'Referral', status: 'Contacted' },
  { name: 'Emma Rodriguez', email: 'emma@designstudio.net', phone: '', source: 'Social Media', status: 'Converted' },
  { name: 'David Kim', email: 'dkim@globaltech.com', phone: '+1 (555) 222-3333', source: 'Cold Outreach', status: 'Contacted' },
  { name: 'Lisa Taylor', email: 'ltaylor@marketingpro.com', phone: '', source: 'Event', status: 'New' },
  { name: 'James Wilson', email: 'james.wilson@consulting.org', phone: '+1 (555) 444-5555', source: 'Website', status: 'New' },
  { name: 'Anna Peterson', email: 'anna.p@retailco.com', phone: '+1 (555) 666-7777', source: 'Email Campaign', status: 'Converted' },
  { name: 'Robert Fox', email: 'rfox@financegroup.com', phone: '', source: 'Referral', status: 'Contacted' },
];

async function seedData() {
  console.log('Starting seed process...');
  
  // 1. Insert leads
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .insert(testLeads)
    .select();
    
  if (leadsError) {
    console.error('Error inserting leads:', leadsError);
    return;
  }
  
  console.log(`Successfully inserted ${leads.length} leads.`);
  
  // 2. Add some notes to the specific leads
  const notesToInsert = [];
  
  for (const lead of leads) {
    if (lead.status === 'Contacted') {
      notesToInsert.push({
        lead_id: lead.id,
        content: `Initial outreach email sent. Waiting for reply.`
      });
      if (Math.random() > 0.5) {
        notesToInsert.push({
          lead_id: lead.id,
          content: `Called but went straight to voicemail. Left a message.`
        });
      }
    } else if (lead.status === 'Converted') {
      notesToInsert.push({
        lead_id: lead.id,
        content: `Product demo completed. They loved the new features.`
      });
      notesToInsert.push({
        lead_id: lead.id,
        content: `Contract signed! Onboarding scheduled for next Tuesday.`
      });
    } else if (lead.status === 'New' && Math.random() > 0.5) {
      notesToInsert.push({
        lead_id: lead.id,
        content: `Lead came in via the weekend marketing campaign.`
      });
    }
  }
  
  if (notesToInsert.length > 0) {
    const { error: notesError } = await supabase
      .from('lead_notes')
      .insert(notesToInsert);
      
    if (notesError) {
      console.error('Error inserting notes:', notesError);
      return;
    }
    console.log(`Successfully inserted ${notesToInsert.length} notes.`);
  }
  
  console.log('Seeding complete! Refresh your dashboard.');
}

seedData();
