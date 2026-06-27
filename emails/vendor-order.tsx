/**
 * emails/vendor-order.tsx
 * React Email template for vendor order notification emails.
 * Rendered by Resend via lib/resend.ts → sendOrderEmail().
 *
 * Design: white bg, clean table, amber CTA, mobile-friendly, plain footer.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VendorOrderEmailProps {
  vendorName:   string
  businessName: string
  deliveryDate: string        // ISO date string e.g. "2026-06-30"
  items: {
    name:     string
    quantity: number
    unit:     string
  }[]
  notes?:       string
  confirmUrl:   string
  rejectUrl:    string
  businessEmail: string
}

// ---------------------------------------------------------------------------
// Styles — inline since most email clients strip <style> tags
// ---------------------------------------------------------------------------

const main: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const wrapper: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "32px 16px",
}

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
}

const headerBand: React.CSSProperties = {
  backgroundColor: "#0f1b2d",
  padding: "28px 32px",
}

const logoText: React.CSSProperties = {
  color: "#F59E0B",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 4px",
}

const headerSubtitle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "13px",
  margin: "0",
}

const body: React.CSSProperties = {
  padding: "32px",
}

const greeting: React.CSSProperties = {
  fontSize: "15px",
  color: "#374151",
  margin: "0 0 8px",
}

const businessLabel: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 4px",
}

const dateChip: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "600",
  padding: "4px 12px",
  borderRadius: "999px",
  marginBottom: "24px",
}

const divider: React.CSSProperties = {
  borderTop: "1px solid #e5e7eb",
  margin: "0 0 24px",
}

const tableHeaderRow: React.CSSProperties = {
  backgroundColor: "#f9fafb",
}

const thStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
}

const thRight: React.CSSProperties = { ...thStyle, textAlign: "right" }

const tdStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#111827",
  padding: "12px 12px",
  borderBottom: "1px solid #f3f4f6",
}

const tdRight: React.CSSProperties = { ...tdStyle, textAlign: "right", fontWeight: "600" }

const tdUnit: React.CSSProperties = { ...tdStyle, color: "#6b7280", textAlign: "right" }

const noteBox: React.CSSProperties = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "14px 16px",
  margin: "24px 0",
}

const noteLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#92400e",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 6px",
}

const noteText: React.CSSProperties = {
  fontSize: "14px",
  color: "#78350f",
  margin: "0",
  lineHeight: "1.5",
}

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "32px 0 24px",
}

const ctaButton: React.CSSProperties = {
  backgroundColor: "#F59E0B",
  color: "#000000",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "700",
  padding: "14px 40px",
  textDecoration: "none",
  display: "inline-block",
}

const issueText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center",
  margin: "0 0 24px",
}

const footer: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  borderTop: "1px solid #e5e7eb",
  padding: "20px 32px",
}

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
  lineHeight: "1.6",
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VendorOrderEmail({
  vendorName,
  businessName,
  deliveryDate,
  items,
  notes,
  confirmUrl,
  rejectUrl,
  businessEmail,
}: VendorOrderEmailProps) {
  const formattedDate = new Date(deliveryDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const previewText = `New order from ${businessName} — ${items.length} item${items.length !== 1 ? "s" : ""} for ${formattedDate}`

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <div style={wrapper}>
          <div style={card}>

            {/* ── Header band ── */}
            <div style={headerBand}>
              <Text style={logoText}>OrderRoom</Text>
              <Text style={headerSubtitle}>You have a new order request</Text>
            </div>

            {/* ── Body ── */}
            <div style={body}>
              <Text style={greeting}>Hi {vendorName},</Text>
              <Text style={businessLabel}>{businessName}</Text>
              <span style={dateChip}>Delivery: {formattedDate}</span>

              <Hr style={divider} />

              {/* Items table */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={tableHeaderRow}>
                    <th style={thStyle}>Product</th>
                    <th style={thRight}>Qty</th>
                    <th style={thRight}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdRight}>{item.quantity}</td>
                      <td style={tdUnit}>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Notes */}
              {notes && (
                <div style={noteBox}>
                  <Text style={noteLabel}>Note from buyer</Text>
                  <Text style={noteText}>{notes}</Text>
                </div>
              )}

              {/* CTA */}
              <div style={ctaSection}>
                <a href={confirmUrl} style={ctaButton}>
                  Confirm This Order
                </a>
              </div>

              <Text style={issueText}>
                Having issues with this order?{" "}
                <Link href={rejectUrl} style={{ color: "#6b7280", textDecoration: "underline" }}>
                  Click here to decline
                </Link>
              </Text>
            </div>

            {/* ── Footer ── */}
            <div style={footer}>
              <Text style={footerText}>
                This order was sent via OrderRoom. To stop receiving these emails,
                contact{" "}
                <Link href={`mailto:${businessEmail}`} style={{ color: "#6b7280" }}>
                  {businessEmail}
                </Link>
              </Text>
            </div>

          </div>
        </div>
      </Body>
    </Html>
  )
}

export default VendorOrderEmail
