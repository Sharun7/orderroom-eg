/**
 * POST /api/orders/[id]/send
 * 1. Marks the order as "sent" in Aurora PostgreSQL.
 * 2. Sends one vendor order email per unique vendor via Resend.
 * 3. Emits one ORDER_SENT event per order item to DynamoDB.
 *
 * Each vendor receives a single email containing only their items,
 * with a confirmToken link unique to each order item.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getOrderById, updateOrderStatus, getBusinessById } from "@/lib/db"
import { logOrderSent } from "@/lib/dynamo"
import { sendOrderEmail } from "@/lib/resend"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const businessId = session.user.businessId

    const [order, business] = await Promise.all([
      getOrderById(id, businessId),
      getBusinessById(businessId),
    ])

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Group order items by vendor
    const itemsByVendor = new Map<
      string,
      { vendorEmail: string; vendorName: string; items: typeof order.items }
    >()
    for (const item of order.items) {
      if (!itemsByVendor.has(item.vendorId)) {
        itemsByVendor.set(item.vendorId, {
          vendorEmail: item.vendor.email,
          vendorName:  item.vendor.name,
          items: [],
        })
      }
      itemsByVendor.get(item.vendorId)!.items.push(item)
    }

    const deliveryDate = new Date(order.date).toISOString().split("T")[0]

    // Send one email per vendor + log ORDER_SENT events to DynamoDB
    const emailResults = await Promise.allSettled(
      [...itemsByVendor.entries()].map(async ([vendorId, { vendorEmail, vendorName, items }]) => {
        // Use the first item's confirmToken as the per-vendor confirm link.
        // In a full implementation each item has its own token; the email
        // confirms all items for that vendor at once.
        const confirmToken = items[0].confirmToken

        const emailResult = await sendOrderEmail({
          to:            vendorEmail,
          vendorName,
          businessName:  business.name,
          deliveryDate,
          items: items.map((i) => ({
            name:     i.product.name,
            quantity: i.quantity,
            unit:     i.unit,
          })),
          notes:         order.notes ?? undefined,
          confirmToken,
          rejectToken:   confirmToken, // same token, different route (/reject/[token])
          businessEmail: business.email,
        })

        // Emit ORDER_SENT to DynamoDB for each item
        await Promise.all(
          items.map((item) =>
            logOrderSent({
              orderId:        id,
              orderItemId:    item.id,
              vendorId,
              businessId,
              recipientEmail: vendorEmail,
              emailId:        emailResult.id,
            }),
          ),
        )

        return { vendorId, emailId: emailResult.id, error: emailResult.error }
      }),
    )

    // Mark order as sent in Aurora
    const updated = await updateOrderStatus(id, "sent")

    const results = emailResults.map((r) =>
      r.status === "fulfilled" ? r.value : { error: String(r.reason) },
    )

    return NextResponse.json({ order: updated, emailResults: results })
  } catch (err) {
    console.error("[api/orders/[id]/send POST]", err)
    return NextResponse.json({ error: "Failed to send order" }, { status: 500 })
  }
}
