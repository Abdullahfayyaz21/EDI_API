import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class OrderStatusQueryDto {
    /**
     * Tracking reference to look up
     * @example "TRK-20260207-ABC123"
     */
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    trackingReference: string;
}