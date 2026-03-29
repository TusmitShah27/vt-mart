/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import WhyChooseUs from "./components/WhyChooseUs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import MobileBottomBar from "./components/MobileBottomBar";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleInquire = (productName: string) => {
    setSelectedProduct(productName);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-200 selection:text-brand-900 pb-16 md:pb-0">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Products onInquire={handleInquire} />
        <WhyChooseUs />
        <Contact initialProduct={selectedProduct} />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
}

