import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class ApiTokenGuard implements CanActivate {
    constructor(private readonly tokensService: TokensService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const rawToken =
            request.headers['x-api-token'] ||
            request.headers['authorization']?.replace('Bearer ', '');

        if (!rawToken) {
            throw new UnauthorizedException('API token is required');
        }

        const merchant = await this.tokensService.validateToken(rawToken);

        if (!merchant) {
            throw new UnauthorizedException('Invalid or revoked API token');
        }

        // 🔥 attach merchant to request
        request.merchant = merchant;

        return true;
    }
}
