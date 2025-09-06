"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { jwtDecode } from "jwt-decode"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.message || 'Login failed' })
        return
      }
      
      localStorage.setItem('token', data.token)
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      let user = data.user
      if (!user) {
        try { user = jwtDecode(data.token) } catch {}
      }
      if (user && (user.id || user.email)) {
        const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '[]')
        if (guestCart.length > 0) {
          const userCartKey = `cart_${user.id || user.email}`
          const userCart = JSON.parse(localStorage.getItem(userCartKey) || '[]')
          
          guestCart.forEach(guestItem => {
            const existing = userCart.find(item => item.id === guestItem.id)
            if (existing) {
              existing.quantity += guestItem.quantity
            } else {
              userCart.push(guestItem)
            }
          })
          
          localStorage.setItem(userCartKey, JSON.stringify(userCart))
          localStorage.removeItem('cart_guest')
        }
      }
      
      window.dispatchEvent(new Event("storage"))
      router.push('/cart')
    } catch (err) {
      setErrors({ general: 'Something went wrong. Please try again.' })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-gray-600 mt-2">Welcome back! Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{errors.general}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800
             hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        
        {/* --- CHANGE STARTS HERE --- */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
          {/* <p className="text-sm text-gray-600">
            Or{" "}
          </p> */}
        </div>
        {/* --- CHANGE ENDS HERE --- */}
        {/* <div className="text-center">
            <Link href="/" className="font-medium text-blue-600 hover:underline">
              Go back to Home
            </Link>
        </div> */}
      </div>
    </div>
  )
}