import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getVendorsWithProducts } from "@/lib/db"
import VendorsPageClient from "./page-client"

export default async function VendorsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    redirect("/login")
  }

  const vendors = await getVendorsWithProducts(session.user.businessId)

  return <VendorsPageClient initialVendors={vendors} />
}
