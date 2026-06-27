import { getOrderItemByToken } from "@/lib/db"
import ConfirmPageClient from "./page-client"

export default async function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  // Look up the order item by confirm token
  const orderItem = await getOrderItemByToken(token)

  if (!orderItem) {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-semibold text-[#F7F5F0] mb-2">Link Expired</h1>
          <p className="text-sm text-[#64748B]">This confirmation link is no longer valid.</p>
        </div>
      </div>
    )
  }

  return (
    <ConfirmPageClient
      orderItemId={orderItem.id}
      token={token}
      vendorName={orderItem.vendor.name}
      businessName={orderItem.order.notes || "Business"}
      items={[
        {
          id: orderItem.product.id,
          name: orderItem.product.name,
          quantity: orderItem.quantity,
          unit: orderItem.unit,
        },
      ]}
      deliveryDate={orderItem.order.date.toISOString().split("T")[0]}
    />
  )
}
