import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// クライアントサイド用（公開キー）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// サーバーサイド用（Service Role Key - RLS をバイパス）
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
