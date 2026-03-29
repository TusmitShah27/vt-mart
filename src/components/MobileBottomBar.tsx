import { Home, ShoppingBag, MessageCircle, Phone } from "lucide-react";

export default function MobileBottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        <a href="#home" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-600 transition-colors">
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#products" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-600 transition-colors">
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Products</span>
        </a>
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-[#25D366] transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
        <a href="#contact" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-brand-600 transition-colors">
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Contact</span>
        </a>
      </div>
    </div>
  );
}
