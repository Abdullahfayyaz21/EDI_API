import { Controller, Post, Body } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';

@Controller('api/admin/tokens')
export class TokensAdminController {
    constructor(private readonly tokensService: TokensService) { }

    @Post('create')
    createToken(@Body() body: { merchantId: string; createdBy: string }) {
        return this.tokensService.generateMerchantToken(
            body.merchantId,
            body.createdBy,
        );
    }

    @Post('revoke')
    revokeToken(@Body() body: { tokenId: string; revokedBy: string }) {
        return this.tokensService.revokeToken(body.tokenId, body.revokedBy);
    }
}
