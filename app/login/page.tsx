"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
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

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!result) {
        setError("Login failed. Please try again.")
        setLoading(false)
        return
      }

      if (result.error) {
        setError("Invalid email or password.")
        setLoading(false)
        return
      }

      // Login successful - redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[460px] bg-[#0D1825] border-r border-[#1E3050] flex-col justify-between p-10 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-base">OrderRoom</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl text-[#F7F5F0] leading-tight">
              Replace 20 vendor chats with one daily order.
            </h2>
            <p className="text-[#64748B] text-sm mt-3 leading-relaxed">
              Restaurants and hotels use OrderRoom to place all their supply orders in under 60 seconds every morning.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "60s", label: "Avg. ordering time" },
              { value: "98%", label: "Vendor confirmation rate" },
              { value: "0", label: "Vendor app signups required" },
              { value: "100%", label: "Email-based — no friction" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#162236] border border-[#1E3050] rounded-lg p-4">
                <div className="text-[#F59E0B] text-2xl font-bold">{stat.value}</div>
                <div className="text-[#64748B] text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#162236] border border-[#1E3050] rounded-lg p-5">
            <p className="text-[#94A3B8] text-sm leading-relaxed italic">
              &ldquo;We went from 45 minutes of WhatsApp chaos every morning to 2 clicks. Our vendors love the email confirmations.&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-4">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0F1B2D] text-xs font-bold flex-shrink-0">MK</div>
              <div>
                <div className="text-xs font-medium text-[#F7F5F0]">Maria K.</div>
                <div className="text-[10px] text-[#64748B]">Head Chef, The Grand Hotel</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-[#374151]">&copy; {new Date().getFullYear()} OrderRoom. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm fade-in">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#F7F5F0] tracking-tight">Welcome back</h1>
            <p className="text-sm text-[#64748B] mt-1.5">Sign in to your OrderRoom account</p>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full h-10 flex items-center justify-center gap-2.5 border border-[#1E3050] rounded-lg text-sm font-medium text-[#94A3B8] hover:bg-[#162236] hover:text-[#F7F5F0] transition-colors mb-5"
          >
            {/* Google G */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#1E3050]" />
            <span className="text-xs text-[#374151]">or continue with email</span>
            <div className="flex-1 h-px bg-[#1E3050]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="email">Email address</label>
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
                <label className="block text-xs font-medium text-[#94A3B8]" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-[#F59E0B] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•���••••••"
                  required
                  className="w-full h-10 px-3.5 pr-10 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-[#F87171] text-xs" role="alert">
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
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-5 px-3 py-2.5 rounded-lg bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.15)]">
            <p className="text-xs text-[#94A3B8]">
              <span className="text-[#F59E0B] font-medium">Demo:</span> demo@orderroom.io / demo1234
            </p>
          </div>

          <p className="text-center text-xs text-[#64748B] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#F59E0B] hover:underline font-medium">Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
