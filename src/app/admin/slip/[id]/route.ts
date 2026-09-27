import { websiteOwner } from '@/lib/website-admin';
export async function GET(_request: Request, { params }: { params: Promise<{id: string}> }) {
  const owner = await websiteOwner();
  if (!owner) return new Response('Unauthorized', {status:403});
  const {id} = await params;
  const {data: order, error} = await owner.client.from('website_orders').select('receipt_path').eq('id',id).single();
  if (error || !order) return new Response('Not found',{status:404});
  const {data: file, error: fileError} = await owner.client.storage.from('website-transfer-slips').download(order.receipt_path);
  if (fileError || !file) return new Response('Receipt unavailable',{status:404});
  return new Response(file, {headers:{'Content-Type': file.type, 'Content-Disposition':'inline', 'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff', 'Content-Security-Policy':"sandbox; default-src 'none'"}});
}
