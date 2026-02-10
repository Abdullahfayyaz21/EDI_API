// src/edi/dto/create-order-response.dto.ts
/**
 * Response DTO for successful order creation
 * 
 * Requirement 2.4.5: Return order and tracking references
 */
export class CreateOrderResponseDto {
    /**
     * Success flag
     */
    success: boolean;

    /**
     * System-generated order ID (internal use)
     */
    orderId: string;

    /**
     * Merchant's original order reference (echoed back)
     */
    orderReference: string;

    /**
     * DMS-generated tracking reference
     * External systems MUST save this to check status later
     * @example "TRK-20260207-ABC123"
     */
    trackingReference: string;

    /**
     * Current status (always "PENDING" on creation)
     */
    status: string;

    /**
     * Estimated delivery date/time (ISO 8601)
     */
    estimatedDelivery: string;

    /**
     * Message for the caller
     */
    message?: string;

    /**
     * Next steps information
     */
    nextSteps?: {
        checkStatusUrl: string;
        supportContact: string;
    };
}