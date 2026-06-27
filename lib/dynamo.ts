/**
 * lib/dynamo.ts
 * DynamoDB event log for the "order_events" table.
 *
 * Table design
 * ─────────────────────────────────────────────────────────────
 * Table name : order_events
 * PK (Hash)  : eventId  (String, UUID)          — globally unique
 * SK (Range) : timestamp (String, ISO8601)       — per the spec
 *
 * GSI-1  (for per-order queries)
 *   PK: orderId    SK: timestamp
 *
 * GSI-2  (for per-business audit queries)
 *   PK: businessId SK: timestamp
 *
 * Attributes
 * ─────────────────────────────────────────────────────────────
 * eventId      String  UUID
 * timestamp    String  ISO8601
 * orderId      String  FK → PostgreSQL orders.id
 * orderItemId  String? FK → PostgreSQL order_items.id
 * vendorId     String  FK → PostgreSQL vendors.id
 * businessId   String  FK → PostgreSQL businesses.id
 * eventType    String  ORDER_CREATED | ORDER_SENT | VENDOR_CONFIRMED |
 *                              VENDOR_REJECTED | ITEM_DELIVERED | REMINDER_SENT
 * actorType    String  system | vendor | owner
 * metadata     String  JSON-serialised extra info
 * ─────────────────────────────────────────────────────────────
 *
 * In development (no AWS creds) the module falls back to an in-memory store
 * so the UI and API routes work without a live DynamoDB table.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  type PutCommandInput,
  type QueryCommandInput,
} from "@aws-sdk/lib-dynamodb"
import { randomUUID } from "crypto"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EventType =
  | "ORDER_CREATED"
  | "ORDER_SENT"
  | "VENDOR_CONFIRMED"
  | "VENDOR_REJECTED"
  | "ITEM_DELIVERED"
  | "REMINDER_SENT"

export type ActorType = "system" | "vendor" | "owner"

export interface OrderEvent {
  eventId: string        // UUID — PK
  timestamp: string      // ISO8601 — SK
  orderId: string
  orderItemId?: string
  vendorId: string
  businessId: string
  eventType: EventType
  actorType: ActorType
  metadata: string       // JSON string
}

export type NewOrderEvent = Omit<OrderEvent, "eventId" | "timestamp" | "metadata"> & {
  metadata?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// DynamoDB client (lazy — only initialised when creds are present)
// ---------------------------------------------------------------------------

const TABLE_NAME = process.env.DYNAMO_TABLE_NAME ?? "order_events"

function makeDynamoClient(): DynamoDBDocumentClient | null {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null
  }
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN
        ? { sessionToken: process.env.AWS_SESSION_TOKEN }
        : {}),
    },
  })
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  })
}

// Singleton — re-use across hot reloads in dev
const globalForDynamo = globalThis as unknown as {
  _dynamoClient?: DynamoDBDocumentClient | null
}
const docClient: DynamoDBDocumentClient | null =
  globalForDynamo._dynamoClient ??
  (globalForDynamo._dynamoClient = makeDynamoClient())

// ---------------------------------------------------------------------------
// In-memory fallback (dev / CI / demo)
// ---------------------------------------------------------------------------

const _memStore: OrderEvent[] = [
  {
    eventId: "evt-demo-001",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    orderId: "o1",
    vendorId: "v1",
    businessId: "b1",
    eventType: "ORDER_CREATED",
    actorType: "owner",
    metadata: JSON.stringify({ notes: "Weekly produce run" }),
  },
  {
    eventId: "evt-demo-002",
    timestamp: new Date(Date.now() - 7100000).toISOString(),
    orderId: "o1",
    orderItemId: "oi-1",
    vendorId: "v1",
    businessId: "b1",
    eventType: "ORDER_SENT",
    actorType: "system",
    metadata: JSON.stringify({ emailId: "em_001", recipientEmail: "fresh@greenfields.com" }),
  },
  {
    eventId: "evt-demo-003",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    orderId: "o1",
    orderItemId: "oi-1",
    vendorId: "v1",
    businessId: "b1",
    eventType: "VENDOR_CONFIRMED",
    actorType: "vendor",
    metadata: JSON.stringify({ ip: "203.0.113.1", userAgent: "Mozilla/5.0" }),
  },
  {
    eventId: "evt-demo-004",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    orderId: "o2",
    vendorId: "v2",
    businessId: "b1",
    eventType: "ORDER_CREATED",
    actorType: "owner",
    metadata: JSON.stringify({ notes: "Urgent dairy restock" }),
  },
  {
    eventId: "evt-demo-005",
    timestamp: new Date(Date.now() - 1700000).toISOString(),
    orderId: "o2",
    orderItemId: "oi-2",
    vendorId: "v2",
    businessId: "b1",
    eventType: "ORDER_SENT",
    actorType: "system",
    metadata: JSON.stringify({ emailId: "em_002", recipientEmail: "orders@peakdairy.com" }),
  },
  {
    eventId: "evt-demo-006",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    orderId: "o2",
    orderItemId: "oi-2",
    vendorId: "v2",
    businessId: "b1",
    eventType: "REMINDER_SENT",
    actorType: "system",
    metadata: JSON.stringify({ emailId: "em_rem_001", attemptNumber: 1 }),
  },
]

// ---------------------------------------------------------------------------
// Core write — putEvent
// ---------------------------------------------------------------------------

export async function putEvent(input: NewOrderEvent): Promise<OrderEvent> {
  const event: OrderEvent = {
    eventId: randomUUID(),
    timestamp: new Date().toISOString(),
    orderId: input.orderId,
    orderItemId: input.orderItemId,
    vendorId: input.vendorId,
    businessId: input.businessId,
    eventType: input.eventType,
    actorType: input.actorType,
    metadata: input.metadata ? JSON.stringify(input.metadata) : "{}",
  }

  if (docClient) {
    const params: PutCommandInput = {
      TableName: TABLE_NAME,
      Item: event,
    }
    await docClient.send(new PutCommand(params))
  } else {
    // In-memory fallback
    _memStore.push(event)
  }

  return event
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Get all events for a specific order (uses GSI-1: orderId + timestamp).
 * Falls back to in-memory filter in dev.
 */
export async function getEventsByOrder(orderId: string): Promise<OrderEvent[]> {
  if (docClient) {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "orderId-timestamp-index",
      KeyConditionExpression: "orderId = :oid",
      ExpressionAttributeValues: { ":oid": orderId },
      ScanIndexForward: true, // oldest first
    }
    const result = await docClient.send(new QueryCommand(params))
    return (result.Items ?? []) as OrderEvent[]
  }
  return _memStore
    .filter((e) => e.orderId === orderId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

/**
 * Get all events for a business (uses GSI-2: businessId + timestamp).
 * Useful for the audit log / activity feed.
 */
export async function getEventsByBusiness(
  businessId: string,
  limit = 50,
): Promise<OrderEvent[]> {
  if (docClient) {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "businessId-timestamp-index",
      KeyConditionExpression: "businessId = :bid",
      ExpressionAttributeValues: { ":bid": businessId },
      ScanIndexForward: false, // newest first
      Limit: limit,
    }
    const result = await docClient.send(new QueryCommand(params))
    return (result.Items ?? []) as OrderEvent[]
  }
  return _memStore
    .filter((e) => e.businessId === businessId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// Convenience wrappers — called from API routes
// ---------------------------------------------------------------------------

export async function logOrderCreated(args: {
  orderId: string
  vendorId: string
  businessId: string
  notes?: string
}): Promise<OrderEvent> {
  return putEvent({
    orderId: args.orderId,
    vendorId: args.vendorId,
    businessId: args.businessId,
    eventType: "ORDER_CREATED",
    actorType: "owner",
    metadata: { notes: args.notes ?? "" },
  })
}

export async function logOrderSent(args: {
  orderId: string
  orderItemId: string
  vendorId: string
  businessId: string
  recipientEmail: string
  emailId?: string
}): Promise<OrderEvent> {
  return putEvent({
    orderId: args.orderId,
    orderItemId: args.orderItemId,
    vendorId: args.vendorId,
    businessId: args.businessId,
    eventType: "ORDER_SENT",
    actorType: "system",
    metadata: {
      recipientEmail: args.recipientEmail,
      emailId: args.emailId ?? "",
    },
  })
}

export async function logVendorConfirmed(args: {
  orderId: string
  orderItemId: string
  vendorId: string
  businessId: string
  ip?: string
  userAgent?: string
}): Promise<OrderEvent> {
  return putEvent({
    orderId: args.orderId,
    orderItemId: args.orderItemId,
    vendorId: args.vendorId,
    businessId: args.businessId,
    eventType: "VENDOR_CONFIRMED",
    actorType: "vendor",
    metadata: { ip: args.ip ?? "", userAgent: args.userAgent ?? "" },
  })
}

export async function logVendorRejected(args: {
  orderId: string
  orderItemId: string
  vendorId: string
  businessId: string
  reason?: string
  ip?: string
}): Promise<OrderEvent> {
  return putEvent({
    orderId: args.orderId,
    orderItemId: args.orderItemId,
    vendorId: args.vendorId,
    businessId: args.businessId,
    eventType: "VENDOR_REJECTED",
    actorType: "vendor",
    metadata: { reason: args.reason ?? "", ip: args.ip ?? "" },
  })
}

export async function logItemDelivered(args: {
  orderId: string
  orderItemId: string
  vendorId: string
  businessId: string
  markedBy?: string
}): Promise<OrderEvent> {
  return putEvent({
    orderId: args.orderId,
    orderItemId: args.orderItemId,
    vendorId: args.vendorId,
    businessId: args.businessId,
    eventType: "ITEM_DELIVERED",
    actorType: "owner",
    metadata: { markedBy: args.markedBy ?? "system" },
  })
}

export async function logReminderSent(args: {
  orderId: string
  orderItemId: string
  vendorId: string
  businessId: string
  recipientEmail: string
  attemptNumber?: number
  emailId?: string
}): Promise<OrderEvent> {
  return putEvent({
    orderId: args.orderId,
    orderItemId: args.orderItemId,
    vendorId: args.vendorId,
    businessId: args.businessId,
    eventType: "REMINDER_SENT",
    actorType: "system",
    metadata: {
      recipientEmail: args.recipientEmail,
      attemptNumber: args.attemptNumber ?? 1,
      emailId: args.emailId ?? "",
    },
  })
}
