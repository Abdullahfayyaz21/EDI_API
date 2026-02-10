import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TOKEN_REPOSITORY } from './repositories/token.repository.interface';
import { SupabaseTokenRepository } from '../supabase/repositories/supabase-token.repository';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [ConfigModule, SupabaseModule],
    providers: [
        TokensService,
        {
            provide: TOKEN_REPOSITORY,
            useClass: SupabaseTokenRepository,
        },
    ],
    exports: [TokensService],
})
export class TokensModule { }
