// src/supabase/repositories/supabase-token.repository.ts
import { Injectable } from '@nestjs/common';
import type { TokenRepository, Token } from '../../tokens/repositories/token.repository.interface';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class SupabaseTokenRepository implements TokenRepository {
  constructor(private readonly supabaseService: SupabaseService) { }

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async create(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token> {
    const { data: insertedData, error } = await this.supabase
      .from('api_tokens')
      .insert({
        merchant_id: data.merchantId,
        token_hash: data.tokenHash,
        is_active: data.isActive,
        created_by: data.createdBy,
      })
      .select()
      .single();

    if (error) throw new Error(`Token creation failed: ${error.message}`);
    return insertedData as Token;
  }

  async findByTokenHash(tokenHash: string): Promise<Token | null> {
    const { data: tokens, error } = await this.supabase
      .from('api_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('is_active', true)
      .limit(1);

    if (error) throw new Error(`Token lookup failed: ${error.message}`);
    return tokens?.[0] || null;
  }

  async revokeById(id: string, revokedBy: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('api_tokens')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
      })
      .eq('id', id)
      .eq('is_active', true)
      .select();

    if (error) throw new Error(`Token revocation failed: ${error.message}`);
    return !!data?.length;
  }

  async findByMerchantId(merchantId: string): Promise<Token[]> {
    const { data: tokens, error } = await this.supabase
      .from('api_tokens')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Merchant tokens lookup failed: ${error.message}`);
    return tokens || [];
  }

  async findById(id: string): Promise<Token | null> {
    const { data: tokens, error } = await this.supabase
      .from('api_tokens')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (error) throw new Error(`Token lookup failed: ${error.message}`);
    return tokens?.[0] || null;
  }
}