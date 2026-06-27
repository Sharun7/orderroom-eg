"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowRight, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md fade-in">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#F7F5F0] tracking-tight">Start your free trial</h1>
          <p className="text-sm text-[#64748B] mt-1.5">No vendor signups required. Get started in minutes.</p>
        </div>

        <div className="bg-[#162236] border border-[#1E3050] rounded-lg p-5 mb-6">
          <p className="text-xs font-medium text-[#F59E0B] mb-3">What you get on the free trial:</p>
          <div className="space-y-2">
            {[
              "Up to 5 active vendors",
              "Unlimited daily orders",
              "Email confirmations via Resend",
              "Today&apos;s Order Status Board",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                <span className="text-xs text-[#94A3B8]" dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">First name</label>
              <input
                type="text"
                placeholder="Alex"
                required
                className="w-full h-10 px-3.5 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Last name</label>
              <input
                type="text"
                placeholder="Rivera"
                required
                className="w-full h-10 px-3.5 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Business name</label>
            <input
              type="text"
              placeholder="The Harbor Restaurant"
              required
              className="w-full h-10 px-3.5 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Work email</label>
            <input
              type="email"
              placeholder="you@restaurant.com"
              required
              className="w-full h-10 px-3.5 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                required
                minLength={8}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#0F1B2D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#64748B]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F59E0B] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
