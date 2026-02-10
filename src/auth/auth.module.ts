import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensService } from '../tokens/tokens.service';
import { TOKEN_REPOSITORY } from '../tokens/repositories/token.repository.interface';
import { SupabaseTokenRepository } from '../supabase/repositories/supabase-token.repository';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [SupabaseModule],
    providers: [
        JwtStrategy,
        TokensService,
        {
            provide: TOKEN_REPOSITORY,
            useClass: SupabaseTokenRepository,
        },
    ],
    exports: [TokensService],
})
export class AuthModule { }