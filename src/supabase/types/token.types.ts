// src/supabase/types/token.types.ts
/**
 * Database row type for api_tokens table
 * Matches exactly what Supabase returns
 */
export interface TokenRow {
    id: string;
    merchant_id: string;
    token_hash: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    revoked_at: string | null;
    revoked_by: string | null;
}