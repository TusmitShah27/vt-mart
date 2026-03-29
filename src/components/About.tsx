import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { ShieldCheck, Leaf, HeartHandshake } from "lucide-react";

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-brand-600" />,
      title: "100% Natural",
      description: "Sourced directly from the best farms, ensuring purity and freshness.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      title: "Premium Quality",
      description: "Handpicked and sorted to guarantee the highest grade of dry fruits.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-brand-600" />,
      title: "Trusted by Many",
      description: "Serving thousands of happy customers with dedication and care.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/images/hero-image.png" 
              alt="Assorted Dry Fruits" 
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">Vishal Traders</h3>
              <p className="text-sm opacity-90">Your trusted source for premium dry fruits since 2010.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-6">
              Nourishing Lives with <span className="text-brand-600">Nature's Best</span>
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              At Vishal Traders, we believe that good health starts with great food. 
              We are passionate about bringing you the finest selection of premium dry fruits, 
              nuts, and seeds from around the world. Our commitment to quality ensures that 
              every bite is packed with nutrition and authentic flavor.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
