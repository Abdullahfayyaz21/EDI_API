export class OrderStatusResponseDto {
    /**
     * System-generated order ID (internal use)
     */
    orderId: string;

    /**
     * Merchant's original order reference
     * @example "ORD-123456"
     */
    orderReference: string;

    /**
     * DMS-generated tracking reference (for status queries)
     * This is what external systems use to check status
     * @example "TRK-20260207-ABC123"
     */
    trackingReference: string;

    /**
     * Current order status
     * @example "PENDING", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"
     */
    status: string;

    /**
     * Current location of package
     * @example "Warehouse A", "In Transit to Downtown"
     */
    currentLocation?: string;

    /**
     * Estimated delivery date/time (ISO 8601)
     * @example "2026-02-10T18:00:00Z"
     */
    estimatedDelivery?: string;

    /**
     * Actual delivery date/time (ISO 8601) - only if delivered
     * @example "2026-02-10T17:30:00Z"
     */
    deliveredAt?: string;

    /**
     * Last status update timestamp (ISO 8601)
     * @example "2026-02-07T14:30:00Z"
     */
    lastUpdated: string;

    /**
     * Status history (array of status events)
     */
    statusHistory?: Array<{
        status: string;
        timestamp: string;
        location?: string;
        notes?: string;
    }>;

    /**
     * Driver/agent information (if assigned)
     */
    assignedTo?: {
        name: string;
        phone: string;
    };

    /**
     * Proof of delivery (if delivered)
     */
    proofOfDelivery?: {
        signatureUrl?: string;
        photoUrl?: string;
        notes?: string;
    };

    /**
     * Any error or cancellation reason
     */
    errorReason?: string;
}