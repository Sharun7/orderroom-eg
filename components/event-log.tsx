"use client"

import { useEffect, useState } from "react"
import type { OrderEvent, EventType } from "@/lib/dynamo"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const EVENT_CONFIG: Record<
  EventType,
  { label: string; color: string; dot: string; icon: string }
> = {
  ORDER_CREATED: {
    label: "Order Created",
    color: "text-[#94A3B8]",
    dot: "bg-[#94A3B8]",
    icon: "✦",
  },
  ORDER_SENT: {
    label: "Order Sent",
    color: "text-[#60A5FA]",
    dot: "bg-[#60A5FA]",
    icon: "→",
  },
  VENDOR_CONFIRMED: {
    label: "Vendor Confirmed",
    color: "text-[#34D399]",
    dot: "bg-[#34D399]",
    icon: "✓",
  },
  VENDOR_REJECTED: {
    label: "Vendor Rejected",
    color: "text-[#F87171]",
    dot: "bg-[#F87171]",
    icon: "✕",
  },
  ITEM_DELIVERED: {
    label: "Item Delivered",
    color: "text-[#A78BFA]",
    dot: "bg-[#A78BFA]",
    icon: "⬇",
  },
  REMINDER_SENT: {
    label: "Reminder Sent",
    color: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    icon: "↺",
  },
}

const ACTOR_LABELS: Record<string, string> = {
  system: "System",
  vendor: "Vendor",
  owner: "Owner",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function parseMetadata(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function MetadataChips({ raw }: { raw: string }) {
  const meta = parseMetadata(raw)
  const entries = Object.entries(meta).filter(([, v]) => v !== "" && v !== null)
  if (!entries.length) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8]"
        >
          <span className="text-[#475569]">{k}</span>
          <span className="text-[#CBD5E1]">{String(v)}</span>
        </span>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface EventLogProps {
  orderId: string
  /** Poll interval in ms. Defaults to 15 000. Pass 0 to disable. */
  pollInterval?: number
}

export function EventLog({ orderId, pollInterval = 15000 }: EventLogProps) {
  const [events, setEvents] = useState<OrderEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  async function fetchEvents() {
    try {
      const res = await fetch(`/api/orders/${orderId}/events`)
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setEvents(data.events ?? [])
      setLastRefresh(new Date())
      setError(null)
    } catch (e) {
      setError("Could not load event log")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    if (!pollInterval) return
    const id = setInterval(fetchEvents, pollInterval)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, pollInterval])

  return (
    <section
      aria-label="Event log"
      className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#475569]">
            DynamoDB
          </span>
          <span className="h-3.5 w-px bg-[rgba(255,255,255,0.08)]" />
          <h3 className="text-sm font-medium text-[#CBD5E1]">Event Log</h3>
          {events.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(245,158,11,0.15)] text-[#F59E0B] text-[10px] font-semibold">
              {events.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-[11px] text-[#334155]">
              {timeAgo(lastRefresh.toISOString())}
            </span>
          )}
          <button
            onClick={fetchEvents}
            className="text-[11px] text-[#475569] hover:text-[#94A3B8] transition-colors"
            aria-label="Refresh event log"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-[#475569] text-sm">
            <span className="w-3 h-3 rounded-full border border-[#475569] border-t-transparent animate-spin" />
            Loading events…
          </div>
        ) : error ? (
          <p className="py-6 text-sm text-[#F87171]">{error}</p>
        ) : events.length === 0 ? (
          <p className="py-6 text-sm text-[#334155] text-center">
            No events recorded yet.
          </p>
        ) : (
          <ol className="relative">
            {/* Vertical timeline line */}
            <span
              className="absolute left-[5px] top-2 bottom-2 w-px bg-[rgba(255,255,255,0.06)]"
              aria-hidden="true"
            />

            {events.map((event, idx) => {
              const cfg = EVENT_CONFIG[event.eventType] ?? {
                label: event.eventType,
                color: "text-[#94A3B8]",
                dot: "bg-[#475569]",
                icon: "·",
              }
              return (
                <li key={event.eventId} className="relative pl-6 pb-5 last:pb-0">
                  {/* Dot */}
                  <span
                    className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#0F1B2D] ${cfg.dot}`}
                    aria-hidden="true"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[11px] text-[#475569]">
                          via {ACTOR_LABELS[event.actorType] ?? event.actorType}
                        </span>
                      </div>
                      {event.orderItemId && (
                        <p className="text-[11px] text-[#334155] mt-0.5 font-mono truncate">
                          item: {event.orderItemId}
                        </p>
                      )}
                      <MetadataChips raw={event.metadata} />
                    </div>
                    <time
                      dateTime={event.timestamp}
                      title={formatTime(event.timestamp)}
                      className="shrink-0 text-[11px] text-[#334155] whitespace-nowrap pt-0.5"
                    >
                      {timeAgo(event.timestamp)}
                    </time>
                  </div>

                  {/* Connector between items */}
                  {idx < events.length - 1 && (
                    <span
                      className="absolute left-[5px] bottom-0 h-[1px] w-0"
                      aria-hidden="true"
                    />
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {/* Footer badge */}
      <div className="px-5 py-3 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-[#334155]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          Powered by AWS DynamoDB — append-only audit trail
        </span>
      </div>
    </section>
  )
}
