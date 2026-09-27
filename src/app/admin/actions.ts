'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { websiteClient, websiteOwner } from '@/lib/website-admin';

export async function login(form: FormData) {
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  if (email.length > 254 || !email || !password || password.length > 1024) redirect('/admin?error=login');
  const client = websiteClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) redirect('/admin?error=login');
  const { data: profile } = await client.from('profiles').select('role_id,status').eq('id', data.user.id).single();
  if (profile?.role_id !== 'OWNER' || profile.status !== 'ACTIVE') {
    await client.auth.signOut({ scope: 'local' });
    redirect('/admin?error=access');
  }
  (await cookies()).set('cc-website-owner', data.session.access_token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/',
    maxAge: Math.max(0, Math.min(3600, (data.session.expires_at || 0) - Math.floor(Date.now()/1000))),
  });
  redirect('/admin');
}
export async function logout() {
  (await cookies()).delete('cc-website-owner');
  redirect('/admin');
}
export async function review(form: FormData) {
  const owner = await websiteOwner();
  if (!owner) redirect('/admin?error=access');
  const id = String(form.get('id') || '');
  const decision = String(form.get('decision') || '');
  const note = String(form.get('note') || '').trim();
  if (!/^[0-9a-f-]{36}$/i.test(id) || !['approve','reject'].includes(decision) || note.length > 500 || form.get('confirmed') !== 'yes') redirect('/admin?error=review');
  const { error } = await owner.client.rpc('website_review_order', { p_id: id, p_approve: decision === 'approve', p_note: note });
  redirect(error ? '/admin?error=review' : '/admin?reviewed=1');
}
