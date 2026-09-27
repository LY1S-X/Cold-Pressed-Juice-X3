'use client';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Wordmark } from '@/components/ui/Icons';
import { logout, review } from './actions';
import s from './style.module.css';

type Order = { id:string; full_name:string; email:string; phone:string; address:string; district:string; postcode:string; quantity:number; unit_price:number; shipping_fee:number; status:string; notes:string; review_note:string|null; created_at:string; business_order_id:string|null; business:{status:string}|null };
type IconName = 'orders'|'truck'|'settings'|'user'|'logout'|'search'|'check'|'file';
function Icon({name}:{name:IconName}) {
  const paths:Record<IconName,string>={orders:'M8 4H5v17h14V4h-3M9 3h6v4H9zM8 11h8M8 15h6',truck:'M3 5h11v12H3zM14 10h4l3 4v3h-7M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',user:'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-3a8 6 0 0 1 16 0v3z',logout:'M10 3H4v18h6M9 12h12M17 8l4 4-4 4',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6',check:'M4 12l5 5L20 6',file:'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h6'};
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
const statusOf=(o:Order)=>o.status==='APPROVED'&&o.business?.status==='COMPLETED'?'DELIVERED':o.status;
const label=(value:string)=>({PENDING:'Pending',APPROVED:'Approved',REJECTED:'Rejected',DELIVERED:'Delivered'}[value]||value);
const ref=(id:string)=>`WEB-${id.slice(0,8).toUpperCase()}`;
function Badge({status}:{status:string}){return <span className={`${s.badge} ${s[status.toLowerCase()]}`}><i/>{label(status)}</span>}
function ReviewButtons(){const {pending}=useFormStatus();return <div className={s.buttons}><button disabled={pending} name="decision" value="approve"><Icon name="check"/>{pending?'Saving…':'Approve order'}</button><button disabled={pending} name="decision" value="reject" className={s.reject}>× &nbsp; Reject</button></div>}

export function OrdersDashboard({orders,ownerName,loadError,reviewError,reviewed}:{orders:Order[];ownerName:string;loadError:boolean;reviewError:boolean;reviewed:boolean}) {
  const [section,setSection]=useState('Orders');
  const [filter,setFilter]=useState('ALL');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<string|null>(orders[0]?.id??null);
  const [showAddress,setShowAddress]=useState(false);
  const counts=(status:string)=>orders.filter(o=>statusOf(o)===status).length;
  const filtered=orders.filter(o=>(section!=='Deliveries'||o.status==='APPROVED')&&(filter==='ALL'||statusOf(o)===filter)&&`${ref(o.id)} ${o.full_name} ${o.email} ${o.phone}`.toLowerCase().includes(query.toLowerCase()));
  const active=filtered.find(o=>o.id===selected)??filtered[0];
  return <div className={s.dashboard}>
    <aside className={s.sidebar}>
      <a className={s.logo} href="/" aria-label="Conscious Choice website"><Wordmark/><strong>CONSCIOUS<br/>CHOICE</strong><small>Good Juice<br/>A Kinder Tomorrow</small></a>
      <nav aria-label="Administration">{(['Orders','Deliveries','Settings'] as const).map((item,i)=><button key={item} className={section===item?s.navActive:''} onClick={()=>{setSection(item);setFilter('ALL');setQuery('')}} aria-current={section===item?'page':undefined}><Icon name={(['orders','truck','settings'] as const)[i]}/>{item}</button>)}</nav>
      <div className={s.sidebarBottom}><p><Icon name="user"/><span>{ownerName}<small>Business Owner</small></span></p><form action={logout}><button><Icon name="logout"/>Log out</button></form><div className={s.brandNote}><Wordmark/><span>Small Choices<br/>Brighter Tomorrows</span></div></div>
    </aside>
    <main className={s.workspace}>
      <header className={s.topbar}><div><h1>{section}</h1><p>{section==='Orders'?'Review each order before confirming it.':section==='Deliveries'?'Approved orders and fulfillment from your business system.':'Your website administration access.'}</p></div><div className={s.motto}>NATURAL JUICE<br/>BRIGHTER PEOPLE<br/>CLEANER TOMORROWS<Wordmark/></div></header>
      {reviewError&&<p role="alert" className={s.notice}>Review could not be saved. Refresh and check the order before retrying.</p>}
      {reviewed&&<p role="status" className={s.notice}>Review saved successfully.</p>}
      {section==='Settings'?<section className={s.panel}><h2>Account & access</h2><p>{ownerName} · Active business Owner</p><p>Access follows your existing business Owner role. No separate website account is required.</p><hr/><h2>Order workflow</h2><p>Website orders await manual payment review. Approved orders go to the business dashboard. Fulfillment is managed there.</p><p>Delivery: ฿50 per group of up to 10 bottles · Bangkok only.</p></section>:<div className={s.columns}>
      <div className={s.listColumn}>
        <div className={s.stats}>{([{status:'PENDING',title:'Pending approval',icon:'orders'},{status:'APPROVED',title:'Approved',icon:'check'},{status:'DELIVERED',title:'Delivered',icon:'truck'}] as const).map(item=><div className={s.stat} key={item.status}><span className={`${s.statIcon} ${s[item.status.toLowerCase()]}`}><Icon name={item.icon}/></span><div><p>{item.title}</p><strong>{loadError?'—':counts(item.status)}</strong></div></div>)}</div>
        <section className={`${s.panel} ${s.listPanel}`} aria-label="Order list">
          <label className={s.search}><Icon name="search"/><input aria-label="Search orders" placeholder="Search orders…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
          <div className={s.filters} aria-label="Filter orders">{(section==='Deliveries'?['ALL','APPROVED','DELIVERED']:['ALL','PENDING','APPROVED','REJECTED']).map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f==='ALL'?'All':label(f)} <span>{loadError?'—':f==='ALL'?(section==='Deliveries'?orders.filter(o=>o.status==='APPROVED').length:orders.length):counts(f)}</span></button>)}</div>
          <div className={s.tableWrap}><table><thead><tr><th>Order</th><th>Customer</th><th>Bottles</th><th>Status</th><th><span className={s.srOnly}>Select</span></th></tr></thead><tbody>{filtered.map(o=><tr key={o.id} className={active?.id===o.id?s.selected:''}><td><button className={s.rowSelect} onClick={()=>{setSelected(o.id);setShowAddress(false)}} aria-label={`View ${ref(o.id)}`} aria-pressed={active?.id===o.id}>{ref(o.id)}</button></td><td>{o.full_name}</td><td>{o.quantity}</td><td><Badge status={statusOf(o)}/></td><td aria-hidden="true">›</td></tr>)}</tbody></table></div>
          {loadError?<div className={s.empty}><Icon name="orders"/><h2>Orders unavailable</h2><p>Unable to load the orders. Please refresh to try again.</p></div>:!filtered.length&&<div className={s.empty}><Icon name="orders"/><h2>{orders.length?'No matching orders':'Your first order starts here'}</h2><p>{orders.length?'Try another search or filter.':'New website orders will appear here, ready for your review.'}</p></div>}
          <p className={s.listFooter}>{loadError?'Connection unavailable':`Showing ${filtered.length} orders · Latest 100 website orders`}</p>
        </section>
      </div>
      <section className={`${s.panel} ${s.detailPanel}`} aria-label="Order details">
        {!active||loadError?<div className={s.detailEmpty}><span><Icon name="file"/></span><p className={s.eyebrow}>ORDER DETAILS</p><h2>Select an order to review</h2><p>Customer details, delivery information and the transfer slip will appear here.</p><div className={s.emptySteps}><p>01 <span>Review customer & delivery</span></p><p>02 <span>Verify the bank transfer</span></p><p>03 <span>Approve or reject the order</span></p></div><small>Only active business Owners can review orders.</small></div>:<>
          <div className={s.detailHeading}><h2>Order #{ref(active.id)}</h2><Badge status={statusOf(active)}/></div>
          <div className={s.detailBlock}><Icon name="user"/><div><p className={s.fieldTitle}>Customer</p><h3>{active.full_name}</h3><p>Bangkok · {active.district}</p><p>{active.phone}</p><button className={s.textLink} onClick={()=>setShowAddress(!showAddress)} aria-expanded={showAddress}>View delivery details →</button>{showAddress&&<div className={s.address}><p>{active.address}, {active.district}, {active.postcode}</p><p>{active.email}</p>{active.notes&&<p>{active.notes}</p>}</div>}</div></div>
          <div className={s.detailBlock}><Icon name="orders"/><div><p className={s.fieldTitle}>Product</p><h3>Original Kick-Start</h3><p>300 ml × {active.quantity}</p><p className={s.muted}>฿{Number(active.unit_price).toLocaleString()} per bottle</p></div></div>
          <div className={s.detailBlock}><Icon name="truck"/><div><p className={s.fieldTitle}>Delivery</p><div className={s.priceLine}><span>Shipping · {active.quantity} bottles</span><strong>฿{Number(active.shipping_fee).toLocaleString()}</strong></div><div className={s.priceLine}><span>Order total</span><strong>฿{(Number(active.unit_price)*active.quantity+Number(active.shipping_fee)).toLocaleString()}</strong></div></div></div>
          <div className={s.detailBlock}><Icon name="file"/><div><p className={s.fieldTitle}>Payment</p><h3>Thai QR transfer</h3><p className={s.muted}>{active.status==='PENDING'?'Check the transfer before approving.':active.status==='REJECTED'?'Order rejected.':'Payment manually approved.'}</p><a className={s.attachment} href={`/admin/slip/${active.id}`} target="_blank" rel="noopener noreferrer"><Icon name="file"/>Open transfer slip ↗</a></div></div>
          {active.status==='PENDING'?<form action={review} key={active.id} className={s.reviewForm}><input type="hidden" name="id" value={active.id}/><label>Internal note (optional)<textarea name="note" maxLength={500} placeholder="Add a note for your team…"/></label><label className={s.confirm}><input type="checkbox" name="confirmed" value="yes" required/>I reviewed the payment evidence. Approval confirms payment and sends this order to the business system.</label><ReviewButtons/></form>:<div className={s.reviewed}><p>{active.review_note||'This order has been reviewed.'}</p>{active.business_order_id&&<small>Linked to business order {active.business_order_id}</small>}</div>}
        </>}
      </section></div>}
    </main>
  </div>;
}
