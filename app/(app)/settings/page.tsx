"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Save, Database, Mail, Bell, Shield } from "lucide-react"

const TABS = ["Business", "Notifications", "Integrations", "Security"] as const
type Tab = (typeof TABS)[number]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Business")
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Settings"
        subtitle="Manage your business account and integrations"
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        }
      />

      <div className="flex-1 p-6 fade-in max-w-3xl">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#162236] border border-[#1E3050] rounded-lg p-1 mb-6 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t ? "bg-[#1E2F45] text-[#F7F5F0]" : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Business" && (
          <div className="space-y-5">
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-[#F7F5F0]">Business Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Business Name</label>
                  <input
                    defaultValue="The Harbor Restaurant"
                    className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Business Type</label>
                  <select className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors appearance-none">
                    <option>Restaurant</option>
                    <option>Hotel</option>
                    <option>Catering</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Contact Email</label>
                  <input
                    defaultValue="alex@harborrestaurant.com"
                    type="email"
                    className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Phone</label>
                  <input
                    defaultValue="+1 555-0199"
                    className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Default Order Note</label>
                <textarea
                  defaultValue="Please deliver between 6–8am. Use side entrance on Maple Street."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#F7F5F0]">Plan</h3>
                  <p className="text-xs text-[#64748B] mt-1">You are on the <span className="text-[#F59E0B] font-medium">Pro Plan</span></p>
                </div>
                <button className="h-8 px-4 border border-[#1E3050] text-[#94A3B8] text-xs font-medium rounded-lg hover:bg-[#1E2F45] transition-colors">
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "Notifications" && (
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-[#64748B]" />
              <h3 className="text-sm font-semibold text-[#F7F5F0]">Notification Preferences</h3>
            </div>
            {[
              { label: "Vendor confirms an order", desc: "Get notified when a vendor clicks Confirm" },
              { label: "Order email bounces", desc: "Alert when delivery to vendor email fails" },
              { label: "Order not confirmed after 2h", desc: "Reminder for pending vendor confirmations" },
              { label: "Daily order summary", desc: "Morning summary of all pending orders" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#1E3050] last:border-0">
                <div>
                  <p className="text-sm text-[#F7F5F0]">{item.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#1E2F45] rounded-full peer peer-checked:bg-[#F59E0B] transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        )}

        {tab === "Integrations" && (
          <div className="space-y-4">
            {[
              {
                name: "Resend",
                desc: "Send vendor order emails with confirmation links",
                icon: Mail,
                connected: true,
                label: "Transactional Email",
              },
              {
                name: "AWS Aurora PostgreSQL",
                desc: "Primary relational database for orders, vendors, products",
                icon: Database,
                connected: false,
                label: "Database",
              },
              {
                name: "AWS DynamoDB",
                desc: "Real-time event log for order status changes",
                icon: Database,
                connected: false,
                label: "Event Store",
              },
            ].map((integration) => {
              const Icon = integration.icon
              return (
                <div key={integration.name} className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1E2F45] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#64748B]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#F7F5F0]">{integration.name}</p>
                      <span className="text-[10px] text-[#64748B] bg-[#1E2F45] px-2 py-0.5 rounded-full">{integration.label}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">{integration.desc}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      integration.connected
                        ? "bg-[rgba(16,185,129,0.12)] text-[#34D399]"
                        : "bg-[rgba(100,116,139,0.12)] text-[#64748B]"
                    }`}
                  >
                    {integration.connected ? "Connected" : "Not connected"}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {tab === "Security" && (
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#64748B]" />
              <h3 className="text-sm font-semibold text-[#F7F5F0]">Security Settings</h3>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">New Password</label>
              <input type="password" placeholder="Min. 8 characters" className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
