// DynamoDB client setup for real-time event logs
// In production, use process.env.AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
// import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

// const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? "us-east-1" })
// export const docClient = DynamoDBDocumentClient.from(client)

// DynamoDB table: orderroom_events
// PK: businessId#orderId  SK: timestamp#eventType
// Attributes: eventType, status, metadata, ttl

export interface OrderEvent {
  pk: string // businessId#orderId
  sk: string // ISO timestamp#eventType
  businessId: string
  orderId: string
  vendorId: string
  eventType: "order_created" | "order_sent" | "vendor_confirmed" | "order_delivered" | "status_changed"
  status: string
  metadata?: Record<string, string>
  createdAt: string
}

// Mock in-memory store for demo
const MOCK_EVENTS: OrderEvent[] = [
  {
    pk: "b1#o3",
    sk: new Date(Date.now() - 14400000).toISOString() + "#order_created",
    businessId: "b1",
    orderId: "o3",
    vendorId: "v3",
    eventType: "order_created",
    status: "pending",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    pk: "b1#o3",
    sk: new Date(Date.now() - 14000000).toISOString() + "#order_sent",
    businessId: "b1",
    orderId: "o3",
    vendorId: "v3",
    eventType: "order_sent",
    status: "sent",
    metadata: { emailId: "em_001" },
    createdAt: new Date(Date.now() - 14000000).toISOString(),
  },
  {
    pk: "b1#o3",
    sk: new Date(Date.now() - 10800000).toISOString() + "#vendor_confirmed",
    businessId: "b1",
    orderId: "o3",
    vendorId: "v3",
    eventType: "vendor_confirmed",
    status: "confirmed",
    metadata: { ip: "203.0.113.1" },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
]

export async function getOrderEvents(businessId: string, orderId: string): Promise<OrderEvent[]> {
  // In production: DynamoDB QueryCommand on PK = businessId#orderId
  return MOCK_EVENTS.filter((e) => e.businessId === businessId && e.orderId === orderId)
}

export async function putOrderEvent(event: Omit<OrderEvent, "pk" | "sk">): Promise<void> {
  // In production: DynamoDB PutCommand
  const newEvent: OrderEvent = {
    ...event,
    pk: `${event.businessId}#${event.orderId}`,
    sk: `${event.createdAt}#${event.eventType}`,
  }
  MOCK_EVENTS.push(newEvent)
}
