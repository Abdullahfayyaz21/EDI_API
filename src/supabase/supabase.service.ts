// src/supabase/supabase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private supabase: SupabaseClient;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials missing in .env');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: true, persistSession: false },
        });
        console.log('✅ Supabase client initialized');
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }

    async testConnection(): Promise<boolean> {
        try {
            const { error } = await this.supabase.from('api_tokens').select('id').limit(1);
            if (error) throw error;
            console.log('✅ Supabase connection test passed');
            return true;
        } catch (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }
    }
}