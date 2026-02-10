import { Module } from '@nestjs/common';
import { EdiController } from './edi.controller';
import { EdiService } from './edi.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
    imports: [SupabaseModule, TokensModule],
    controllers: [EdiController],
    providers: [EdiService],
})
export class EdiModule { }
