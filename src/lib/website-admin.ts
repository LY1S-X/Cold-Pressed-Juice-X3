import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const adminConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export function websiteClient(token?: string) {
  if (!adminConfigured()) throw new Error('Website database is not configured');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}
export async function websiteOwner() {
  if (!adminConfigured()) return null;
  const token = (await cookies()).get('cc-website-owner')?.value;
  if (!token) return null;
  const client = websiteClient(token);
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return null;
  const { data: profile, error: profileError } = await client.from('profiles').select('full_name,role_id,status').eq('id', user.id).single();
  if (profileError || profile?.role_id !== 'OWNER' || profile.status !== 'ACTIVE') return null;
  return { client, profile };
}
