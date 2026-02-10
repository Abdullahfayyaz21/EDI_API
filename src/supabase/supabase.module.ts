// src/supabase/supabase.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [SupabaseService],
    exports: [SupabaseService],
})
export class SupabaseModule implements OnModuleInit {
    constructor(private readonly supabaseService: SupabaseService) { }

    async onModuleInit() {
        const isConnected = await this.supabaseService.testConnection();
        if (!isConnected) {
            console.warn('⚠️  Supabase connection test failed. Check your credentials.');
        }
    }
}