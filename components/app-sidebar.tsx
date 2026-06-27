"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  Settings,
  LogOut,
  Zap,
  ChevronDown,
  CreditCard,
  Network,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Vendors", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/orders/new", label: "New Order", icon: ShoppingCart },
]

const BOTTOM_ITEMS = [
  { href: "/billing",      label: "Billing",      icon: CreditCard },
  { href: "/blog",         label: "Blog Post",    icon: BookOpen   },
  { href: "/architecture", label: "Architecture", icon: Network    },
  { href: "/settings",     label: "Settings",     icon: Settings   },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col border-r border-[#1E3050] sidebar-gradient z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#1E3050]">
        <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-semibold text-[#F7F5F0] text-sm tracking-tight">OrderRoom</span>
          <div className="text-[10px] text-[#64748B] leading-none mt-0.5">Daily Vendor Orders</div>
        </div>
      </div>

      {/* Business selector */}
      <div className="px-4 py-3 border-b border-[#1E3050]">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-[#162236] hover:bg-[#1E2F45] transition-colors text-left">
          <div>
            <div className="text-xs font-medium text-[#F7F5F0] truncate max-w-[130px]">The Harbor Restaurant</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Pro Plan</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-3 mb-2">Menu</div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border-l-2 border-[#F59E0B] pl-[10px]"
                  : "text-[#94A3B8] hover:bg-[#1E2F45] hover:text-[#F7F5F0]",
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[#1E3050] space-y-1">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#94A3B8] hover:bg-[#1E2F45] hover:text-[#F7F5F0] transition-colors"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#94A3B8] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#EF4444] transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
