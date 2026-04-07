import { ShoppingBag, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-6">
              <ShoppingBag className="w-8 h-8 text-brand-600" />
              <span className="font-serif text-2xl font-bold text-brand-900">Vishal Trading</span>
            </a>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Premium dry fruits from Vishal Trading. Sourced with care, delivered with love. Your health is our priority.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-brand-600 transition-colors text-sm">Home</a></li>
              <li><a href="#about" className="hover:text-brand-600 transition-colors text-sm">About Us</a></li>
              <li><a href="#products" className="hover:text-brand-600 transition-colors text-sm">Products</a></li>
              <li><a href="#why-us" className="hover:text-brand-600 transition-colors text-sm">Why Choose Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6 uppercase tracking-wider text-sm">Categories</h4>
            <ul className="space-y-3">
              <li><a href="#products" className="hover:text-brand-600 transition-colors text-sm">Almonds</a></li>
              <li><a href="#products" className="hover:text-brand-600 transition-colors text-sm">Cashews</a></li>
              <li><a href="#products" className="hover:text-brand-600 transition-colors text-sm">Pistachios</a></li>
              <li><a href="#products" className="hover:text-brand-600 transition-colors text-sm">Premium Mix</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-brand-600 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors text-sm">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors text-sm">Returns & Refunds</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Vishal Trading. All rights reserved.</p>
          <p>Designed for Tusmit Shah</p>
        </div>
      </div>
    </footer>
  );
}
