import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Tags, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, leads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prodRes, catRes, leadsRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          products: prodRes.count || 0,
          categories: catRes.count || 0,
          leads: leadsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Categories', value: stats.categories, icon: Tags, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Leads', value: stats.leads, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-[Calistoga] text-[#0F172A]">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-500 text-sm font-medium font-mono">{stat.label}</h3>
                  <p className="text-3xl font-bold text-[#0F172A] mt-2">
                    {loading ? '-' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
