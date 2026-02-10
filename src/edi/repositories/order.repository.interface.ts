export interface Order {
    id: string;
    merchantId: string;
    orderReference: string;
    trackingReference: string;
    status: string;
    pickupAddress: any;
    pickupContact: any;
    pickupTime?: string;
    dropoffAddress: any;
    dropoffContact: any;
    dropoffTime?: string;
    deliveryInstructions?: string;
    codAmount?: number;
    currency?: string;
    packageWeight?: number;
    packageDimensions?: string;
    packageDescription?: string;
    metadata?: any;
    currentLocation?: string;
    estimatedDelivery?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrdersRepository {
    create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
    findByTrackingAndMerchant(trackingReference: string, merchantId: string): Promise<Order | null>;
    findById(id: string): Promise<Order | null>;
    updateStatus(id: string, status: string, location?: string): Promise<boolean>;
    findByMerchantId(merchantId: string, limit?: number, offset?: number): Promise<Order[]>;
}

// Injection token for dependency injection
export const ORDERS_REPOSITORY = 'OrdersRepository';