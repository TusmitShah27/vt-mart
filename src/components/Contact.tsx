// New Code

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact({ initialProduct = "" }: { initialProduct?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    product_interest: initialProduct,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, product_interest: initialProduct }));
      // Scroll to contact section when a product is selected
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const edgeFunctionUrl = import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL || "/api/leads";
      
      const res = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", city: "", product_interest: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Get in Touch with <span className="text-brand-400">Vishal Trading</span>
            </h2>
            <p className="text-brand-100 mb-10 text-lg max-w-md">
              Have a question about our products or want to place a bulk order? Fill out the form or contact us directly.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-brand-300" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Visit Our Store</h4>
                  <p className="text-brand-200 leading-relaxed">
                    123 Dry Fruit Market, Main Road,<br />
                    City Center, State - 123456
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-brand-300" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Call Us</h4>
                  <p className="text-brand-200">+91 98765 43210</p>
                  <p className="text-brand-200">+91 98765 43211</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-brand-300" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Email Us</h4>
                  <p className="text-brand-200">info@vishaltraders.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lead Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-gray-900"
          >
            <h3 className="text-2xl font-serif font-bold mb-6 text-center">Send an Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Mumbai"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="product_interest" className="block text-sm font-medium text-gray-700 mb-1">Interested In</label>
                <input
                  type="text"
                  id="product_interest"
                  name="product_interest"
                  value={formData.product_interest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="e.g. Almonds, Cashews"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Inquiry <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200"
                >
                  Thank you! Your inquiry has been sent successfully. We will contact you soon.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium border border-red-200"
                >
                  Oops! Something went wrong. Please try again later.
                </motion.div>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}



// import { useState, useEffect } from "react";
// import { motion } from "motion/react";
// import { MapPin, Phone, Mail, Send } from "lucide-react";

// export default function Contact({ initialProduct = "" }: { initialProduct?: string }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     city: "",
//     product_interest: initialProduct,
//     message: "",
//   });
//   const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

//   useEffect(() => {
//     if (initialProduct) {
//       setFormData(prev => ({ ...prev, product_interest: initialProduct }));
//       // Scroll to contact section when a product is selected
//       document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [initialProduct]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus("submitting");

//     try {
//       const edgeFunctionUrl = import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL || "/api/leads";
      
//       const res = await fetch(edgeFunctionUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setStatus("success");
//         setFormData({ name: "", phone: "", city: "", product_interest: "", message: "" });
//         setTimeout(() => setStatus("idle"), 5000);
//       } else {
//         setStatus("error");
//         setTimeout(() => setStatus("idle"), 3000);
//       }
//     } catch (error) {
//       setStatus("error");
//       setTimeout(() => setStatus("idle"), 3000);
//     }
//   };

//   return (
//     <section id="contact" className="py-24 bg-brand-900 text-white relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10 pointer-events-none">
//         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
//               <circle cx="2" cy="2" r="2" fill="currentColor" />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#dots)" />
//         </svg>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
//           {/* Contact Info */}
//           <motion.div 
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
//               Get in Touch with <span className="text-brand-400">Vishal Traders</span>
//             </h2>
//             <p className="text-brand-100 mb-10 text-lg max-w-md">
//               Have a question about our products or want to place a bulk order? Fill out the form or contact us directly.
//             </p>

//             <div className="space-y-8">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center flex-shrink-0">
//                   <MapPin className="w-6 h-6 text-brand-300" />
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold mb-1">Visit Our Store</h4>
//                   <p className="text-brand-200 leading-relaxed">
//                     123 Dry Fruit Market, Main Road,<br />
//                     City Center, State - 123456
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center flex-shrink-0">
//                   <Phone className="w-6 h-6 text-brand-300" />
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold mb-1">Call Us</h4>
//                   <p className="text-brand-200">+91 98765 43210</p>
//                   <p className="text-brand-200">+91 98765 43211</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center flex-shrink-0">
//                   <Mail className="w-6 h-6 text-brand-300" />
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold mb-1">Email Us</h4>
//                   <p className="text-brand-200">info@vishaltraders.com</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Lead Form */}
//           <motion.div 
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-gray-900"
//           >
//             <h3 className="text-2xl font-serif font-bold mb-6 text-center">Send an Inquiry</h3>
            
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
//                     placeholder="John Doe"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     required
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
//                     placeholder="+91 98765 43210"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                   <input
//                     type="text"
//                     id="city"
//                     name="city"
//                     required
//                     value={formData.city}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
//                     placeholder="Mumbai"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="product_interest" className="block text-sm font-medium text-gray-700 mb-1">Interested In</label>
//                   <input
//                     type="text"
//                     id="product_interest"
//                     name="product_interest"
//                     value={formData.product_interest}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white"
//                     placeholder="e.g. Almonds, Cashews"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   rows={4}
//                   value={formData.message}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
//                   placeholder="Tell us about your requirements..."
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 disabled={status === "submitting"}
//                 className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {status === "submitting" ? (
//                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <>
//                     Send Inquiry <Send className="w-5 h-5" />
//                   </>
//                 )}
//               </button>

//               {status === "success" && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                   className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-200"
//                 >
//                   Thank you! Your inquiry has been sent successfully. We will contact you soon.
//                 </motion.div>
//               )}
//               {status === "error" && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                   className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium border border-red-200"
//                 >
//                   Oops! Something went wrong. Please try again later.
//                 </motion.div>
//               )}
//             </form>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   );
// }
