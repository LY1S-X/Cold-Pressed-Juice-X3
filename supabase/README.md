# Website order administration

This is an additive integration with the existing Conscious Choice business
database. Do not run the business application's bootstrap scripts here.

## Current state

- `/admin` is implemented with server-side authentication and a fresh ACTIVE
  OWNER profile check on every request/action, using the business `profiles`.
- No navigation link exposes the admin screen; the login URL is not a secret
  and authorization, not obscurity, protects the data.
- `202609280001_website_orders.sql` was applied to project
  `lnvhxkndpiipsdbphdwc` on 2026-09-28. Live checks confirmed RLS enabled,
  a private bucket, no anonymous table reads and no direct authenticated updates.
- Checkout remains a preview; there is no public order submission endpoint yet.
- The existing project's public URL and publishable key are configured locally
  in ignored `.env.local`. No service key is configured or exposed.

## Before enabling

1. Inspect the live schema against the business migrations. Confirm the existing
   `profiles`, `products`, `orders`, `create_order`, `set_payment`, and
   `audit_change` contracts match. The first migration is already applied; do not
   rerun it. Future changes need separate migrations.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   locally and in the website's deployment. Never use a service key for login.
3. Test with an ACTIVE OWNER and a non-owner. Verify direct REST reads, receipt
   downloads, and review RPCs reject non-owners, inactive owners and anonymous
   callers. Verify role removal takes effect on the next request.
4. Connect a validated/rate-limited server-only checkout intake with private
   uploads and idempotent submission keys. Do not expose a service key, permit
   anonymous table reads, or allow clients to set prices or review status.
5. Select the actual active business product and confirm the customer total
   before enabling QR payments. Add privacy/retention guidance for customer
   addresses and receipts.
6. Test duplicate and concurrent approvals in staging. Approval creates one
   PENDING business order with PAID payment status; fulfillment still uses the
   existing business workflow and is not automatic.

Shipping is stored separately on website orders and included in business order
notes. Existing finance reports calculate product revenue only; they do not
automatically account for shipping income. Do not silently add shipping as a
product or change accounting reports without a separate review.

Admin sessions expire after at most one hour and require signing in again.
No new users, role grants, existing business records, or notifications are
created by this migration. The private bucket is new and separate from the
business application's receipts/documents buckets.
