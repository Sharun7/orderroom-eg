"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Github,
  Database,
  Zap,
  Mail,
  CreditCard,
  Globe,
  Server,
  Clock,
} from "lucide-react"

// ─── Markdown source (copy-paste ready for dev.to) ────────────────────────────

const MARKDOWN = `---
title: How I Built a B2B Vendor Ordering Platform in 3 Days Using Vercel v0, Aurora PostgreSQL, and DynamoDB
published: true
description: Restaurant owners manage 15 vendor WhatsApp chats every morning. I replaced that chaos with one daily order flow — built solo in 72 hours for the H0 Hackathon.
tags: aws, nextjs, vercel, webdev
cover_image: https://orderroom.vercel.app/og.png
---

## The Problem

Every morning at 6 AM, a restaurant owner pulls out their phone and fires off the same 15 WhatsApp messages. "Hi, need 20kg onions today." "Can you do 5 boxes of cherry tomatoes?" "Same as last Tuesday for the fish please."

Then they wait. And follow up. And wonder why half their vendors haven't confirmed by 9 AM when the kitchen needs to start prep. Orders get missed. Wrong quantities arrive. There is no audit trail. If something goes wrong, nobody can prove what was actually ordered.

Existing solutions like MarketMan or BlueCart require vendors to create accounts and download apps. That is the adoption killer. The vendor who has been supplying your restaurant for 12 years is not going to install new software. The friction is fatal.

---

## The Solution — OrderRoom

OrderRoom flips the model. The restaurant owner is the only person who needs an account. Vendors confirm via a simple email link — zero signup, works on any device, opens in any email client.

The owner onboards in under 5 minutes: add your vendors (name, email, category), add their products with units and prices, and you are ready. Creating an order takes under 60 seconds: pick a delivery date, select quantities across all vendors simultaneously, add a note, and hit send. Each vendor gets a beautiful email with only their items and a single "Confirm This Order" button.

Vendors see the order, confirm it with one click, and the owner's dashboard updates in real time. The entire confirmation trail is stored immutably for audit purposes.

Built solo in 3 days for the H0 Hackathon.

---

## Why I Chose This Stack

This choice was not arbitrary. The data requirements of the two core systems are genuinely different, and they deserve different databases.

**Vercel v0** scaffolded the entire UI in hours. I described each page in plain English and v0 generated production-quality React components with Tailwind, proper TypeScript types, and accessible markup. What would have taken 3–4 days of layout work took an afternoon. I refined the design with a custom navy/amber token system, but the structural lift was already done.

**Aurora PostgreSQL** stores the relational core: businesses, users, vendors, products, and orders. This data has hard relationships that require ACID transactions — if an order is created, all its items must be created atomically or none of them should be. Foreign keys enforce referential integrity. Prisma ORM provides a type-safe query layer. Aurora's serverless v2 auto-scales, so I pay nothing at zero traffic and scale instantly during hackathon demos.

**DynamoDB** stores vendor confirmation events. These events are append-only, high-frequency key-value lookups (give me all events for order X), and never need joins. DynamoDB's single-table design with \`orderId\` as the partition key and a timestamp sort key is a perfect fit. It handles thousands of concurrent confirmation webhooks without breaking a sweat.

Different data. Different database. That is the real architectural lesson.

---

## Architecture

The system has five layers:

\`\`\`
┌──────────────────────────────────────────────────────────┐
│  CLIENT                                                  │
│  Restaurant Owner (Next.js App)  │  Vendor (Email Link) │
└─────────────────┬────────────────────────────┬───────────┘
                  │                            │
┌─────────────────▼────────────────────────────▼───────────┐
│  VERCEL EDGE (Next.js 16 App Router)                     │
│  SSR Pages · API Routes · NextAuth · Middleware          │
└──────────┬──────────────────────────────────┬────────────┘
           │                                  │
┌──────────▼──────────┐          ┌────────────▼────────────┐
│  AWS AURORA         │          │  AWS DYNAMODB           │
│  PostgreSQL         │          │  order_events table     │
│  (Prisma ORM)       │          │  PK: orderId            │
│                     │          │  SK: timestamp#eventId  │
│  businesses         │          │                         │
│  users              │          │  EVENT_TYPES:           │
│  vendors            │          │  ORDER_SENT             │
│  products           │          │  VENDOR_CONFIRMED       │
│  orders             │          │  VENDOR_REJECTED        │
│  order_items        │          │  ORDER_DELIVERED        │
│  subscriptions      │          │  NOTE_ADDED             │
└─────────────────────┘          └─────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│  EXTERNAL SERVICES                                       │
│  Resend (transactional email) · Stripe (subscriptions)  │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

## The Hardest Part

The vendor confirmation flow was the trickiest engineering challenge.

The constraint: vendors must be able to confirm an order from their email with zero friction — no login, no cookie, no app. But the confirmation endpoint must be unforgeable and vendor-specific.

The solution: when an order is created, the system generates a cryptographically random 32-byte token per vendor (using \`crypto.randomBytes\`), stores it against the order+vendor combination in Postgres, and embeds it in the confirmation URL: \`/confirm/[token]\`. The token is single-use — confirming it marks it as consumed in the database.

The confirmation page itself is a fully public Next.js route with no auth middleware. It reads the token from the URL, looks up the associated order and vendor in Postgres, and renders a mobile-optimised confirmation UI showing exactly what the vendor is being asked to confirm. One tap. Done.

The event is then written to DynamoDB (immutable audit trail) and the owner's dashboard updates via SWR polling. The whole flow works perfectly in Gmail on a 5-year-old Android phone with slow 4G.

---

## Live Demo + Code

- **Live Demo:** [orderroom.vercel.app](https://orderroom.vercel.app)
- **GitHub:** [github.com/your-handle/orderroom](https://github.com/your-handle/orderroom)

---

## What I Would Build Next

**WhatsApp Business API integration** — many of my target vendors are in markets where WhatsApp is the primary business communication tool. Sending the order as a WhatsApp message instead of (or in addition to) email would dramatically improve confirmation rates.

**AI-powered order suggestions** — after 30 days of order history, the system knows your patterns. Monday is always a big produce day. Friday needs extra fish. A lightweight ML model (even just moving averages) could pre-fill order quantities and flag anomalies ("you usually order 30kg of flour on Wednesdays, today you ordered 5kg — is that correct?").

---

*Built for #H0Hackathon by [Your Name]*

*#H0Hackathon #AWS #Vercel #NextJS #Aurora #DynamoDB #B2BSaaS*
`

// ─── Section headings for TOC ─────────────────────────────────────────────────

const TOC = [
  { id: "the-problem",       label: "The Problem" },
  { id: "the-solution",      label: "The Solution" },
  { id: "why-this-stack",    label: "Why This Stack" },
  { id: "architecture",      label: "Architecture" },
  { id: "the-hardest-part",  label: "The Hardest Part" },
  { id: "live-demo",         label: "Live Demo + Code" },
  { id: "whats-next",        label: "What I'd Build Next" },
]

// ─── Stack badge component ────────────────────────────────────────────────────

function Badge({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1E2F45] border border-[#1E3050]">
      <div className="w-8 h-8 rounded bg-[#F59E0B]/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#F59E0B]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#F7F5F0] leading-none">{label}</p>
        <p className="text-xs text-[#64748B] mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

// ─── Code block component ─────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-[#1E3050]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#162236] border-b border-[#1E3050]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#F7F5F0] transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 bg-[#0F1B2D] text-[#F7F5F0]/90 text-xs leading-relaxed font-mono">
        <code>{children}</code>
      </pre>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="pt-12 first:pt-0 scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-xs font-mono text-[#F59E0B] shrink-0">{number}</span>
        <h2 className="font-display text-2xl md:text-3xl text-[#F7F5F0] leading-tight text-pretty">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-[#94A3B8] leading-relaxed text-base">{children}</div>
    </section>
  )
}

// ─── Architecture layer card ──────────────────────────────────────────────────

function ArchLayer({
  label,
  color,
  items,
}: {
  label: string
  color: string
  items: string[]
}) {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-70">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs px-2.5 py-1 rounded-md bg-black/20 border border-white/10 text-white/80 font-mono"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Copy full markdown
  const copyMarkdown = () => {
    navigator.clipboard.writeText(MARKDOWN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Scrollspy
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0F1B2D] font-sans">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 border-b border-[#1E3050] bg-[#0F1B2D]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F7F5F0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            OrderRoom
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://dev.to"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#64748B] hover:text-[#F7F5F0] transition-colors"
            >
              Publish on dev.to
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-[#F59E0B] text-[#0F1B2D] font-semibold hover:bg-[#D97706] transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex gap-12 xl:gap-16">

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">

            {/* Hero */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-5">
                {["#aws", "#nextjs", "#vercel", "#webdev"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-[#F7F5F0] leading-tight text-pretty mb-5">
                How I Built a B2B Vendor Ordering Platform in 3 Days Using Vercel v0, Aurora PostgreSQL, and DynamoDB
              </h1>
              <p className="text-[#64748B] text-base leading-relaxed max-w-2xl">
                Restaurant owners manage 15 vendor WhatsApp chats every morning. I replaced that chaos
                with one daily order flow — built solo in 72 hours for the H0 Hackathon.
              </p>
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[#1E3050]">
                <div className="w-9 h-9 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#F59E0B]">O</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F7F5F0]">OrderRoom Team</p>
                  <p className="text-xs text-[#64748B]">Built for #H0Hackathon · June 2025 · 8 min read</p>
                </div>
              </div>
            </div>

            {/* Stack badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-12 p-5 rounded-xl border border-[#1E3050] bg-[#162236]">
              <Badge icon={Zap}       label="Vercel v0"          sub="UI generation"       />
              <Badge icon={Database}  label="Aurora PostgreSQL"  sub="Relational core"     />
              <Badge icon={Server}    label="DynamoDB"           sub="Event stream"        />
              <Badge icon={Mail}      label="Resend"             sub="Transactional email" />
              <Badge icon={CreditCard} label="Stripe"            sub="Subscriptions"       />
              <Badge icon={Globe}     label="Next.js 16"         sub="App Router"          />
            </div>

            <div className="space-y-0 divide-y divide-[#1E3050]">

              {/* 1. The Problem */}
              <Section id="the-problem" number="01" title="The Problem">
                <p>
                  Every morning at 6 AM, a restaurant owner pulls out their phone and fires off the
                  same 15 WhatsApp messages. "Hi, need 20kg onions today." "Can you do 5 boxes of
                  cherry tomatoes?" "Same as last Tuesday for the fish please."
                </p>
                <p>
                  Then they wait. And follow up. And wonder why half their vendors have not confirmed
                  by 9 AM when the kitchen needs to start prep. Orders get missed. Wrong quantities
                  arrive. There is no audit trail. If something goes wrong, nobody can prove what
                  was actually ordered.
                </p>
                <div className="p-4 rounded-lg border-l-2 border-[#F59E0B] bg-[#F59E0B]/5 my-5">
                  <p className="text-[#F7F5F0] text-sm font-medium">
                    Existing solutions like MarketMan or BlueCart require vendors to create accounts
                    and download apps. That is the adoption killer. The vendor who has been supplying
                    your restaurant for 12 years is not going to install new software. The friction
                    is fatal.
                  </p>
                </div>
              </Section>

              {/* 2. The Solution */}
              <Section id="the-solution" number="02" title="The Solution — OrderRoom">
                <p>
                  OrderRoom flips the model. The restaurant owner is the only person who needs an
                  account. Vendors confirm via a simple email link — zero signup, works on any
                  device, opens in any email client.
                </p>
                <p>
                  The owner onboards in under 5 minutes: add your vendors (name, email, category),
                  add their products with units and prices, and you are ready. Creating an order
                  takes under 60 seconds: pick a delivery date, select quantities across all vendors
                  simultaneously, add a note, and hit send.
                </p>
                <p>
                  Each vendor gets a beautiful email with only their items and a single
                  "Confirm This Order" button. They see the order, confirm it with one click, and
                  the owner&apos;s dashboard updates in real time. The entire confirmation trail is
                  stored immutably for audit purposes.
                </p>
              </Section>

              {/* 3. Why this stack */}
              <Section id="why-this-stack" number="03" title="Why I Chose This Stack">
                <p>
                  This choice was not arbitrary. The data requirements of the two core systems are
                  genuinely different, and they deserve different databases.
                </p>

                <div className="space-y-3 my-5">
                  <div className="p-4 rounded-lg bg-[#162236] border border-[#1E3050]">
                    <p className="text-sm font-semibold text-[#F59E0B] mb-1">Vercel v0</p>
                    <p className="text-sm text-[#94A3B8]">
                      Scaffolded the entire UI in hours. I described each page in plain English and
                      v0 generated production-quality React components with Tailwind, proper
                      TypeScript types, and accessible markup. What would have taken 3–4 days of
                      layout work took an afternoon.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#162236] border border-[#1E3050]">
                    <p className="text-sm font-semibold text-[#3B82F6] mb-1">Aurora PostgreSQL</p>
                    <p className="text-sm text-[#94A3B8]">
                      Stores the relational core: businesses, users, vendors, products, and orders.
                      This data has hard relationships that require ACID transactions — if an order
                      is created, all its items must be created atomically or none of them should be.
                      Aurora&apos;s serverless v2 auto-scales, so I pay nothing at zero traffic and
                      scale instantly during hackathon demos.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#162236] border border-[#1E3050]">
                    <p className="text-sm font-semibold text-[#10B981] mb-1">DynamoDB</p>
                    <p className="text-sm text-[#94A3B8]">
                      Stores vendor confirmation events. These events are append-only, high-frequency
                      key-value lookups — give me all events for order X — and never need joins.
                      DynamoDB&apos;s single-table design with <code className="text-[#F59E0B] text-xs">orderId</code> as
                      the partition key and a timestamp sort key is a perfect fit.
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-[#F7F5F0]">
                  Different data. Different database. That is the real architectural lesson.
                </p>
              </Section>

              {/* 4. Architecture */}
              <Section id="architecture" number="04" title="Architecture">
                <p>The system has five layers communicating in a clear hierarchy:</p>

                <div className="my-6 space-y-2">
                  <ArchLayer
                    label="Client"
                    color="bg-[#1E2F45]/60 border-[#1E3050]"
                    items={["Restaurant Owner App", "Vendor Email Link (public)"]}
                  />
                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-[#1E3050]" />
                  </div>
                  <ArchLayer
                    label="Vercel Edge — Next.js 16 App Router"
                    color="bg-[#F59E0B]/5 border-[#F59E0B]/20"
                    items={["SSR Pages", "API Routes", "NextAuth Sessions", "Middleware"]}
                  />
                  <div className="flex justify-center gap-16">
                    <div className="w-px h-4 bg-[#1E3050]" />
                    <div className="w-px h-4 bg-[#1E3050]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ArchLayer
                      label="AWS Aurora PostgreSQL"
                      color="bg-[#3B82F6]/5 border-[#3B82F6]/20"
                      items={["businesses", "users", "vendors", "products", "orders", "order_items", "subscriptions"]}
                    />
                    <ArchLayer
                      label="AWS DynamoDB"
                      color="bg-[#10B981]/5 border-[#10B981]/20"
                      items={["ORDER_SENT", "VENDOR_CONFIRMED", "VENDOR_REJECTED", "ORDER_DELIVERED", "NOTE_ADDED"]}
                    />
                  </div>
                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-[#1E3050]" />
                  </div>
                  <ArchLayer
                    label="External Services"
                    color="bg-[#8B5CF6]/5 border-[#8B5CF6]/20"
                    items={["Resend (email)", "Stripe (subscriptions)"]}
                  />
                </div>

                <p>
                  The full annotated diagram with data-flow arrows and environment variable
                  checklist lives at{" "}
                  <Link href="/architecture" className="text-[#F59E0B] hover:underline">
                    /architecture
                  </Link>{" "}
                  in the app.
                </p>
              </Section>

              {/* 5. The hardest part */}
              <Section id="the-hardest-part" number="05" title="The Hardest Part">
                <p>The vendor confirmation flow was the trickiest engineering challenge.</p>
                <p>
                  The constraint: vendors must be able to confirm an order from their email with
                  zero friction — no login, no cookie, no app. But the confirmation endpoint must
                  be unforgeable and vendor-specific.
                </p>

                <CodeBlock>{`// Generate a cryptographically random token per vendor per order
import crypto from "crypto"

const token = crypto.randomBytes(32).toString("hex")

// Store it in Postgres against the order+vendor pair
await prisma.confirmationToken.create({
  data: {
    token,
    orderId,
    vendorId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
})

// Embed it in the confirmation URL sent via Resend
const confirmUrl = \`\${process.env.NEXT_PUBLIC_APP_URL}/confirm/\${token}\``}</CodeBlock>

                <p>
                  The confirmation page is a fully public Next.js route with no auth middleware. It
                  reads the token, looks up the associated order and vendor, and renders a
                  mobile-optimised UI showing exactly what the vendor is confirming. One tap. The
                  event is written to DynamoDB as an immutable record, and the owner&apos;s
                  dashboard updates via SWR polling.
                </p>
                <p>
                  The whole flow works perfectly in Gmail on a 5-year-old Android phone with
                  slow 4G — which is exactly where your target vendor is reading email.
                </p>
              </Section>

              {/* 6. Live demo */}
              <Section id="live-demo" number="06" title="Live Demo + Code">
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  <a
                    href="https://orderroom.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#F59E0B] text-[#0F1B2D] hover:bg-[#D97706] transition-colors group"
                  >
                    <Globe className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Live Demo</p>
                      <p className="text-xs opacity-70">orderroom.vercel.app</p>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100" />
                  </a>
                  <a
                    href="https://github.com/your-handle/orderroom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#162236] border border-[#1E3050] text-[#F7F5F0] hover:border-[#F59E0B]/30 transition-colors group"
                  >
                    <Github className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">GitHub Repo</p>
                      <p className="text-xs text-[#64748B]">your-handle/orderroom</p>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-100" />
                  </a>
                </div>
              </Section>

              {/* 7. What's next */}
              <Section id="whats-next" number="07" title="What I'd Build Next">
                <div className="space-y-3 my-4">
                  <div className="flex gap-4 p-4 rounded-lg bg-[#162236] border border-[#1E3050]">
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/15 border border-[#25D366]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#25D366]">W</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F7F5F0] mb-1">WhatsApp Business API</p>
                      <p className="text-sm text-[#94A3B8]">
                        Many vendors in my target market — restaurants in the Gulf region — are in
                        markets where WhatsApp is the primary business communication tool. Sending
                        the order as a WhatsApp message instead of email would dramatically improve
                        confirmation rates and meet vendors where they already are.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-lg bg-[#162236] border border-[#1E3050]">
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F7F5F0] mb-1">AI-Powered Order Suggestions</p>
                      <p className="text-sm text-[#94A3B8]">
                        After 30 days of order history, the system knows your patterns. Monday is
                        always a big produce day. Friday needs extra fish. A lightweight model —
                        even just moving averages over DynamoDB event history — could pre-fill
                        quantities and flag anomalies before the order is sent.
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-[#1E3050] text-center">
              <p className="text-sm text-[#64748B]">
                Built for{" "}
                <span className="text-[#F59E0B] font-semibold">#H0Hackathon</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {["#H0Hackathon", "#AWS", "#Vercel", "#NextJS", "#Aurora", "#DynamoDB", "#B2BSaaS"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#1E2F45] text-[#64748B] border border-[#1E3050]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </main>

          {/* ── Sticky TOC ── */}
          <aside className="hidden lg:block w-52 xl:w-60 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
                On this page
              </p>
              <nav className="space-y-1">
                {TOC.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`flex items-center gap-2.5 text-sm py-1.5 px-2 rounded transition-colors ${
                      activeSection === id
                        ? "text-[#F59E0B] bg-[#F59E0B]/8"
                        : "text-[#64748B] hover:text-[#F7F5F0]"
                    }`}
                  >
                    {activeSection === id && (
                      <span className="w-1 h-1 rounded-full bg-[#F59E0B] shrink-0" />
                    )}
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 p-3 rounded-lg bg-[#162236] border border-[#1E3050]">
                <p className="text-xs font-semibold text-[#F7F5F0] mb-1">Publish this post</p>
                <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                  Copy the Markdown above and paste it into dev.to for bonus hackathon points.
                </p>
                <a
                  href="https://dev.to/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#F59E0B] hover:underline"
                >
                  Open dev.to editor
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#162236] border border-[#1E3050]">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3 text-[#64748B]" />
                  <p className="text-xs text-[#64748B]">Reading time</p>
                </div>
                <p className="text-sm font-semibold text-[#F7F5F0]">~8 minutes</p>
                <p className="text-xs text-[#64748B] mt-0.5">~1,450 words</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
