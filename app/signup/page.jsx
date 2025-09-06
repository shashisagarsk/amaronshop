"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

// Success Modal Component
function SuccessModal({ open, onClose }) {
  const router = useRouter();
  if (!open) return null;

  const handleGoToLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm m-4 text-center">
        <h3 className="text-xl font-bold text-green-600 mb-4">Success!</h3>
        <p className="mb-6 text-gray-700">Thank you for signing up! Now login here to start shopping.</p>
        <button 
          onClick={handleGoToLogin}
          className="w-full px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) newErrors.email = "Email is required"
    else if (!emailRegex.test(formData.email)) newErrors.email = "Email must contain @ and ."
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    if (!formData.password) newErrors.password = "Password is required"
    else if (!passwordRegex.test(formData.password)) newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, and a special character"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setLoading(true)
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          setShowSuccessModal(true)
          setErrors({})
          setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
        } else {
          setErrors({ api: data.message || "Signup failed" })
        }
      } catch (err) {
        setErrors({ api: "An unexpected error occurred. Please try again." })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    if (errors.api) setErrors((prev) => ({...prev, api: ""}))
  }
  
  const inputClass = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";
  const errorInputClass = "block w-full px-3 py-2 border-red-500 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500";

  return (
    // वर्टिकल पैडिंग (py-12 से py-8) को कम किया गया है
    <div className=" bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {/* हेडर के नीचे का मार्जिन (mb-6 से mb-4) कम किया गया है */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="text-gray-600 mt-1">Create your account to start shopping</p>
        </div>

        {/* फॉर्म एलिमेंट्स के बीच की स्पेसिंग (space-y-4 से space-y-3) कम की गई है */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {errors.api && <p className="text-red-500 text-center text-sm">{errors.api}</p>}
          
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? errorInputClass : inputClass} />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? errorInputClass : inputClass} />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={errors.email ? errorInputClass : inputClass} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className={errors.password ? errorInputClass : inputClass} />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} className={errors.confirmPassword ? errorInputClass : inputClass} />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none disabled:bg-blue-300" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* नीचे का मार्जिन (mt-6 से mt-4) कम किया गया है */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      
      <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </div>
  )
}