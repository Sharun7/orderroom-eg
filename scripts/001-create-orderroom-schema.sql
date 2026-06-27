-- OrderRoom Database Schema for AWS Aurora PostgreSQL
-- This script creates all necessary tables and indexes for the OrderRoom application

-- Create ENUM types
CREATE TYPE order_status AS ENUM ('pending', 'sent', 'confirmed', 'rejected', 'delivered', 'completed');
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'viewer');
CREATE TYPE subscription_plan AS ENUM ('free', 'starter', 'pro');

-- Business table - Represents restaurants, hotels, catering businesses
CREATE TABLE IF NOT EXISTS business (
  id SERIAL PRIMARY KEY,
  business_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  subscription_plan subscription_plan DEFAULT 'free',
  vendor_limit INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User table - Restaurant managers and staff
CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  business_id VARCHAR(50) NOT NULL REFERENCES business(business_id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Vendor table - Suppliers (farms, butchers, seafood suppliers, etc.)
CREATE TABLE IF NOT EXISTS vendor (
  id SERIAL PRIMARY KEY,
  vendor_id VARCHAR(50) UNIQUE NOT NULL,
  business_id VARCHAR(50) NOT NULL REFERENCES business(business_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  lead_time_hours INT DEFAULT 24,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Product table - Items that can be ordered from vendors
CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  vendor_id VARCHAR(50) NOT NULL REFERENCES vendor(vendor_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50),
  unit_price NUMERIC(10, 2),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Order table - Main orders created by businesses
CREATE TABLE IF NOT EXISTS "order" (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  business_id VARCHAR(50) NOT NULL REFERENCES business(business_id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES "user"(user_id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  order_date DATE NOT NULL,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- OrderItem table - Individual items within an order for a specific vendor
CREATE TABLE IF NOT EXISTS order_item (
  id SERIAL PRIMARY KEY,
  order_item_id VARCHAR(50) UNIQUE NOT NULL,
  order_id VARCHAR(50) NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
  vendor_id VARCHAR(50) NOT NULL REFERENCES vendor(vendor_id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES product(product_id) ON DELETE SET NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50),
  status order_status DEFAULT 'pending',
  confirmation_token VARCHAR(255) UNIQUE,
  confirmed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Event table - Audit trail for all order events (for DynamoDB syncing)
CREATE TABLE IF NOT EXISTS event (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(50) UNIQUE NOT NULL,
  business_id VARCHAR(50) NOT NULL REFERENCES business(business_id) ON DELETE CASCADE,
  order_id VARCHAR(50) REFERENCES "order"(order_id) ON DELETE CASCADE,
  order_item_id VARCHAR(50) REFERENCES order_item(order_item_id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Subscription table - Track subscription and billing
CREATE TABLE IF NOT EXISTS subscription (
  id SERIAL PRIMARY KEY,
  subscription_id VARCHAR(50) UNIQUE NOT NULL,
  business_id VARCHAR(50) NOT NULL UNIQUE REFERENCES business(business_id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan subscription_plan DEFAULT 'free',
  status VARCHAR(50),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_business_email ON business(email);
CREATE INDEX IF NOT EXISTS idx_user_business_id ON "user"(business_id);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_vendor_business_id ON vendor(business_id);
CREATE INDEX IF NOT EXISTS idx_product_vendor_id ON product(vendor_id);
CREATE INDEX IF NOT EXISTS idx_order_business_id ON "order"(business_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
CREATE INDEX IF NOT EXISTS idx_order_order_date ON "order"(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON order_item(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_vendor_id ON order_item(vendor_id);
CREATE INDEX IF NOT EXISTS idx_order_item_status ON order_item(status);
CREATE INDEX IF NOT EXISTS idx_order_item_confirmation_token ON order_item(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_event_business_id ON event(business_id);
CREATE INDEX IF NOT EXISTS idx_event_order_id ON event(order_id);
CREATE INDEX IF NOT EXISTS idx_event_created_at ON event(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_business_id ON subscription(business_id);

-- Grant permissions if needed (uncomment for production)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
