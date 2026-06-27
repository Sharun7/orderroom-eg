import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db-aurora'

/**
 * GET /api/db/orders
 * Fetch all orders for a business
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    // Query orders from Aurora PostgreSQL
    const result = await query(
      `SELECT 
        o.order_id, o.status, o.order_date, o.delivery_date, o.notes,
        o.created_at, o.updated_at,
        COUNT(oi.id) as item_count
      FROM "order" o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.business_id = $1
      GROUP BY o.id, o.order_id, o.status, o.order_date, o.delivery_date, o.notes, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
      LIMIT 100`,
      [businessId]
    )

    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error('[API] Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/db/orders
 * Create a new order
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, userId, notes, orderDate } = body

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    // Insert new order
    const result = await query(
      `INSERT INTO "order" (order_id, business_id, user_id, notes, order_date, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        `ORD-${Date.now()}`,
        businessId,
        userId || null,
        notes || null,
        orderDate || new Date(),
        'pending'
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[API] Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
