import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { TokensModule } from './tokens/tokens.module';
import { EdiModule } from './edi/edi.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    TokensModule,
    EdiModule,
  ],
})
export class AppModule {}
