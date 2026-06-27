"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Save, Check, Building2, Bell, Database, Shield, ChevronRight, Mail, Zap, Eye, EyeOff } from "lucide-react"

const TABS = [
  { key: "business",      label: "Business",      icon: Building2 },
  { key: "notifications", label: "Notifications", icon: Bell      },
  { key: "integrations",  label: "Integrations",  icon: Database  },
  { key: "security",      label: "Security",      icon: Shield    },
] as const
type TabKey = (typeof TABS)[number]["key"]

const INPUT = "w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[rgba(245,158,11,0.2)] transition-colors"

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-[#374151] mt-1">{hint}</p>}
    </div>
  )
}

function Toggle({
  checked, onChange, label, desc,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-[#1E3050] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#F7F5F0]">{label}</p>
        {desc && <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${checked ? "bg-[#F59E0B]" : "bg-[#1E2F45]"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab]     = useState<TabKey>("business")
  const [saved, setSaved] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Business state
  const [businessName, setBusinessName] = useState("The Harbor Restaurant")
  const [businessType, setBusinessType] = useState("Restaurant")
  const [email, setEmail]               = useState("alex@harborrestaurant.com")
  const [phone, setPhone]               = useState("+1 555-0199")
  const [timezone, setTimezone]         = useState("America/New_York")
  const [orderNote, setOrderNote]       = useState("Please deliver between 6–8am. Use the side entrance on Bay Street.")

  // Notification state
  const [notifConfirm,  setNotifConfirm]  = useState(true)
  const [notifDecline,  setNotifDecline]  = useState(true)
  const [notifReminder, setNotifReminder] = useState(false)
  const [notifDigest,   setNotifDigest]   = useState(true)

  async function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Settings"
        subtitle="Manage your business account and preferences"
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
          >
            {saved ? (
              <><Check className="w-3.5 h-3.5" /> Saved!</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Save Changes</>
            )}
          </button>
        }
      />

      <div className="flex-1 p-6 fade-in">
        <div className="flex gap-6 max-w-4xl">
          {/* Sidebar nav */}
          <nav className="w-44 flex-shrink-0 space-y-0.5">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  tab === key
                    ? "bg-[rgba(245,158,11,0.1)] text-[#F59E0B]"
                    : "text-[#64748B] hover:text-[#94A3B8] hover:bg-[#162236]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {tab === key && <ChevronRight className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </nav>

          {/* Panel */}
          <div className="flex-1 space-y-5">

            {/* ── Business ── */}
            {tab === "business" && (
              <>
                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-[#F7F5F0]">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Business Name">
                      <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={INPUT} />
                    </Field>
                    <Field label="Business Type">
                      <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={INPUT + " appearance-none"}>
                        {["Restaurant", "Hotel", "Catering", "Bakery", "Other"].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Contact Email">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
                    </Field>
                    <Field label="Phone">
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} />
                    </Field>
                    <Field label="Timezone">
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={INPUT + " appearance-none"}>
                        {[
                          "America/New_York", "America/Chicago", "America/Denver",
                          "America/Los_Angeles", "Europe/London", "Europe/Paris",
                          "Asia/Dubai", "Asia/Singapore",
                        ].map((tz) => <option key={tz}>{tz}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-[#F7F5F0]">Default Order Preferences</h3>
                  <Field label="Default Note to Vendors" hint="Included in every order email unless overridden per order.">
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
                    />
                  </Field>
                </div>

                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#F7F5F0]">Starter Plan</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Up to 10 vendors · Unlimited orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#F59E0B]">$29 / mo</p>
                      <p className="text-xs text-[#64748B]">Renews July 26, 2026</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#1E3050] flex gap-2">
                    <button className="h-8 px-4 border border-[#1E3050] text-[#64748B] text-xs rounded-lg hover:bg-[#1E2F45] hover:text-[#94A3B8] transition-colors">
                      Upgrade to Pro
                    </button>
                    <button className="h-8 px-4 text-[#374151] text-xs hover:text-[#64748B] transition-colors">
                      Manage billing
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Notifications ── */}
            {tab === "notifications" && (
              <>
                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#F7F5F0] mb-1">Email Notifications</h3>
                  <p className="text-xs text-[#64748B] mb-4">
                    Sent to <span className="text-[#94A3B8]">{email}</span>
                  </p>
                  <Toggle checked={notifConfirm} onChange={setNotifConfirm} label="Vendor confirmed" desc="Get notified the moment a vendor clicks Confirm on their email link." />
                  <Toggle checked={notifDecline} onChange={setNotifDecline} label="Vendor declined" desc="Get notified immediately if a vendor declines or cannot fulfill an order." />
                  <Toggle checked={notifDigest}  onChange={setNotifDigest}  label="Daily summary digest" desc="Morning summary of all pending confirmations and delivered orders." />
                </div>

                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Reminders</h3>
                  <Toggle
                    checked={notifReminder}
                    onChange={setNotifReminder}
                    label="Auto-send reminder emails"
                    desc="If a vendor hasn't confirmed after 2 hours, automatically re-send a reminder. Logged as REMINDER_SENT in DynamoDB."
                  />
                  {notifReminder && (
                    <div className="mt-4 pt-4 border-t border-[#1E3050]">
                      <p className="text-xs text-[#64748B] mb-2">Reminder delay</p>
                      <div className="flex items-center gap-2">
                        {["1h", "2h", "4h", "6h"].map((d) => (
                          <button key={d} className="h-8 px-3 text-xs font-medium rounded-lg border border-[#1E3050] text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors first:border-[#F59E0B] first:text-[#F59E0B] first:bg-[rgba(245,158,11,0.08)]">
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Integrations ── */}
            {tab === "integrations" && (
              <div className="space-y-4">
                {([
                  {
                    icon: Mail,     iconColor: "text-[#60A5FA]", iconBg: "bg-[rgba(59,130,246,0.12)]",
                    name: "Resend", tag: "Email",
                    desc: "Transactional email for vendor confirmation links and notifications.",
                    connected: true, detail: "Sending as orders@harborrestaurant.com",
                  },
                  {
                    icon: Database, iconColor: "text-[#F59E0B]", iconBg: "bg-[rgba(245,158,11,0.12)]",
                    name: "AWS Aurora PostgreSQL", tag: "Database",
                    desc: "Primary relational database — business, vendor, product, and order records.",
                    connected: true, detail: "aurora-cluster.us-east-1.rds.amazonaws.com",
                  },
                  {
                    icon: Zap,      iconColor: "text-[#A78BFA]", iconBg: "bg-[rgba(139,92,246,0.12)]",
                    name: "AWS DynamoDB", tag: "Event Store",
                    desc: "Event log table — ORDER_SENT, VENDOR_CONFIRMED, VENDOR_REJECTED, REMINDER_SENT.",
                    connected: true, detail: "Table: order_events · Region: us-east-1",
                  },
                ] as const).map(({ icon: Icon, ...item }) => (
                  <div key={item.name} className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-[#F7F5F0]">{item.name}</p>
                        <span className="text-[10px] text-[#64748B] bg-[#1E2F45] px-2 py-0.5 rounded-full">{item.tag}</span>
                        {item.connected && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-[rgba(16,185,129,0.1)] text-[#34D399] border-[rgba(16,185,129,0.2)]">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed mb-1">{item.desc}</p>
                      <p className="text-[10px] font-mono text-[#374151]">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Security ── */}
            {tab === "security" && (
              <div className="space-y-5">
                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-[#F7F5F0]">Change Password</h3>
                  <Field label="Current Password">
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        placeholder="Enter current password"
                        className={INPUT + " pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="New Password">
                    <input type="password" placeholder="Min. 8 characters" className={INPUT} />
                  </Field>
                  <Field label="Confirm New Password">
                    <input type="password" placeholder="Repeat new password" className={INPUT} />
                  </Field>
                  <button className="h-9 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg transition-colors">
                    Update Password
                  </button>
                </div>

                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Active Sessions</h3>
                  {[
                    { device: "Chrome on macOS",  loc: "New York, US", time: "Active now",  current: true  },
                    { device: "Safari on iPhone", loc: "New York, US", time: "2 hours ago", current: false },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center justify-between py-3.5 border-b border-[#1E3050] last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#F7F5F0]">{s.device}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{s.loc} · {s.time}</p>
                      </div>
                      {s.current
                        ? <span className="text-[10px] font-medium text-[#34D399] bg-[rgba(16,185,129,0.1)] px-2 py-0.5 rounded-full">Current</span>
                        : <button className="text-xs text-[#64748B] hover:text-[#EF4444] transition-colors">Revoke</button>}
                    </div>
                  ))}
                </div>

                <div className="bg-[rgba(239,68,68,0.04)] border border-[rgba(239,68,68,0.15)] rounded-xl p-5">
                  <p className="text-sm font-semibold text-[#F7F5F0] mb-1">Danger Zone</p>
                  <p className="text-xs text-[#64748B] mb-4">These actions are permanent and cannot be undone.</p>
                  <button className="h-8 px-4 border border-[rgba(239,68,68,0.3)] text-[#F87171] text-xs rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
