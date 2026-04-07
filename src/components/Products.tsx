import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "react-intersection-observer";
import { MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Product {
  id: number;
  product_name: string;
  category: string;
  subcategory: string;
  price: number;
  image_url: string;
  description: string;
  is_featured: boolean;
}

export default function Products({ onInquire }: { onInquire: (productName: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch categories and products from Supabase
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*').eq('is_active', true)
        ]);

        if (prodRes.error) throw prodRes.error;

        const categoriesMap = new Map(catRes.data?.map(c => [c.id, c.name]) || []);

        const formattedProducts = (prodRes.data || []).map(p => ({
          id: p.id,
          product_name: p.name || p.product_name,
          category: categoriesMap.get(p.category_id) || p.category || 'Uncategorized',
          subcategory: p.subcategory || '',
          price: p.price,
          image_url: p.image_url,
          description: p.description || '',
          is_featured: p.is_active || p.is_featured
        }));

        setProducts(formattedProducts);
        const uniqueCategories = ["All", ...new Set(formattedProducts.map(p => p.category))];
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        console.error("Failed to fetch products from Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-brand-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4"
          >
            Our Premium <span className="text-brand-600">Selection</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Explore our wide range of high-quality dry fruits, carefully sourced and packed to retain their natural goodness.
          </motion.p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-brand-600 text-white shadow-md transform scale-105" 
                  : "bg-white text-gray-600 hover:bg-brand-100 hover:text-brand-700 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <motion.div 
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={product.image_url} 
                      alt={product.product_name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-700 shadow-sm">
                      ₹{product.price}/kg
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="text-xs text-brand-500 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">{product.product_name}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">{product.description}</p>
                    
                    <button 
                      onClick={() => onInquire(product.product_name)}
                      className="w-full py-2.5 bg-brand-50 text-brand-700 font-medium rounded-xl hover:bg-brand-600 hover:text-white transition-colors flex items-center justify-center gap-2 mt-auto"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
}
