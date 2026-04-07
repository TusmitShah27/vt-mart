import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  product_interest: string;
  message: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setLeads(data);
    if (error) console.error('Error fetching leads:', error);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-[Calistoga] text-[#0F172A]">Leads & Inquiries</h1>
        <p className="text-slate-500 mt-2">View and manage customer inquiries from the landing page</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No leads found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F1F5F9] border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Customer Details</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Contact Info</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Interest & Message</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium text-right">Date Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-6 py-5">
                      <p className="font-medium text-[#0F172A] text-base">{lead.name}</p>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {lead.city}
                      </div>
                    </td>
                    <td className="px-6 py-5 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${lead.phone}`} className="hover:text-[#0052FF]">{lead.phone}</a>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <a href={`mailto:${lead.email}`} className="hover:text-[#0052FF]">{lead.email}</a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {lead.product_interest && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 mb-2 border border-blue-100">
                          Interest: {lead.product_interest}
                        </span>
                      )}
                      <p className="text-sm text-slate-600 line-clamp-3 max-w-md">
                        {lead.message || <span className="text-slate-400 italic">No message provided</span>}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
