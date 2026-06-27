"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, Download } from "lucide-react"

// ─── colour constants matching the app design tokens ────────────────────────
const C = {
  navy:     "#0F1B2D",
  card:     "#162236",
  elevated: "#1E2F45",
  border:   "#1E3050",
  white:    "#F7F5F0",
  amber:    "#F59E0B",
  slate:    "#64748B",
  success:  "#10B981",
  info:     "#3B82F6",
  purple:   "#8B5CF6",
}

// ─── tiny building-block components ─────────────────────────────────────────

function Label({ children, color = C.slate }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
      {children}
    </span>
  )
}

function Connector({ label, vertical = false }: { label?: string; vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0.5 py-1">
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#1E3050] to-[#1E3050]" />
        {label && (
          <span className="text-[9px] font-mono text-[#64748B] bg-[#0F1B2D] px-1.5 rounded border border-[#1E3050]">
            {label}
          </span>
        )}
        {/* arrow head */}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M5 6L0 0H10L5 6Z" fill="#1E3050" />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 px-1">
      <div className="flex-1 h-px bg-[#1E3050]" />
      {label && (
        <span className="text-[9px] font-mono text-[#64748B] bg-[#0F1B2D] px-1.5 py-0.5 rounded border border-[#1E3050]">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-[#1E3050]" />
      {/* arrow head right */}
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
        <path d="M6 5L0 0V10L6 5Z" fill="#1E3050" />
      </svg>
    </div>
  )
}

function ServiceChip({ children, color }: { children: string; color: string }) {
  return (
    <span
      className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
      style={{ color, borderColor: color + "40", background: color + "12" }}
    >
      {children}
    </span>
  )
}

// ─── main node cards ─────────────────────────────────────────────────────────

function NodeCard({
  title,
  subtitle,
  accentColor = C.amber,
  badge,
  children,
  className = "",
}: {
  title: string
  subtitle?: string
  accentColor?: string
  badge?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border flex flex-col ${className}`}
      style={{ background: C.card, borderColor: C.border }}
    >
      {/* header band */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-xl"
        style={{ background: accentColor + "14", borderBottom: `1px solid ${C.border}` }}
      >
        <div>
          <div className="text-sm font-semibold" style={{ color: C.white }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-[10px] mt-0.5" style={{ color: C.slate }}>
              {subtitle}
            </div>
          )}
        </div>
        {badge && (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: accentColor + "22", color: accentColor, border: `1px solid ${accentColor}40` }}
          >
            {badge}
          </span>
        )}
      </div>

      {children && <div className="px-4 py-3">{children}</div>}
    </div>
  )
}

function TableRow({ name, type }: { name: string; type: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[11px] font-mono" style={{ color: C.white }}>
        {name}
      </span>
      <span className="text-[10px] font-mono" style={{ color: C.slate }}>
        {type}
      </span>
    </div>
  )
}

function EventRow({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-[11px] font-mono" style={{ color: C.white }}>
        {name}
      </span>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen" style={{ background: C.navy }}>
      {/* top bar */}
      <div
        className="flex items-center justify-between px-8 h-14 border-b"
        style={{ borderColor: C.border, background: "#0D1825" }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: C.slate }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </Link>
          <div className="w-px h-4" style={{ background: C.border }} />
          <span className="text-sm font-semibold" style={{ color: C.white }}>
            System Architecture
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: C.amber + "22", color: C.amber, border: `1px solid ${C.amber}40` }}
          >
            Hackathon Submission · Section 13
          </span>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors"
          style={{ color: C.slate, borderColor: C.border }}
        >
          <Download className="w-3.5 h-3.5" />
          Print / Save PDF
        </button>
      </div>

      {/* diagram canvas */}
      <div className="px-8 py-8 max-w-[1200px] mx-auto">

        {/* title block */}
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: C.white, fontFamily: "var(--font-dm-serif, serif)" }}
          >
            OrderRoom — Infrastructure Architecture
          </h1>
          <p className="text-sm mt-1" style={{ color: C.slate }}>
            Next.js 16 · AWS Aurora PostgreSQL · AWS DynamoDB · Resend · Stripe
          </p>
        </div>

        {/* ── LAYER 1: USER BROWSER ──────────────────────────────────────────── */}
        <div
          className="rounded-2xl border-2 border-dashed p-5 mb-3"
          style={{ borderColor: C.border }}
        >
          <Label color={C.slate}>Layer 1 — Client</Label>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div
              className="rounded-xl border px-4 py-3"
              style={{ background: C.elevated, borderColor: C.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-xs font-semibold" style={{ color: C.white }}>
                  Restaurant Owner Browser
                </span>
              </div>
              <div className="space-y-1">
                {["Dashboard / analytics", "New order wizard", "Vendor management", "Billing / upgrade"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ background: C.slate }} />
                    <span className="text-[11px]" style={{ color: C.slate }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-xl border px-4 py-3"
              style={{ background: C.elevated, borderColor: C.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="text-xs font-semibold" style={{ color: C.white }}>
                  Vendor Browser (no login)
                </span>
              </div>
              <div className="space-y-1">
                {["/confirm/[token] — confirm order", "/reject — decline with reason", "No account required", "Mobile-first layout"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ background: C.slate }} />
                    <span className="text-[11px]" style={{ color: C.slate }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* arrow down */}
        <Connector label="HTTPS" vertical />

        {/* ── LAYER 2: VERCEL EDGE ───────────────────────────────────────────── */}
        <div
          className="rounded-2xl border-2 p-5 mb-3"
          style={{ borderColor: C.amber + "50", background: C.amber + "06" }}
        >
          <div className="flex items-center justify-between mb-4">
            <Label color={C.amber}>Layer 2 — Vercel Edge Network</Label>
            <div className="flex items-center gap-2">
              <ServiceChip color={C.amber}>Next.js 16</ServiceChip>
              <ServiceChip color={C.amber}>App Router</ServiceChip>
              <ServiceChip color={C.amber}>Turbopack</ServiceChip>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* SSR pages */}
            <div className="rounded-xl border px-4 py-3" style={{ background: C.card, borderColor: C.border }}>
              <div className="text-xs font-semibold mb-2" style={{ color: C.white }}>SSR / RSC Pages</div>
              <div className="space-y-1">
                {["/dashboard", "/vendors", "/products", "/orders", "/billing", "/confirm/[token]"].map((r) => (
                  <div key={r} className="text-[10px] font-mono" style={{ color: C.slate }}>{r}</div>
                ))}
              </div>
            </div>

            {/* API routes */}
            <div className="rounded-xl border px-4 py-3" style={{ background: C.card, borderColor: C.border }}>
              <div className="text-xs font-semibold mb-2" style={{ color: C.white }}>API Routes</div>
              <div className="space-y-1">
                {[
                  "/api/auth/[...nextauth]",
                  "/api/vendors",
                  "/api/orders  ·  /api/orders/[id]",
                  "/api/orders/[id]/send",
                  "/api/confirm/[token]",
                  "/api/stripe/*  ·  /api/events",
                ].map((r) => (
                  <div key={r} className="text-[10px] font-mono" style={{ color: C.slate }}>{r}</div>
                ))}
              </div>
            </div>

            {/* Auth */}
            <div className="rounded-xl border px-4 py-3" style={{ background: C.card, borderColor: C.border }}>
              <div className="text-xs font-semibold mb-2" style={{ color: C.white }}>Auth Layer</div>
              <div className="space-y-1">
                {[
                  "NextAuth.js",
                  "Credentials (email+bcrypt)",
                  "Google OAuth 2.0",
                  "JWT sessions",
                  "businessId-scoped queries",
                ].map((r) => (
                  <div key={r} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: C.slate }} />
                    <span className="text-[10px]" style={{ color: C.slate }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── LAYER 3: DATA + SERVICES ───────────────────────────────────────── */}
        <div className="mt-3 grid grid-cols-3 gap-3 items-start">

          {/* connector to Aurora */}
          <div className="flex flex-col items-center gap-0">
            <Connector vertical />
          </div>
          {/* connector to DynamoDB */}
          <div className="flex flex-col items-center gap-0">
            <Connector vertical />
          </div>
          {/* connector to external services */}
          <div className="flex flex-col items-center gap-0">
            <Connector vertical />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">

          {/* Aurora PostgreSQL */}
          <NodeCard
            title="AWS Aurora PostgreSQL"
            subtitle="Relational · ACID compliant"
            accentColor={C.info}
            badge="Primary DB"
          >
            <div className="mb-2">
              <Label color={C.info}>Schema tables</Label>
            </div>
            <div
              className="rounded-lg border p-2 mb-3 font-mono"
              style={{ background: C.elevated, borderColor: C.border }}
            >
              {[
                ["businesses", "cuid PK"],
                ["users",      "bcrypt hash"],
                ["vendors",    "+ category"],
                ["products",   "+ unit"],
                ["orders",     "status enum"],
                ["order_items","qty · price"],
                ["subscriptions","Stripe sub"],
              ].map(([n, t]) => (
                <TableRow key={n} name={n} type={t} />
              ))}
            </div>
            <div className="space-y-1">
              <Label color={C.slate}>ORM</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                <ServiceChip color={C.info}>Prisma ORM</ServiceChip>
                <ServiceChip color={C.info}>connection pooling</ServiceChip>
                <ServiceChip color={C.info}>IAM auth</ServiceChip>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: C.border }}>
              <p className="text-[10px] leading-relaxed" style={{ color: C.slate }}>
                Orders have strict relationships (order → items → vendors → products).
                ACID compliance is critical — we cannot lose a payment or order record.
              </p>
            </div>
          </NodeCard>

          {/* DynamoDB */}
          <NodeCard
            title="AWS DynamoDB"
            subtitle="Event log · Key-value"
            accentColor={C.success}
            badge="Event Store"
          >
            <div className="mb-2">
              <Label color={C.success}>order_events table</Label>
            </div>
            <div
              className="rounded-lg border p-2 mb-3"
              style={{ background: C.elevated, borderColor: C.border }}
            >
              <div className="text-[10px] font-mono mb-2" style={{ color: C.slate }}>
                PK: orderId · SK: timestamp
              </div>
              {[
                ["ORDER_SENT",    C.info],
                ["CONFIRMED",     C.success],
                ["REJECTED",      "#EF4444"],
                ["DELIVERED",     C.purple],
                ["REMIND_SENT",   C.amber],
              ].map(([n, col]) => (
                <EventRow key={n} name={n} color={col} />
              ))}
            </div>
            <div className="space-y-1">
              <Label color={C.slate}>SDK</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                <ServiceChip color={C.success}>@aws-sdk/client-dynamodb</ServiceChip>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: C.border }}>
              <p className="text-[10px] leading-relaxed" style={{ color: C.slate }}>
                When 50 vendors confirm simultaneously, DynamoDB handles concurrent
                writes without locks. Query pattern "all events for order X" maps
                directly to the partition key.
              </p>
            </div>
          </NodeCard>

          {/* External services column */}
          <div className="flex flex-col gap-4">

            {/* Resend */}
            <NodeCard
              title="Resend API"
              subtitle="Transactional email delivery"
              accentColor={C.amber}
              badge="Email"
            >
              <div className="space-y-1.5">
                {[
                  { label: "React Email template", note: "vendor-order.tsx" },
                  { label: "Per-vendor dispatch",  note: "one email / vendor" },
                  { label: "Confirm link embed",   note: "/confirm/[token]" },
                  { label: "Decline link embed",   note: "/reject/[token]"  },
                ].map(({ label, note }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-[11px]" style={{ color: C.white }}>{label}</span>
                    <span className="text-[10px] font-mono flex-shrink-0" style={{ color: C.slate }}>{note}</span>
                  </div>
                ))}
              </div>
            </NodeCard>

            {/* Stripe */}
            <NodeCard
              title="Stripe API"
              subtitle="Subscriptions + billing"
              accentColor={C.purple}
              badge="Payments"
            >
              <div className="space-y-1.5">
                {[
                  { label: "Hosted Checkout",      note: "create-checkout" },
                  { label: "Webhook sync",         note: "sub.updated"     },
                  { label: "Customer portal",      note: "portal route"    },
                  { label: "Free / Starter / Pro", note: "vendor limits"   },
                ].map(({ label, note }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-[11px]" style={{ color: C.white }}>{label}</span>
                    <span className="text-[10px] font-mono flex-shrink-0" style={{ color: C.slate }}>{note}</span>
                  </div>
                ))}
              </div>
            </NodeCard>
          </div>
        </div>

        {/* ── DATA FLOW LEGEND ──────────────────────────────────────────────── */}
        <div
          className="mt-8 rounded-2xl border p-5"
          style={{ background: C.card, borderColor: C.border }}
        >
          <div className="mb-4">
            <Label color={C.slate}>Data Flow — Order Lifecycle</Label>
          </div>

          <div className="flex items-start gap-2 overflow-x-auto pb-2">
            {[
              { step: "1", label: "Owner creates order",   sub: "POST /api/orders",             color: C.slate  },
              { step: "2", label: "Emails dispatched",     sub: "Resend + React Email",          color: C.amber  },
              { step: "3", label: "Vendor opens link",     sub: "/confirm/[token]",              color: C.info   },
              { step: "4", label: "Vendor confirms/rejects",sub: "PATCH + DynamoDB event",       color: C.success },
              { step: "5", label: "Owner marks delivered", sub: "DELIVERED event",               color: C.purple },
              { step: "6", label: "Stripe webhook",        sub: "Plan limits enforced in real-time", color: "#EF4444" },
            ].map(({ step, label, sub, color }, i, arr) => (
              <div key={step} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: color + "22", color, border: `1px solid ${color}40` }}
                  >
                    {step}
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-semibold whitespace-nowrap" style={{ color: C.white }}>
                      {label}
                    </div>
                    <div className="text-[10px] font-mono whitespace-nowrap" style={{ color: C.slate }}>
                      {sub}
                    </div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center gap-0.5 mt-[-18px]">
                    <div className="w-6 h-px" style={{ background: C.border }} />
                    <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                      <path d="M5 4L0 0V8L5 4Z" fill={C.border} />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY TWO AWS DATABASES ─────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div
            className="rounded-xl border p-4"
            style={{ background: C.card, borderColor: C.border }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: C.info }} />
              <span className="text-sm font-semibold" style={{ color: C.white }}>
                Why Aurora PostgreSQL?
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.slate }}>
              Orders are relational by nature: an order belongs to a business, contains
              items, each item references a vendor and a product. PostgreSQL&apos;s foreign
              keys, joins, and ACID transactions guarantee we never lose a payment or
              order record — critical for any food-service operation. Prisma ORM provides
              type-safe queries and schema migrations.
            </p>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ background: C.card, borderColor: C.border }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: C.success }} />
              <span className="text-sm font-semibold" style={{ color: C.white }}>
                Why DynamoDB?
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.slate }}>
              Event logs are write-heavy and structurally independent — each confirmation
              or rejection is a discrete, self-contained record. When 50 vendors confirm
              at once, DynamoDB handles the concurrent writes without locking rows.
              The query pattern &quot;fetch all events for order X&quot; maps directly to a
              partition key on <code className="font-mono text-[10px]">orderId</code>, giving
              single-digit millisecond reads.
            </p>
          </div>
        </div>

        {/* ── ENV VARS CHECKLIST ────────────────────────────────────────────── */}
        <div
          className="mt-4 rounded-xl border p-4"
          style={{ background: C.card, borderColor: C.border }}
        >
          <div className="mb-3">
            <Label color={C.slate}>Required Environment Variables</Label>
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1">
            {[
              ["DATABASE_URL",               "Aurora PostgreSQL connection string"],
              ["AWS_REGION",                 "DynamoDB region (e.g. us-east-1)"],
              ["DYNAMODB_TABLE_NAME",        "order_events"],
              ["NEXTAUTH_URL",               "App URL for NextAuth redirects"],
              ["NEXTAUTH_SECRET",            "Random 32-byte secret"],
              ["GOOGLE_CLIENT_ID",           "OAuth 2.0 Client ID"],
              ["GOOGLE_CLIENT_SECRET",       "OAuth 2.0 Client Secret"],
              ["RESEND_API_KEY",             "re_SWT1DfsF_…"],
              ["EMAIL_FROM",                 "orders@yourdomain.com"],
              ["STRIPE_SECRET_KEY",          "sk_live_…"],
              ["STRIPE_WEBHOOK_SECRET",      "whsec_…"],
              ["STRIPE_STARTER_PRICE_ID",    "price_…  (Starter plan)"],
              ["STRIPE_PRO_PRICE_ID",        "price_…  (Pro plan)"],
              ["NEXT_PUBLIC_APP_URL",        "https://yourapp.vercel.app"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-start gap-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: C.success }} />
                <div>
                  <div className="text-[10px] font-mono" style={{ color: C.white }}>{key}</div>
                  <div className="text-[9px]" style={{ color: C.slate }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[11px]" style={{ color: C.slate }}>
            OrderRoom · Hackathon Track 2 Submission · Section 13 — Architecture Diagram
          </span>
          <a
            href="https://app.diagrams.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] transition-colors"
            style={{ color: C.slate }}
          >
            <ExternalLink className="w-3 h-3" />
            Edit in draw.io
          </a>
        </div>
      </div>

      {/* print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          @page { margin: 0.5in; size: A3 landscape; }
        }
      `}</style>
    </div>
  )
}
