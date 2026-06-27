"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import {
  Check, Zap, Building2, Crown, ArrowRight,
  CreditCard, Calendar, Users, ExternalLink, CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlanKey } from "@/lib/stripe"

// ---------------------------------------------------------------------------
// Plan display data (mirrors lib/stripe.ts PLANS — client-safe copy)
// ---------------------------------------------------------------------------

const PLANS: Record<PlanKey, {
  name:        string
  price:       number
  vendorLimit: number
  features:    string[]
  icon:        typeof Zap
  iconBg:      string
  iconColor:   string
  border:      string
  badge?:      string
}> = {
  free: {
    name:        "Free",
    price:       0,
    vendorLimit: 1,
    icon:        Building2,
    iconBg:      "bg-[rgba(100,116,139,0.12)]",
    iconColor:   "text-[#94A3B8]",
    border:      "border-[#1E3050]",
    features: [
      "1 vendor",
      "Unlimited orders",
      "Email confirmations",
      "DynamoDB event log",
    ],
  },
  starter: {
    name:        "Starter",
    price:       29,
    vendorLimit: 10,
    icon:        Zap,
    iconBg:      "bg-[rgba(245,158,11,0.12)]",
    iconColor:   "text-[#F59E0B]",
    border:      "border-[#F59E0B]",
    badge:       "Most Popular",
    features: [
      "Up to 10 vendors",
      "Unlimited orders",
      "Email confirmations",
      "DynamoDB event log",
      "Auto reminder emails",
      "Daily digest",
    ],
  },
  pro: {
    name:        "Pro",
    price:       79,
    vendorLimit: 999,
    icon:        Crown,
    iconBg:      "bg-[rgba(139,92,246,0.12)]",
    iconColor:   "text-[#A78BFA]",
    border:      "border-[rgba(139,92,246,0.4)]",
    badge:       "Unlimited",
    features: [
      "Unlimited vendors",
      "Unlimited orders",
      "Email confirmations",
      "DynamoDB event log",
      "Auto reminder emails",
      "Daily digest",
      "Priority support",
      "Custom sender domain",
    ],
  },
}

// ---------------------------------------------------------------------------
// Demo subscription state (real apps read this from the API)
// ---------------------------------------------------------------------------

const DEMO_SUB = {
  plan:            "starter" as PlanKey,
  status:          "active",
  vendorLimit:     10,
  vendorCount:     6,
  currentPeriodEnd: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000), // 29 days from now
  stripeCustomerId: "cus_demo",
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct     = limit >= 999 ? 100 : Math.min((used / limit) * 100, 100)
  const isHigh  = pct >= 80
  const isMaxed = pct >= 100

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#64748B]">{label}</span>
        <span className={cn("text-xs font-semibold", isMaxed ? "text-[#EF4444]" : isHigh ? "text-[#F59E0B]" : "text-[#F7F5F0]")}>
          {limit >= 999 ? `${used} / Unlimited` : `${used} / ${limit}`}
        </span>
      </div>
      <div className="h-1.5 bg-[#1E2F45] rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", isMaxed ? "bg-[#EF4444]" : isHigh ? "bg-[#F59E0B]" : "bg-[#10B981]")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function PlanCard({
  planKey, current, onUpgrade, loading,
}: {
  planKey:   PlanKey
  current:   PlanKey
  onUpgrade: (p: PlanKey) => void
  loading:   PlanKey | null
}) {
  const plan = PLANS[planKey]
  const Icon = plan.icon
  const isCurrent = planKey === current
  const isDowngrade =
    (current === "pro" && planKey !== "pro") ||
    (current === "starter" && planKey === "free")

  return (
    <div className={cn(
      "relative bg-[#162236] border-2 rounded-2xl p-6 flex flex-col",
      isCurrent ? "border-[#F59E0B] ring-1 ring-[rgba(245,158,11,0.2)]" : plan.border,
    )}>
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#F59E0B] text-[#0F1B2D] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", plan.iconBg)}>
            <Icon className={cn("w-4.5 h-4.5", plan.iconColor)} />
          </div>
          <p className="text-base font-bold text-[#F7F5F0]">{plan.name}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-[#F7F5F0]">
              {plan.price === 0 ? "Free" : `$${plan.price}`}
            </span>
            {plan.price > 0 && <span className="text-xs text-[#64748B]">/ month</span>}
          </div>
        </div>
        {isCurrent && (
          <span className="text-[10px] font-semibold text-[#F59E0B] bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] px-2.5 py-1 rounded-full">
            Current plan
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 flex-1 mb-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-[#94A3B8]">
            <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <div className="h-10 flex items-center justify-center rounded-xl border border-[rgba(245,158,11,0.3)] text-[#F59E0B] text-sm font-medium">
          Active
        </div>
      ) : isDowngrade ? (
        <div className="h-10 flex items-center justify-center rounded-xl border border-[#1E3050] text-[#374151] text-xs cursor-not-allowed">
          Downgrade via portal
        </div>
      ) : (
        <button
          onClick={() => onUpgrade(planKey)}
          disabled={loading !== null}
          className={cn(
            "h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60",
            planKey === "pro"
              ? "bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.4)] text-[#A78BFA] hover:bg-[rgba(139,92,246,0.3)]"
              : "bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D]",
          )}
        >
          {loading === planKey ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <><ArrowRight className="w-3.5 h-3.5" /> Upgrade to {plan.name}</>
          )}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BillingPage() {
  const searchParams  = useSearchParams()
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState<PlanKey | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const sub = DEMO_SUB

  // Show success / cancelled toasts from Stripe redirect
  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setToast("Subscription activated! Your plan has been upgraded.")
      window.history.replaceState({}, "", "/billing")
    } else if (searchParams.get("cancelled") === "1") {
      setToast("Checkout cancelled — no changes were made.")
      window.history.replaceState({}, "", "/billing")
    }
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [searchParams])

  async function handleUpgrade(plan: PlanKey) {
    setLoading(plan)
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setToast(data.error ?? "Could not start checkout. Ensure STRIPE_STARTER_PRICE_ID / STRIPE_PRO_PRICE_ID are set.")
      }
    } catch {
      setToast("Network error — please try again.")
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal")
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setToast("Could not open billing portal. Make sure a Stripe customer exists.")
      }
    } catch {
      setToast("Network error — please try again.")
    } finally {
      setPortalLoading(false)
    }
  }

  const plan = PLANS[sub.plan]

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="Billing" subtitle="Manage your plan and usage" />

      {/* Toast */}
      {toast && (
        <div className="mx-6 mt-4 flex items-center gap-2.5 bg-[#162236] border border-[#1E3050] rounded-xl px-4 py-3 text-sm text-[#F7F5F0] fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          {toast}
          <button onClick={() => setToast(null)} className="ml-auto text-[#64748B] hover:text-[#94A3B8] text-xs">Dismiss</button>
        </div>
      )}

      <div className="flex-1 p-6 fade-in space-y-8 max-w-4xl">

        {/* ── Current Plan Overview ── */}
        <div className="bg-[#162236] border border-[#1E3050] rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", plan.iconBg)}>
                <plan.icon className={cn("w-6 h-6", plan.iconColor)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-[#F7F5F0]">{plan.name} Plan</p>
                  <span className="text-[10px] font-semibold text-[#34D399] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-2 py-0.5 rounded-full uppercase">
                    {sub.status}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mt-0.5">
                  {plan.price === 0 ? "Free forever" : `$${plan.price} / month`}
                  {sub.currentPeriodEnd && plan.price > 0 && (
                    <> · Renews {sub.currentPeriodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sub.stripeCustomerId !== "cus_demo" && (
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="flex items-center gap-1.5 h-9 px-4 border border-[#1E3050] text-[#94A3B8] text-xs font-medium rounded-lg hover:bg-[#1E2F45] hover:text-[#F7F5F0] transition-colors disabled:opacity-50"
                >
                  {portalLoading
                    ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : <><CreditCard className="w-3.5 h-3.5" /> Manage Billing<ExternalLink className="w-3 h-3 ml-0.5" /></>
                  }
                </button>
              )}
            </div>
          </div>

          {/* Usage metrics */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-[#0F1B2D] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Vendors</span>
              </div>
              <UsageBar
                used={sub.vendorCount}
                limit={sub.vendorLimit}
                label="Vendor slots used"
              />
            </div>
            <div className="bg-[#0F1B2D] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Next Billing</span>
              </div>
              {plan.price > 0 && sub.currentPeriodEnd ? (
                <>
                  <p className="text-lg font-bold text-[#F7F5F0]">
                    {sub.currentPeriodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-[10px] text-[#64748B]">{sub.currentPeriodEnd.getFullYear()}</p>
                </>
              ) : (
                <p className="text-sm text-[#374151]">—</p>
              )}
            </div>
            <div className="bg-[#0F1B2D] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Orders</span>
              </div>
              <p className="text-lg font-bold text-[#F7F5F0]">Unlimited</p>
              <p className="text-[10px] text-[#64748B]">All plans</p>
            </div>
          </div>

          {/* Vendor limit warning */}
          {sub.vendorLimit < 999 && sub.vendorCount / sub.vendorLimit >= 0.8 && (
            <div className="mt-4 flex items-start gap-2.5 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-xl px-4 py-3">
              <Zap className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                <span className="text-[#F59E0B] font-semibold">You&apos;re using {sub.vendorCount} of {sub.vendorLimit} vendor slots.</span>{" "}
                Upgrade to {sub.plan === "starter" ? "Pro" : "Starter"} to add more vendors.
              </p>
            </div>
          )}
        </div>

        {/* ── Plan Comparison ── */}
        <div>
          <h2 className="text-sm font-semibold text-[#F7F5F0] mb-4">Available Plans</h2>
          <div className="grid grid-cols-3 gap-4">
            {(["free", "starter", "pro"] as PlanKey[]).map((key) => (
              <PlanCard
                key={key}
                planKey={key}
                current={sub.plan}
                onUpgrade={handleUpgrade}
                loading={loading}
              />
            ))}
          </div>
        </div>

        {/* ── Stripe note for judges ── */}
        <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(99,102,241,0.12)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4 text-[#818CF8]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F7F5F0] mb-1">Stripe Integration</p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Checkout sessions are created via <span className="font-mono text-[#94A3B8]">POST /api/stripe/create-checkout</span>.
                Subscription events (activated, updated, cancelled) are handled by <span className="font-mono text-[#94A3B8]">POST /api/stripe/webhook</span> and synced to Aurora PostgreSQL.
                The billing portal is served via <span className="font-mono text-[#94A3B8]">GET /api/stripe/portal</span>.
                Plan limits are enforced server-side on <span className="font-mono text-[#94A3B8]">POST /api/vendors</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
