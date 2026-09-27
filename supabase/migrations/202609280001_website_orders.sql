-- Additive website intake. Existing business tables and permissions are unchanged.
begin;

create function public.website_is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and role_id = 'OWNER' and status = 'ACTIVE');
$$;
revoke all on function public.website_is_owner() from public, anon;
grant execute on function public.website_is_owner() to authenticated;

create table public.website_orders (
  id uuid primary key default gen_random_uuid(),
  submission_key uuid not null unique,
  created_at timestamptz not null default now(),
  full_name text not null check (length(full_name) between 1 and 100),
  email text not null check (length(email) between 3 and 254),
  phone text not null check (length(phone) between 1 and 30),
  address text not null check (length(address) between 1 and 500),
  district text not null check (length(district) between 1 and 100),
  postcode text not null check (postcode ~ '^[0-9]{5}$'),
  notes text not null default '' check (length(notes) <= 500),
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity between 1 and 100),
  unit_price numeric(12,2) not null check (unit_price > 0),
  shipping_fee numeric(12,2) generated always as (((quantity + 9) / 10) * 50) stored,
  receipt_path text not null unique,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  business_order_id uuid unique references public.orders(id),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_note text check (length(review_note) <= 500),
  check ((status = 'PENDING' and reviewed_by is null and reviewed_at is null and business_order_id is null)
    or (status = 'APPROVED' and reviewed_by is not null and reviewed_at is not null and business_order_id is not null)
    or (status = 'REJECTED' and reviewed_by is not null and reviewed_at is not null and business_order_id is null))
);
alter table public.website_orders enable row level security;
revoke all on public.website_orders from anon, authenticated;
grant select on public.website_orders to authenticated;
grant select, insert on public.website_orders to service_role;
create policy website_owner_read on public.website_orders for select to authenticated
using (public.website_is_owner());
create index website_orders_queue on public.website_orders(status, created_at desc);
create trigger website_orders_audit after insert or update on public.website_orders
for each row execute function public.audit_change();

-- Only a checked Owner can review. Row locks and a unique link prevent double import.
create function public.website_review_order(p_id uuid, p_approve boolean, p_note text default '')
returns uuid language plpgsql security definer set search_path = '' as $$
declare w public.website_orders; business_id uuid;
begin
  if not public.website_is_owner() then raise exception 'Owner access required'; end if;
  if p_approve is null or length(coalesce(p_note,'')) > 500 then raise exception 'Invalid review'; end if;
  select * into w from public.website_orders where id = p_id for update;
  if not found then raise exception 'Order not found'; end if;
  if w.status = 'APPROVED' and p_approve then return w.business_order_id; end if;
  if w.status = 'REJECTED' and not p_approve then return null; end if;
  if w.status <> 'PENDING' then raise exception 'Order already reviewed'; end if;
  if p_approve then
    if not exists(select 1 from storage.objects where bucket_id='website-transfer-slips' and name=w.receipt_path)
      then raise exception 'Transfer slip missing'; end if;
    business_id := public.create_order(w.full_name, 'DIRECT', (now() at time zone 'Asia/Bangkok')::date,
      jsonb_build_array(jsonb_build_object('product_id',w.product_id,'quantity',w.quantity,'unit_price',w.unit_price)),
      concat('Website order: ',w.id,E'\nPhone: ',w.phone,E'\nEmail: ',w.email,E'\nDelivery: ',w.address,', ',w.district,', Bangkok ',w.postcode,
        E'\nShipping collected (separate from product revenue): THB ',w.shipping_fee,E'\nNotes: ',w.notes));
    perform public.set_payment(business_id,'PAID');
  end if;
  update public.website_orders set status=case when p_approve then 'APPROVED' else 'REJECTED' end,
    business_order_id=business_id, reviewed_by=auth.uid(), reviewed_at=now(), review_note=coalesce(p_note,'') where id=p_id;
  return business_id;
end;
$$;
revoke all on function public.website_review_order(uuid,boolean,text) from public, anon;
grant execute on function public.website_review_order(uuid,boolean,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('website-transfer-slips','website-transfer-slips',false,10485760,array['image/jpeg','image/png','application/pdf']);
create policy website_owner_slips on storage.objects for select to authenticated
using (bucket_id='website-transfer-slips' and public.website_is_owner());
commit;
