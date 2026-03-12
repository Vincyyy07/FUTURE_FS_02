import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCreateLead } from '@/hooks/useLeads';
import { toast } from 'sonner';

const sourceOptions = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Outreach', 'Event', 'Other'];

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', source: '' });
  const createLead = useCreateLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    createLead.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        source: form.source || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Lead added successfully');
          setForm({ name: '', email: '', phone: '', source: '' });
          setOpen(false);
        },
        onError: () => toast.error('Failed to add lead. Check your Supabase tables are set up.'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id="add-lead-btn"
          className="h-9 rounded-lg gap-1.5 active:scale-[0.98] transition-transform duration-150 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl card-shadow max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-sm">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="add-name"
                placeholder="John Smith"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                className="h-10 rounded-lg"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-email" className="text-sm">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="add-email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                className="h-10 rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-phone" className="text-sm">Phone</Label>
                <Input
                  id="add-phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-source" className="text-sm">Source</Label>
                <Select value={form.source} onValueChange={(val) => setForm(p => ({ ...p, source: val }))}>
                  <SelectTrigger id="add-source" className="h-10 rounded-lg">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLead.isPending || !form.name.trim() || !form.email.trim()}
              className="flex-1 h-10 rounded-lg active:scale-[0.98] transition-transform duration-150"
            >
              {createLead.isPending ? 'Adding…' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
