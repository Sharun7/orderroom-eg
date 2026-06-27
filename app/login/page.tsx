"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("demo@orderroom.io")
  const [password, setPassword] = useState("demo1234")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    // Simulate auth — in production, call signIn("credentials", {...})
    await new Promise((r) => setTimeout(r, 800))
    if (email === "demo@orderroom.io" && password === "demo1234") {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[480px] bg-[#0D1825] border-r border-[#1E3050] flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-base">OrderRoom</span>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl text-[#F7F5F0] leading-tight">
              Replace 20 vendor chats with one daily order.
            </h2>
            <p className="text-[#64748B] text-sm mt-3 leading-relaxed">
              Restaurants and hotels use OrderRoom to place all their supply orders in under 60 seconds every morning.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "60s", label: "Avg. ordering time" },
              { value: "98%", label: "Vendor confirmation rate" },
              { value: "0", label: "Vendor signups required" },
              { value: "100%", label: "Email-based workflow" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#162236] border border-[#1E3050] rounded-lg p-4">
                <div className="text-[#F59E0B] text-2xl font-bold">{stat.value}</div>
                <div className="text-[#64748B] text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-lg p-5">
            <p className="text-[#94A3B8] text-sm leading-relaxed italic">
              &ldquo;We went from 45 minutes of WhatsApp chaos every morning to 2 clicks. Our vendors love the email confirmations.&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-4">
              <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0F1B2D] text-xs font-bold">
                MK
              </div>
              <div>
                <div className="text-xs font-medium text-[#F7F5F0]">Maria K.</div>
                <div className="text-[10px] text-[#64748B]">Head Chef, The Grand Hotel</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-[#64748B]">
          &copy; {new Date().getFullYear()} OrderRoom. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#F7F5F0] tracking-tight">Welcome back</h1>
            <p className="text-sm text-[#64748B] mt-1.5">Sign in to your OrderRoom account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                required
                className="w-full h-10 px-3.5 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#94A3B8]" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#F59E0B] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3.5 pr-10 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#EF4444] text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#0F1B2D] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 px-3 py-2.5 rounded-lg bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)]">
            <p className="text-xs text-[#94A3B8]">
              <span className="text-[#F59E0B] font-medium">Demo credentials:</span> demo@orderroom.io / demo1234
            </p>
          </div>

          <p className="text-center text-xs text-[#64748B] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#F59E0B] hover:underline font-medium">
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
