import type { Metadata } from 'next';
import { adminConfigured, websiteOwner } from '@/lib/website-admin';
import { login } from './actions';
import { OrdersDashboard } from './OrdersDashboard';
import styles from './style.module.css';
export const metadata: Metadata = { title: 'Website Orders — Conscious Choice', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Admin({ searchParams }: { searchParams: Promise<{ error?: string; reviewed?: string }> }) {
  const params = await searchParams;
  const owner = await websiteOwner();
  if (!owner) return <main className={styles.page}><section className={styles.login}>
    <p className={styles.eyebrow}>CONSCIOUS CHOICE / PRIVATE</p><h1>Website admin</h1>
    <p>Sign in with your existing business Owner account.</p>
    {!adminConfigured() ? <p role="status">Database connection is not configured yet. Checkout remains closed.</p> : <form action={login}>
      <label>Email<input name="email" type="email" autoComplete="username" required maxLength={254}/></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={1024}/></label>
      {params.error && <p role="alert">Unable to sign in. An active business Owner account is required.</p>}
      <button>Sign in</button></form>}
    <a href="/">← Back to website</a></section></main>;
  const { data: orders, error } = await owner.client.from('website_orders').select('*, business:orders!business_order_id(status)').order('created_at', { ascending: false }).limit(100);
  return <OrdersDashboard orders={orders ?? []} ownerName={owner.profile.full_name} loadError={Boolean(error)} reviewError={Boolean(params.error)} reviewed={Boolean(params.reviewed)} />;
}
