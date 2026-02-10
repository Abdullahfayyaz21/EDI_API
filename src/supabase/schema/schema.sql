-- =====================================================
-- DMS API Database Schema for Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: api_tokens
-- Stores API tokens for merchant authentication
-- =====================================================
CREATE TABLE IF NOT EXISTS api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL,
    token_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    
    CONSTRAINT valid_merchant CHECK (merchant_id IS NOT NULL AND merchant_id != '00000000-0000-0000-0000-000000000000'::uuid),
    CONSTRAINT valid_token_hash CHECK (LENGTH(token_hash) > 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_tokens_merchant_id ON api_tokens(merchant_id);
CREATE INDEX IF NOT EXISTS idx_api_tokens_token_hash ON api_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_api_tokens_active ON api_tokens(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_tokens_created_at ON api_tokens(created_at DESC);

-- =====================================================
-- TABLE 2: delivery_orders
-- Stores delivery orders created via EDI API
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL,
    
    -- Order references
    order_reference TEXT NOT NULL,
    tracking_reference TEXT NOT NULL UNIQUE,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'PENDING',
    current_location TEXT,
    
    -- Pickup details (JSONB for flexibility)
    pickup_address JSONB NOT NULL,
    pickup_contact JSONB NOT NULL,
    pickup_time TIMESTAMPTZ,
    
    -- Dropoff details (JSONB for flexibility)
    dropoff_address JSONB NOT NULL,
    dropoff_contact JSONB NOT NULL,
    dropoff_time TIMESTAMPTZ,
    
    -- Delivery details
    delivery_instructions TEXT,
    cod_amount NUMERIC(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- Package details
    package_weight NUMERIC(10, 2),
    package_dimensions TEXT,
    package_description TEXT,
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamps
    estimated_delivery TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_merchant CHECK (merchant_id IS NOT NULL),
    CONSTRAINT valid_tracking_ref CHECK (LENGTH(tracking_reference) > 0),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED')),
    CONSTRAINT valid_cod_amount CHECK (cod_amount IS NULL OR cod_amount >= 0),
    CONSTRAINT valid_package_weight CHECK (package_weight IS NULL OR package_weight > 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_delivery_orders_merchant_id ON delivery_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_tracking_ref ON delivery_orders(tracking_reference);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_status ON delivery_orders(status);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_created_at ON delivery_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_updated_at ON delivery_orders(updated_at DESC);

-- =====================================================
-- TABLE 3: merchants (if you need to store merchant info)
-- =====================================================
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_merchants_email ON merchants(email);
CREATE INDEX IF NOT EXISTS idx_merchants_active ON merchants(is_active) WHERE is_active = true;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR api_tokens
-- =====================================================

-- Policy: Tokens can only be accessed by their merchant
CREATE POLICY "Tokens accessible by merchant"
    ON api_tokens
    FOR SELECT
    USING (auth.uid()::text = merchant_id::text);

-- Policy: Merchants can only create tokens for themselves
CREATE POLICY "Tokens creatable by merchant"
    ON api_tokens
    FOR INSERT
    WITH CHECK (auth.uid()::text = merchant_id::text);

-- Policy: Tokens can only be updated/revoked by their merchant
CREATE POLICY "Tokens updatable by merchant"
    ON api_tokens
    FOR UPDATE
    USING (auth.uid()::text = merchant_id::text)
    WITH CHECK (auth.uid()::text = merchant_id::text);

-- Policy: Tokens can only be deleted by their merchant
CREATE POLICY "Tokens deletable by merchant"
    ON api_tokens
    FOR DELETE
    USING (auth.uid()::text = merchant_id::text);

-- =====================================================
-- RLS POLICIES FOR delivery_orders
-- =====================================================

-- Policy: Orders can only be accessed by their merchant
CREATE POLICY "Orders accessible by merchant"
    ON delivery_orders
    FOR SELECT
    USING (auth.uid()::text = merchant_id::text);

-- Policy: Merchants can only create orders for themselves
CREATE POLICY "Orders creatable by merchant"
    ON delivery_orders
    FOR INSERT
    WITH CHECK (auth.uid()::text = merchant_id::text);

-- Policy: Orders can only be updated by their merchant
CREATE POLICY "Orders updatable by merchant"
    ON delivery_orders
    FOR UPDATE
    USING (auth.uid()::text = merchant_id::text)
    WITH CHECK (auth.uid()::text = merchant_id::text);

-- Policy: Orders can only be deleted by their merchant
CREATE POLICY "Orders deletable by merchant"
    ON delivery_orders
    FOR DELETE
    USING (auth.uid()::text = merchant_id::text);

-- =====================================================
-- RLS POLICIES FOR merchants
-- =====================================================

-- Policy: Merchants can view their own record
CREATE POLICY "Merchants can view self"
    ON merchants
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- Policy: Merchants can update their own record
CREATE POLICY "Merchants can update self"
    ON merchants
    FOR UPDATE
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- =====================================================
-- ADMIN POLICIES (for service_role access)
-- =====================================================

-- Create a policy that allows service_role to bypass RLS
-- This is used by our NestJS backend with service_role key
-- Note: These policies are automatically bypassed when using service_role key

-- =====================================================
-- SAMPLE DATA (for testing)
-- =====================================================

-- Insert sample merchant
INSERT INTO merchants (id, name, email, phone) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Test Merchant', 'merchant@test.com', '+1234567890')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- END OF SCHEMA
-- =====================================================