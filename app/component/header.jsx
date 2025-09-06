"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react'; 
import { jwtDecode } from 'jwt-decode';

// Helper functions (no changes here)
const getUserFromToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
  return null;
};

const getCartKey = (user) => {
  if (user && (user.id || user.userId)) return `cart_${user.id || user.userId}`;
  if (user && user.email) return `cart_${user.email}`;
  return "cart_guest";
};

export default function Header() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const router = useRouter();

  const updateHeaderState = () => {
    const userData = getUserFromToken();
    setUser(userData);
    const cartKey = getCartKey(userData);
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateHeaderState();
    window.addEventListener('storage', updateHeaderState);
    return () => {
      window.removeEventListener('storage', updateHeaderState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
  ];

  // A reusable component for user/cart section to avoid repetition
  const UserCartSection = ({ isMobile = false }) => (
    <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
      {user ? (
        <div className="flex items-center space-x-4">
          {/* Don't show "Welcome" text on mobile, only logout icon */}
          <span className={isMobile ? 'hidden' : 'text-gray-700 font-medium'}>
            Welcome, {user.firstName || 'User'}
          </span>
          <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-blue-600 font-semibold">
            <LogOut className="h-5 w-5" />
            <span className={isMobile ? 'hidden' : 'ml-1'}>Logout</span>
          </button>
        </div>
      ) : (
        <Link href="/login" className="text-gray-600 hover:text-black font-semibold">
          Login
        </Link>
      )}

      {!isMobile && <div className="border-l h-6"></div>}

      <Link href="/cart" className="relative p-2">
        <ShoppingCart className="h-6 w-6 text-gray-700" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Added relative positioning to the nav for centering */}
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Left Section: Brand Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            AmronShop
          </Link>
        </div>
        
        {/* Center Section: Main Nav Links (hidden on mobile) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className='flex items-center space-x-8'>
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 font-medium text-lg">
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>

        {/* Right Section: Desktop (hidden on mobile) */}
        <div className="hidden md:flex items-center">
            <UserCartSection />
        </div>

        {/* Right Section: Mobile (only on mobile) */}
        <div className="md:hidden flex items-center space-x-2">
            <UserCartSection isMobile={true} />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
      </nav>

      {/* Mobile Menu (now only contains main links) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
          <div className="flex flex-col items-center space-y-6 py-6">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-700 hover:text-blue-600 text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}