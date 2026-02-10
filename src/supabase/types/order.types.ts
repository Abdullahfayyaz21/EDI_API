// src/supabase/types/order.types.ts
/**
 * Database row type for delivery_orders table
 * Matches exactly what Supabase returns
 */
export interface DeliveryOrderRow {
    id: string;
    merchant_id: string;
    order_reference: string;
    tracking_reference: string;
    status: string;
    pickup_address: string;
    pickup_contact: string;
    pickup_time: string | null;
    dropoff_address: string;
    dropoff_contact: string;
    dropoff_time: string | null;
    delivery_instructions: string | null;
    cod_amount: number | null;
    currency: string | null;
    package_weight: number | null;
    package_dimensions: string | null;
    package_description: string | null;
    metadata: string | null;
    current_location: string | null;
    estimated_delivery: string | null;
    delivered_at: string | null;
    created_at: string;
    updated_at: string;
}