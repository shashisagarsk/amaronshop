"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 


const getUser = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (token) {
    try { return jwtDecode(token); } catch {}
  }
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try { return JSON.parse(userStr); } catch {}
  }
  return null;
};


const getCartKey = (user) => {
  if (user && (user.id || user.userId)) return `cart_${user.id || user.userId}`;
  if (user && user.email) return `cart_${user.email}`;
  return "cart_guest";
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const router = useRouter(); 

 
  const loadCartAndUserStatus = () => {
    const user = getUser();
    setIsLoggedIn(!!user);
    const cartKey = getCartKey(user);
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    setCartItems(storedCart);
  };

  useEffect(() => {
    loadCartAndUserStatus();
    window.addEventListener('storage', loadCartAndUserStatus);
    return () => {
      window.removeEventListener('storage', loadCartAndUserStatus);
    };
  }, []);

  const saveCart = (updatedCart) => {
    const user = getUser();
    const cartKey = getCartKey(user);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      saveCart(updatedCart);
    }
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const handleCheckout = () => {

    alert("Proceeding to checkout!");
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>Your cart is empty.</p>
          <Link 
  href="/" 
  className="inline-block mt-4 px-6 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors"
>
  Continue Shopping
</Link>
        </div>
      ) : (
        <div>
          
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="border-b pb-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="font-medium sm:hidden mt-2">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-md"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-bold w-20 text-center hidden sm:block">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

         
          <div className="mt-8 flex flex-col items-end">
            <div className="text-2xl font-bold mb-4">
              <span>Total: </span>
              <span>${totalPrice}</span>
            </div>
            {isLoggedIn ? (
              <button 
                onClick={handleCheckout}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors"
              >
                Proceed to Checkout
              </button>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Login to Buy
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
