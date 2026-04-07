import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category_id: string;
  is_active: boolean;
  categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ]);
    
    if (prodRes.data) setProducts(prodRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      let image_url = editingId 
        ? products.find(p => p.id === editingId)?.image_url || 'https://via.placeholder.com/400'
        : 'https://via.placeholder.com/400'; // Fallback
      
      if (imageFile) {
        image_url = await handleImageUpload(imageFile);
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category_id: formData.category_id,
        is_active: formData.is_active,
        image_url
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      // Reset form
      resetForm();
      fetchData();
      
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category_id: '', is_active: true });
    setImageFile(null);
    setEditingId(null);
    setIsAdding(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category_id: product.category_id,
      is_active: product.is_active,
    });
    setEditingId(product.id);
    setIsAdding(true);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-[Calistoga] text-[#0F172A]">Products</h1>
          <p className="text-slate-500 mt-2">Manage your inventory and catalog</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              setIsAdding(true);
            }
          }}
          className="bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white px-5 py-2.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 font-medium shadow-sm"
        >
          {isAdding && !editingId ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Product</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <h2 className="text-xl font-semibold mb-6">{editingId ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-slate-500 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-slate-500 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-slate-500 mb-1">Category *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono text-slate-500 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full h-11 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-mono text-slate-500 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0052FF] outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="w-4 h-4 text-[#0052FF] rounded border-slate-300 focus:ring-[#0052FF]"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active (Visible to public)</label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-8 bg-[#0F172A] text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="h-11 px-8 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No products found. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F1F5F9] border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Product</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Category</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Price</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">Status</th>
                  <th className="px-6 py-4 text-sm font-mono text-slate-500 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 m-3 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{product.name}</p>
                          <p className="text-sm text-slate-500 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.categories?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleActiveStatus(product.id, product.is_active)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {product.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {product.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-slate-400 hover:text-[#0052FF] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
