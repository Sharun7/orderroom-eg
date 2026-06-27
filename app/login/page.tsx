"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  function handleSignIn() {
    router.push("/dashboard")
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
              { value: "0",   label: "Vendor app signups required" },
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
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#F7F5F0] tracking-tight">Welcome back</h1>
            <p className="text-sm text-[#64748B] mt-1.5">Click below to enter the OrderRoom dashboard</p>
          </div>

          <div className="mb-6 px-4 py-4 rounded-xl bg-[#162236] border border-[#1E3050]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0F1B2D] font-bold text-sm flex-shrink-0">AR</div>
              <div>
                <div className="text-sm font-semibold text-[#F7F5F0]">Alex Rivera</div>
                <div className="text-xs text-[#64748B]">demo@orderroom.io &middot; Owner</div>
              </div>
            </div>
            <div className="text-xs text-[#64748B] leading-relaxed">
              The Harbor Restaurant &mdash; demo account with full access to all features.
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignIn}
            className="w-full h-11 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-4 px-3 py-2.5 rounded-lg bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.15)]">
            <p className="text-xs text-[#94A3B8]">
              <span className="text-[#F59E0B] font-medium">Demo mode:</span> No login required. All data is pre-loaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
