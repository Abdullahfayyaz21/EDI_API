
import { Injectable } from '@nestjs/common';
import type { OrdersRepository, Order } from '../../edi/repositories/order.repository.interface';
import { SupabaseService } from '../supabase.service'; // ✅ CORRECT PATH

@Injectable()
export class SupabaseOrderRepository implements OrdersRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const { data: insertedData, error } = await this.supabase
      .from('delivery_orders')
      .insert({
        merchant_id: data.merchantId,
        order_reference: data.orderReference,
        tracking_reference: data.trackingReference,
        status: data.status,
        pickup_address: JSON.stringify(data.pickupAddress),
        pickup_contact: JSON.stringify(data.pickupContact),
        pickup_time: data.pickupTime,
        dropoff_address: JSON.stringify(data.dropoffAddress),
        dropoff_contact: JSON.stringify(data.dropoffContact),
        dropoff_time: data.dropoffTime,
        delivery_instructions: data.deliveryInstructions,
        cod_amount: data.codAmount,
        currency: data.currency,
        package_weight: data.packageWeight,
        package_dimensions: data.packageDimensions,
        package_description: data.packageDescription,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        current_location: data.currentLocation,
        estimated_delivery: data.estimatedDelivery,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return insertedData as Order;
  }

  async findByTrackingAndMerchant(trackingReference: string, merchantId: string): Promise<Order | null> {
    const { data: orderData, error } = await this.supabase
      .from('delivery_orders')
      .select('*')
      .eq('tracking_reference', trackingReference)
      .eq('merchant_id', merchantId)
      .limit(1);

    if (error) throw new Error(`Failed to find order: ${error.message}`);
    return orderData?.[0] || null;
  }

  async findById(id: string): Promise<Order | null> {
    const { data: orderData, error } = await this.supabase
      .from('delivery_orders')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (error) throw new Error(`Failed to find order: ${error.message}`);
    return orderData?.[0] || null;
  }

  async updateStatus(id: string, status: string, location?: string): Promise<boolean> {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (location) updateData.current_location = location;
    if (status === 'DELIVERED') updateData.delivered_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('delivery_orders')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw new Error(`Failed to update status: ${error.message}`);
    return !!data?.length;
  }

  async findByMerchantId(merchantId: string, limit = 50, offset = 0): Promise<Order[]> {
    const { data: ordersData, error } = await this.supabase
      .from('delivery_orders')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to find orders: ${error.message}`);
    return ordersData || [];
  }
}