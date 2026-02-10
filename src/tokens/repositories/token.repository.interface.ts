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

export interface TokenRepository {
    create(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token>;
    findByTokenHash(tokenHash: string): Promise<Token | null>;
    revokeById(id: string, revokedBy: string): Promise<boolean>;
    findByMerchantId(merchantId: string): Promise<Token[]>;
    findById(id: string): Promise<Token | null>;
}

// Injection token for dependency injection
export const TOKEN_REPOSITORY = 'TokenRepository';