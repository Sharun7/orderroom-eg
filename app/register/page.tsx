"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle } from "lucide-react"

const BUSINESS_TYPES = ["Restaurant", "Hotel", "Catering", "Bakery", "Other"]

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ]
  const strength = checks.filter((c) => c.ok).length
  const barColors = ["bg-[#374151]", "bg-[#EF4444]", "bg-[#F59E0B]", "bg-[#10B981]"]
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? barColors[strength] : "bg-[#1E3050]"}`} />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map((c) => (
          <span key={c.label} className={`text-[10px] flex items-center gap-1 transition-colors ${c.ok ? "text-[#34D399]" : "text-[#374151]"}`}>
            <CheckCircle className="w-2.5 h-2.5" />{c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ businessName: "", yourName: "", email: "", password: "", businessType: "" })

  function setField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }))
      setErrors((p) => ({ ...p, [field]: "" }))
    }
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.businessName.trim()) errs.businessName = "Business name is required."
    if (!form.yourName.trim()) errs.yourName = "Your name is required."
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address."
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters."
    if (!form.businessType) errs.businessType = "Select a business type."
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    router.push("/onboarding")
  }

  function inputClass(field: string) {
    return `w-full h-10 px-3.5 rounded-lg bg-[#162236] border text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:ring-1 transition-colors ${
      errors[field]
        ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[rgba(239,68,68,0.3)]"
        : "border-[#1E3050] focus:border-[#F59E0B] focus:ring-[#F59E0B]"
    }`
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[460px] bg-[#0D1825] border-r border-[#1E3050] flex-col justify-between p-10 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-base">OrderRoom</span>
        </Link>
        <div className="space-y-6">
          <h2 className="font-display text-3xl text-[#F7F5F0] leading-tight">
            Set up in 5 minutes. Save 40 minutes every day.
          </h2>
          <div className="space-y-4">
            {[
              { step: "1", label: "Add your vendors once", desc: "Name, email, their usual products" },
              { step: "2", label: "Place daily orders in seconds", desc: "Pre-filled form, one-click send" },
              { step: "3", label: "Vendors confirm by email link", desc: "No app, no account needed for them" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center text-sm font-bold text-[#F59E0B] flex-shrink-0">{item.step}</div>
                <div>
                  <p className="text-sm font-medium text-[#F7F5F0]">{item.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#162236] border border-[#1E3050] rounded-lg px-4 py-3">
            <p className="text-xs text-[#64748B]">
              <span className="text-[#34D399] font-medium">Free plan</span> — 1 vendor, unlimited orders, no credit card required.
            </p>
          </div>
        </div>
        <p className="text-[10px] text-[#374151]">&copy; {new Date().getFullYear()} OrderRoom. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm fade-in">
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#F7F5F0] tracking-tight">Create your account</h1>
            <p className="text-sm text-[#64748B] mt-1.5">Free forever for 1 vendor. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="businessName">Business name *</label>
                <input id="businessName" value={form.businessName} onChange={setField("businessName")} placeholder="The Harbor Restaurant" className={inputClass("businessName")} />
                {errors.businessName && <p className="text-[10px] text-[#F87171] mt-1">{errors.businessName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="yourName">Your name *</label>
                <input id="yourName" value={form.yourName} onChange={setField("yourName")} placeholder="Alex Chen" className={inputClass("yourName")} />
                {errors.yourName && <p className="text-[10px] text-[#F87171] mt-1">{errors.yourName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="businessType">Business type *</label>
              <select id="businessType" value={form.businessType} onChange={setField("businessType")} className={inputClass("businessType") + " appearance-none"}>
                <option value="" disabled>Select type…</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.businessType && <p className="text-[10px] text-[#F87171] mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="regEmail">Work email *</label>
              <input id="regEmail" type="email" value={form.email} onChange={setField("email")} placeholder="you@restaurant.com" className={inputClass("email")} />
              {errors.email && <p className="text-[10px] text-[#F87171] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5" htmlFor="regPassword">Password *</label>
              <div className="relative">
                <input
                  id="regPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={setField("password")}
                  placeholder="Min. 8 characters"
                  className={inputClass("password") + " pr-10"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]" aria-label={showPassword ? "Hide" : "Show"}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password} />}
              {errors.password && <p className="text-[10px] text-[#F87171] mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full h-10 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading
                ? <div className="w-4 h-4 border-2 border-[#0F1B2D] border-t-transparent rounded-full animate-spin" />
                : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-[10px] text-[#374151] text-center">
              By creating an account you agree to our{" "}
              <a href="#" className="text-[#64748B] hover:underline">Terms</a> and{" "}
              <a href="#" className="text-[#64748B] hover:underline">Privacy Policy</a>.
            </p>
          </form>

          <p className="text-center text-xs text-[#64748B] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F59E0B] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
