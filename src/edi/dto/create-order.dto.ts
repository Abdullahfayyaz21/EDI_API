import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsEmail, IsPhoneNumber, MinLength, MaxLength, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    street: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    apartment?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    state: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    postalCode: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    country: string;
}

class ContactDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    phone: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(100)
    email?: string;
}

export class CreateOrderDto {
    /**
     * External order reference from merchant system
     * @example "ORD-123456"
     */
    @IsString()
    @IsOptional()
    @MaxLength(100)
    orderReference?: string;

    @ValidateNested()
    @Type(() => AddressDto)
    pickupAddress: AddressDto;

    /**
     * Pickup contact person
     */
    @ValidateNested()
    @Type(() => ContactDto)
    pickupContact: ContactDto;

    /**
     * Pickup date and time (ISO 8601 format)
     * @example "2026-02-10T14:00:00Z"
     */
    @IsISO8601()
    @IsOptional()
    pickupTime?: string;

    /**
     * Dropoff location details
     */
    @ValidateNested()
    @Type(() => AddressDto)
    dropoffAddress: AddressDto;

    /**
     * Dropoff contact person
     */
    @ValidateNested()
    @Type(() => ContactDto)
    dropoffContact: ContactDto;

    /**
     * Dropoff date and time (ISO 8601 format)
     * @example "2026-02-10T18:00:00Z"
     */
    @IsISO8601()
    @IsOptional()
    dropoffTime?: string;

    /**
     * Special delivery instructions
     * @example "Leave at front desk", "Call upon arrival"
     */
    @IsString()
    @IsOptional()
    @MaxLength(500)
    deliveryInstructions?: string;

    /**
     * Cash on Delivery (COD) amount in currency units
     * If present, indicates COD order
     * @example 150.50
     */
    @IsNumber()
    @IsPositive()
    @IsOptional()
    codAmount?: number;

    /**
     * Currency code for COD amount (ISO 4217)
     * @example "USD", "EUR", "PKR"
     * @default "USD"
     */
    @IsString()
    @IsOptional()
    @MaxLength(3)
    currency?: string;

    /**
     * Package weight in kg
     * @example 2.5
     */
    @IsNumber()
    @IsPositive()
    @IsOptional()
    packageWeight?: number;

    /**
     * Package dimensions (optional)
     */
    @IsString()
    @IsOptional()
    @MaxLength(100)
    packageDimensions?: string;

    /**
     * Package description
     * @example "Electronics - Laptop"
     */
    @IsString()
    @IsOptional()
    @MaxLength(200)
    packageDescription?: string;

    /**
     * Additional metadata (JSON string)
     * For merchant-specific data
     */
    @IsString()
    @IsOptional()
    metadata?: string;
}