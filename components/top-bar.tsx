"use client"

import { Bell, Search } from "lucide-react"

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="h-16 border-b border-[#1E3050] bg-[#0F1B2D] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="font-semibold text-[#F7F5F0] text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <button className="w-8 h-8 rounded-md bg-[#162236] border border-[#1E3050] flex items-center justify-center hover:bg-[#1E2F45] transition-colors">
          <Search className="w-3.5 h-3.5 text-[#64748B]" />
        </button>
        <button className="w-8 h-8 rounded-md bg-[#162236] border border-[#1E3050] flex items-center justify-center hover:bg-[#1E2F45] transition-colors relative">
          <Bell className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0F1B2D] text-xs font-bold">
          AR
        </div>
      </div>
    </header>
  )
}
