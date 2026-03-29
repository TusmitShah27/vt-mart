import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-50">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-brand-200/50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-300/40 blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center pt-10 lg:pt-0"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold tracking-wider uppercase mb-6"
            >
              Vishal Traders
            </motion.span>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Premium <br className="hidden sm:block" />
              <span className="text-brand-600 italic">Dry Fruits</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the finest selection of almonds, cashews, pistachios, and more. Handpicked for quality, freshness, and taste.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-16 lg:pb-24">
              <a 
                href="#products" 
                className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                View Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#contact" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-700 border border-brand-200 rounded-full font-medium hover:bg-brand-50 transition-all flex items-center justify-center"
              >
                Contact Us
              </a>
            </div>
          </motion.div>

          {/* Visual 
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[40vh] lg:h-[70vh] w-full relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1599576403061-6893c5938833?w=1200&q=80" 
              alt="Premium Dry Fruits" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          */}
          
        </div>
      </div>
    </section>
  );
}
