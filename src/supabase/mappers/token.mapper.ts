import { TokenRow } from '../types/token.types';
import { Token } from '../../tokens/repositories/token.repository.interface';


export function toToken(row: TokenRow): Token {
    return {
        id: row.id,
        merchantId: row.merchant_id,
        tokenHash: row.token_hash,
        isActive: row.is_active,
        createdBy: row.created_by,
        createdAt: new Date(row.created_at),
        revokedAt: row.revoked_at ? new Date(row.revoked_at) : null,
        revokedBy: row.revoked_by || undefined,
    };
}