import { Injectable } from '@nestjs/common';
import type { TokenRepository, Token } from '../tokens/repositories/token.repository.interface';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InMemoryTokenRepository implements TokenRepository {
  private tokens: Token[] = [];

  async create(data: Omit<Token, 'id' | 'createdAt'>): Promise<Token> {
    const token = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
    };
    this.tokens.push(token);
    return token;
  }

  async findByTokenHash(tokenHash: string): Promise<Token | null> {
    return this.tokens.find(t =>
      t.isActive && bcrypt.compareSync(tokenHash, t.tokenHash)
    ) || null;
  }

  async revokeById(id: string, revokedBy: string): Promise<boolean> {
    const index = this.tokens.findIndex(t => t.id === id && t.isActive);
    if (index === -1) return false;
    this.tokens[index] = { ...this.tokens[index], isActive: false, revokedAt: new Date(), revokedBy };
    return true;
  }

  async findByMerchantId(merchantId: string): Promise<Token[]> {
    return this.tokens.filter(t => t.merchantId === merchantId && t.isActive);
  }

  async findById(id: string): Promise<Token | null> {
    return this.tokens.find(t => t.id === id) || null;
  }
}