import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    if (error) console.error('Error fetching categories:', error);
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setSubmitting(true);
    const { error } = await supabase.from('categories').insert([{ name: newCategoryName.trim() }]);
    
    if (!error) {
      setNewCategoryName('');
      setIsAdding(false);
      fetchCategories();
    } else {
      console.error('Error adding category:', error);
      alert('Failed to add category. It might already exist.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      fetchCategories();
    } else {
      alert('Failed to delete category. It might be in use by products.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-[Calistoga] text-[#0F172A]">Categories</h1>
          <p className="text-slate-500 mt-2">Manage product categories</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white px-5 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <h2 className="text-lg font-semibold mb-4">Create New Category</h2>
          <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-mono text-slate-500 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all"
                placeholder="e.g. Premium Nuts"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 px-6 bg-[#0F172A] text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Save Category'}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="h-11 px-6 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No categories found. Create one to get started.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Category Name</th>
                <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{cat.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
