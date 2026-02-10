import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { TOKEN_REPOSITORY } from './repositories/token.repository.interface';
import type { TokenRepository } from './repositories/token.repository.interface';

@Injectable()
export class TokensService {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly repo: TokenRepository,
    private readonly config: ConfigService,
  ) {}

  async generateMerchantToken(merchantId: string, createdBy: string) {
    const rawToken = `dms_live_${uuidv4().replace(/-/g, '')}`;

    const rounds = Number(this.config.get('API_TOKEN_SALT_ROUNDS', 12));
    const hash = await bcrypt.hash(rawToken, rounds);

    const token = await this.repo.create({
      merchantId,
      tokenHash: hash,
      isActive: true,
      createdBy,
    });

    return { tokenId: token.id, rawToken };
  }

  async validateToken(rawToken: string) {
    const tokens = await (this.repo as unknown as {
      findActiveTokens(): Promise<any[]>;
    }).findActiveTokens();

    for (const token of tokens) {
      if (await bcrypt.compare(rawToken, token.tokenHash)) {
        return {
          merchantId: token.merchantId,
          tokenId: token.id,
        };
      }
    }

    return null;
  }

  async revokeToken(tokenId: string, revokedBy: string) {
    const ok = await this.repo.revokeById(tokenId, revokedBy);
    if (!ok) throw new NotFoundException('Token not found');
    return true;
  }
}
