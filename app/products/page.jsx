"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { ShoppingCart, Eye, X } from 'lucide-react';


const products = [
 {
   id: 1,
   name: "Premium T-Shirt",
   price: 29.99,
   image: "/tshirt.jpg",
   width: 300,
   height: 300,
   description: "Comfortable cotton t-shirt perfect for everyday wear. Made with high-quality materials.",
   category: "t-shirt",
 },
 {
   id: 2,
   name: "Running Shoes",
   price: 89.99,
   image: "/shoes.jpg",
   width: 300,
   height: 300,
   description: "Lightweight running shoes with excellent cushioning and support for your daily runs.",
   category: "shoes",
 },
   {
   id: 3,
   name: "Casual Lowers",
   price: 39.99,
   image: "/lower.webp",
   width: 300,
   height: 300,
   description: "Comfortable casual pants perfect for relaxed days. Soft fabric with great fit.",
   category: "lowers",
 },
 {
   id: 4,
   name: "Classic Jeans",
   price: 59.99,
   image: "/jeans.jpg",
   width: 300,
   height: 300,
   description: "Classic denim jeans with perfect fit and durability. A wardrobe essential.",
   category: "jeans",
 },
 
];

// --- Helper Functions ---
function getUser() {
 const token = localStorage.getItem("token");
 if (token) {
   try { return jwtDecode(token); } catch {}
 }
 const userStr = localStorage.getItem("user");
 if (userStr) {
   try { return JSON.parse(userStr); } catch {}
 }
 return null;
}

const handleAddToCart = (product, setToastMessage) => {
 const user = getUser();
 const cartKey = user && (user.id || user.userId || user.email) ? `cart_${user.id || user.userId || user.email}` : "cart_guest";
 const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
 const existingItem = cart.find((item) => item.id === product.id);
 
 if (existingItem) {
   existingItem.quantity += 1;
 } else {
   cart.push({ ...product, quantity: 1 });
 }
 
 localStorage.setItem(cartKey, JSON.stringify(cart));
 window.dispatchEvent(new Event("storage")); 
 

 setToastMessage(`"${product.name}" added to cart!`);
};

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-gray-800 text-white py-3 px-5 rounded-lg shadow-lg animate-fade-in-up">
      {message}
    </div>
  );
}

function CustomDialog({ open, onClose, children }) {
 if (!open) return null;
 return (
   <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
     <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
       {children}
     </div>
   </div>
 );
}

function ProductCard({ product, onView, onAddToCart }) {
 return (
   <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
     <div className="p-4 flex flex-col h-full">
       <div className="relative overflow-hidden rounded-lg mb-4">
         <Image
           src={product.image || "/placeholder.svg"}
           alt={product.name}
           width={product.width || 300}
           height={product.height || 300}
           className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
         />
       </div>
       <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
       <p className="text-2xl font-bold text-blue-600 mb-4 mt-auto">${product.price}</p>
       
       <div className="flex space-x-2">
         <button
           onClick={onView}
           className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-transparent hover:bg-gray-100 h-10 px-4 py-2"
         >
           <Eye className="h-4 w-4 mr-2" />
           View
         </button>
         
         <button
           onClick={onAddToCart}
           className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-black h-10 px-4 py-2"
         >
           <ShoppingCart className="h-4 w-4 mr-2" />
           Add
         </button>
       </div>
     </div>
   </div>
 );
}

function ProductModal({ product, onClose, onAddToCart }) {
 const router = useRouter();
 const addToCartAndGo = () => {
   onAddToCart();
   router.push("/cart");
 };

 return (
   <CustomDialog open={true} onClose={onClose}>
     <div className="mb-4">
       <h2 className="text-2xl font-bold">{product.name}</h2>
     </div>
     <div className="grid md:grid-cols-2 gap-6">
       <div className="relative">
         <Image
           src={product.image || "/placeholder.svg"}
           alt={product.name}
           width={400}
           height={400}
           className="w-full h-80 object-cover rounded-lg"
         />
       </div>
       <div className="flex flex-col space-y-4">
         <p className="text-3xl font-bold text-blue-600">${product.price}</p>
         <p className="text-gray-600 leading-relaxed">{product.description}</p>
         <div className="space-y-2">
           <p className="text-sm text-gray-500">
             <span className="font-semibold">Category:</span> {product.category}
           </p>
           <p className="text-sm text-gray-500">
             <span className="font-semibold">Product ID:</span> #{product.id}
           </p>
         </div>
         <button
           onClick={addToCartAndGo}
           className="w-full mt-auto inline-flex items-center justify-center rounded-md text-lg font-semibold bg-blue-600 text-white hover:bg-black h-12 px-8"
         >
           <ShoppingCart className="h-5 w-5 mr-2" />
           Add and Go to Cart
         </button>
       </div>
     </div>
   </CustomDialog>
 );
}


export default function ProductGrid() {
 const [selectedProduct, setSelectedProduct] = useState(null);
 const [toastMessage, setToastMessage] = useState("");

 return (
   <section className="py-16 px-4">
     <div className="container mx-auto">
       <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {products.map((product) => (
           <ProductCard 
            key={product.id} 
            product={product} 
            onView={() => setSelectedProduct(product)} 
            onAddToCart={() => handleAddToCart(product, setToastMessage)}
            />
         ))}
       </div>
     </div>
     {selectedProduct && (
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => handleAddToCart(selectedProduct, setToastMessage)}
      />
      )}
     {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
   </section>
 );
}
