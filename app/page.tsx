"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Zap, CheckCircle, MessageSquare, Clock, AlertTriangle, Mail, Shield } from "lucide-react"

function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1B2D]/80 backdrop-blur-md border-b border-[#1E3050]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-sm tracking-tight">OrderRoom</span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          {[["Problem", "#problem"], ["Solution", "#solution"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"]].map(([label, href]) => (
            <a key={label} href={href} className="text-sm text-[#94A3B8] hover:text-[#F7F5F0] transition-colors">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#94A3B8] hover:text-[#F7F5F0] transition-colors">Sign in</Link>
          <Link href="/register" className="h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x: x * 10, y: y * 10 })
  }

  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden">
      {/* Animated background orbs */}
      <div className="animated-orbs absolute inset-0">
        <div className="orb orb-amber" style={{ width: "400px", height: "400px", top: "-100px", left: "-100px" }} />
        <div className="orb orb-blue" style={{ width: "500px", height: "500px", top: "200px", right: "-150px" }} />
        <div className="orb orb-purple" style={{ width: "350px", height: "350px", bottom: "-100px", left: "300px" }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-xs font-medium text-[#F59E0B]">Built for restaurants, hotels &amp; catering</span>
        </div>
        <h1 className="font-display text-6xl md:text-7xl text-[#F7F5F0] leading-tight text-balance mb-6 font-bold">
          Your morning vendor orders.{" "}
          <span className="gradient-text-animated">Done in 60 seconds.</span>
        </h1>
        <p className="text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed text-pretty mb-10">
          Stop juggling 20 WhatsApp chats every morning. OrderRoom lets you place all your daily supply orders in one form — vendors confirm by clicking a link in their email. No app, no signup, no chaos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <Link href="/register" className="h-12 px-8 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-base rounded-xl flex items-center gap-2 transition-colors">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="h-12 px-8 border border-[#1E3050] text-[#94A3B8] hover:text-[#F7F5F0] hover:border-[#2A4060] text-base rounded-xl flex items-center gap-2 transition-colors">
            View Demo
          </Link>
        </div>
        <p className="text-xs text-[#374151]">No credit card required. Free for up to 1 vendor.</p>

        {/* Dashboard preview with 3D effect */}
        <div className="mt-16" onMouseMove={handleMouseMove}>
          <div 
            className="bg-[#0D1825] border border-[#1E3050] rounded-2xl overflow-hidden shadow-2xl text-left float-3d" 
            style={{
              transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E3050]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[rgba(239,68,68,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-[rgba(245,158,11,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-[rgba(16,185,129,0.5)]" />
              </div>
              <div className="flex-1 mx-4 h-5 bg-[#162236] rounded-md flex items-center px-3">
                <span className="text-[10px] text-[#374151]">orderroom.io/dashboard</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-44 border-r border-[#1E3050] p-4 hidden sm:block">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-md bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-[#0F1B2D]" />
                  </div>
                  <span className="text-xs font-semibold text-[#F7F5F0]">OrderRoom</span>
                </div>
                {["Dashboard", "Today's Order", "Vendors", "History", "Settings"].map((item, i) => (
                  <div key={item} className={`px-3 py-2 rounded-md text-[11px] font-medium mb-1 ${i === 0 ? "bg-[rgba(245,158,11,0.12)] text-[#F59E0B]" : "text-[#64748B]"}`}>{item}</div>
                ))}
              </div>
              <div className="flex-1 p-5 min-w-0">
                <p className="text-[11px] text-[#64748B] mb-4 font-medium">Good morning! Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[{ l: "Vendors", v: "6", c: "text-[#60A5FA]" }, { l: "Sent", v: "6", c: "text-[#F59E0B]" }, { l: "Confirmed", v: "4", c: "text-[#34D399]" }, { l: "Pending", v: "2", c: "text-[#94A3B8]" }].map((s) => (
                    <div key={s.l} className="bg-[#162236] border border-[#1E3050] rounded-lg p-3">
                      <div className={`text-base font-bold ${s.c}`}>{s.v}</div>
                      <div className="text-[9px] text-[#64748B]">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#162236] border border-[#1E3050] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 px-3 py-2 border-b border-[#1E3050]">
                    {["Vendor", "Status", "Items", ""].map((h) => (
                      <div key={h} className="text-[9px] font-medium text-[#374151] uppercase tracking-wider">{h}</div>
                    ))}
                  </div>
                  {[
                    { vendor: "Fresh Farm Produce", status: "Confirmed", items: "4 items", c: "text-[#34D399]" },
                    { vendor: "Prime Cuts Meats", status: "Sent", items: "3 items", c: "text-[#60A5FA]" },
                    { vendor: "Alpine Dairy Co.", status: "Confirmed", items: "2 items", c: "text-[#34D399]" },
                    { vendor: "ThermoStar Beverages", status: "Pending", items: "2 items", c: "text-[#94A3B8]" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-4 px-3 py-2.5 border-b border-[#1E3050] last:border-0 items-center">
                      <div className="text-[10px] font-medium text-[#F7F5F0] truncate pr-2">{row.vendor}</div>
                      <div className={`text-[10px] font-medium ${row.c}`}>{row.status}</div>
                      <div className="text-[10px] text-[#64748B]">{row.items}</div>
                      <div className="text-[10px] text-[#F59E0B] cursor-pointer">View</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const cards = [
    {
      icon: MessageSquare,
      iconColor: "text-[#F87171]",
      iconBg: "bg-[rgba(239,68,68,0.1)]",
      accent: "bg-[rgba(239,68,68,0.25)]",
      title: "20 WhatsApp conversations",
      desc: "You ping every vendor individually. Messages get buried, read receipts do not mean confirmations, and your phone never stops buzzing until noon.",
    },
    {
      icon: AlertTriangle,
      iconColor: "text-[#FCD34D]",
      iconBg: "bg-[rgba(245,158,11,0.1)]",
      accent: "bg-[rgba(245,158,11,0.25)]",
      title: "Orders get missed or wrong",
      desc: "A vendor misreads a voice message. Someone orders the wrong quantity. Your head chef finds out at 11am when the delivery is already wrong.",
    },
    {
      icon: Clock,
      iconColor: "text-[#94A3B8]",
      iconBg: "bg-[rgba(100,116,139,0.1)]",
      accent: "bg-[rgba(100,116,139,0.25)]",
      title: "No confirmation trail",
      desc: "Did they confirm? Did you already send that? No record, no audit log. When something goes wrong, there is no proof of what was agreed.",
    },
  ]
  return (
    <section id="problem" className="py-20 px-6 border-t border-[#1E3050]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-widest mb-3">The old way</p>
          <h2 className="font-display text-3xl md:text-4xl text-[#F7F5F0] text-balance">Every morning is the same chaos.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="glass rounded-xl p-6 relative overflow-hidden group hover:border-[#2A4060] transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute top-0 left-0 right-0 h-px ${card.accent}`} />
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-[#F7F5F0] mb-2">{card.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{card.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  const cards = [
    {
      icon: Zap,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[rgba(245,158,11,0.12)]",
      accent: "bg-[rgba(245,158,11,0.3)]",
      title: "One form, all vendors",
      desc: "Place your entire day's supply order across all vendors in one form. Pre-filled quantities, vendor groupings, and a single submit button.",
    },
    {
      icon: Mail,
      iconColor: "text-[#60A5FA]",
      iconBg: "bg-[rgba(59,130,246,0.12)]",
      accent: "bg-[rgba(59,130,246,0.3)]",
      title: "Vendors confirm by email",
      desc: "Each vendor gets a tailored email with their items and a one-click confirmation link. No app, no account, no friction — it just works.",
    },
    {
      icon: Shield,
      iconColor: "text-[#34D399]",
      iconBg: "bg-[rgba(16,185,129,0.12)]",
      accent: "bg-[rgba(16,185,129,0.3)]",
      title: "Full audit trail",
      desc: "Every send, confirm, and rejection is logged with a timestamp in DynamoDB. You always know the exact state of every order, in real time.",
    },
  ]
  return (
    <section id="solution" className="py-20 px-6 bg-[#0D1825]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#F59E0B] uppercase tracking-widest mb-3">The OrderRoom way</p>
          <h2 className="font-display text-3xl md:text-4xl text-[#F7F5F0] text-balance">One form. Every vendor. 60 seconds.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="glass rounded-xl p-6 relative overflow-hidden group hover:border-[#2A4060] transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute top-0 left-0 right-0 h-px ${card.accent}`} />
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-[#F7F5F0] mb-2">{card.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{card.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Add your vendors once", desc: "Add each vendor's name, email, and their usual products with default quantities. Takes 5 minutes.", detail: "Name, email, category, products, default quantities" },
    { num: "02", title: "Place today's order in one form", desc: "Every morning, open OrderRoom. Adjust quantities if needed and hit Send. All vendors get their orders simultaneously.", detail: "Pre-filled form — only change what differs today" },
    { num: "03", title: "Vendors confirm by link", desc: "Each vendor gets an email listing their items. One click on Confirm and you are notified instantly. No app required.", detail: "Mobile-optimised confirmation page — works on any device" },
  ]
  return (
    <section id="how-it-works" className="py-20 px-6 border-t border-[#1E3050]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-widest mb-3">Simple by design</p>
          <h2 className="font-display text-3xl md:text-4xl text-[#F7F5F0] text-balance">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-[#1E3050]" />
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#162236] border border-[#1E3050] flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-[#F59E0B] font-mono">{step.num}</span>
              </div>
              <h3 className="text-base font-semibold text-[#F7F5F0] mb-3">{step.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">{step.desc}</p>
              <div className="px-3 py-2 bg-[#162236] border border-[#1E3050] rounded-lg">
                <p className="text-xs text-[#94A3B8]">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [annual, setAnnual] = useState(false)
  const plans = [
    { name: "Free", price: 0, desc: "Try it out with one vendor.", highlight: false, features: ["1 vendor", "Unlimited orders", "Email confirmation links", "DynamoDB event log", "Community support"], cta: "Start free" },
    { name: "Starter", price: annual ? 24 : 29, desc: "For small restaurants and cafes.", highlight: true, features: ["Up to 10 vendors", "Unlimited orders", "Email confirmation links", "Full event audit log", "Reminder emails", "Email support"], cta: "Start free trial" },
    { name: "Pro", price: annual ? 66 : 79, desc: "For hotels and catering operations.", highlight: false, features: ["Unlimited vendors", "Unlimited orders", "Team member access", "Custom email branding", "Priority support", "API access"], cta: "Start free trial" },
  ]
  return (
    <section id="pricing" className="py-20 px-6 bg-[#0D1825] border-t border-[#1E3050]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-widest mb-3">Simple pricing</p>
          <h2 className="font-display text-3xl md:text-4xl text-[#F7F5F0] text-balance mb-6">Start free, scale when ready.</h2>
          <div className="inline-flex items-center gap-3 bg-[#162236] border border-[#1E3050] rounded-full px-4 py-2">
            <span className={`text-xs font-medium ${!annual ? "text-[#F7F5F0]" : "text-[#64748B]"}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`relative w-10 h-5 rounded-full transition-colors ${annual ? "bg-[#F59E0B]" : "bg-[#1E2F45]"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className={`text-xs font-medium ${annual ? "text-[#F7F5F0]" : "text-[#64748B]"}`}>Annual</span>
            {annual && <span className="text-[10px] font-medium text-[#F59E0B] bg-[rgba(245,158,11,0.1)] px-2 py-0.5 rounded-full">Save 17%</span>}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-xl p-6 flex flex-col relative overflow-hidden ${plan.highlight ? "bg-[#162236] border-2 border-[#F59E0B]" : "bg-[#162236] border border-[#1E3050]"}`}>
              {plan.highlight && <div className="absolute top-0 left-0 right-0 h-px bg-[#F59E0B]" />}
              {plan.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-semibold text-[#0F1B2D] bg-[#F59E0B] px-2.5 py-1 rounded-full">Most popular</span>
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-[#F7F5F0]">{plan.name}</h3>
                <p className="text-xs text-[#64748B] mt-1">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[#F7F5F0]">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                {plan.price > 0 && <span className="text-sm text-[#64748B]">/ month</span>}
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#34D399] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#94A3B8]">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${plan.highlight ? "bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D]" : "border border-[#1E3050] text-[#94A3B8] hover:bg-[#1E2F45] hover:text-[#F7F5F0]"}`}>
                {plan.cta} {plan.highlight && <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-[#1E3050] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-[#0F1B2D]" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">Daily vendor ordering for restaurants, hotels, and catering businesses. Replace the WhatsApp chaos with one clean workflow.</p>
          </div>
          <div className="grid grid-cols-3 gap-10">
            {[
              { heading: "Product", links: ["Dashboard", "Vendors", "Order History", "Confirmation Links"] },
              { heading: "Company", links: ["About", "Blog", "Changelog", "Status"] },
              { heading: "Legal", links: ["Privacy", "Terms", "Security"] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold text-[#F7F5F0] mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#1E3050] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#374151]">&copy; {new Date().getFullYear()} OrderRoom. All rights reserved.</p>
          <p className="text-xs text-[#374151]">Built on <span className="text-[#64748B]">AWS Aurora PostgreSQL</span> + <span className="text-[#64748B]">AWS DynamoDB</span> + <span className="text-[#64748B]">Vercel</span></p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F1B2D]">
      <LandingNav />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <Pricing />
      <LandingFooter />
    </div>
  )
}
