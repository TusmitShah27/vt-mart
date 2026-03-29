import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { CheckCircle2, Truck, Award, ThumbsUp } from "lucide-react";

export default function WhyChooseUs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const reasons = [
    {
      icon: <Award className="w-8 h-8 text-brand-600" />,
      title: "Premium Quality",
      description: "We source only the highest grade dry fruits, ensuring every bite is packed with nutrition and flavor.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-brand-600" />,
      title: "Fresh Products",
      description: "Our products are carefully packed to retain maximum freshness, crunch, and natural taste.",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-brand-600" />,
      title: "Affordable Prices",
      description: "We believe premium quality shouldn't break the bank. Enjoy competitive pricing on all our products.",
    },
    {
      icon: <Truck className="w-8 h-8 text-brand-600" />,
      title: "Trusted Local Shop",
      description: "A reliable name in the community, committed to delivering excellence and customer satisfaction.",
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4"
          >
            Why Choose <span className="text-brand-600">VT Mart</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            We are dedicated to providing you with the best dry fruits, combining quality, freshness, and value.
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-brand-50/50 rounded-2xl p-8 text-center hover:bg-brand-50 transition-colors border border-brand-100/50 shadow-sm hover:shadow-md"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">{reason.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
