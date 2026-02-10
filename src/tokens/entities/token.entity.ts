export interface Token {
    id: string;
    merchantId: string;
    tokenHash: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    revokedAt?: Date | null;
    revokedBy?: string;
}