import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrdersAdminApi } from '../../api/adminApi/orderAdminApi';

const AdminOrder = () => {
  const [filterType, setFilterType] = useState<'all' | 'today' | 'month' | 'year' | 'range'>('all');
  const [range, setRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', filterType, range],
    queryFn: () => {
      if (filterType === 'today') return getOrdersAdminApi({ type: 'day' });
      if (filterType === 'month') return getOrdersAdminApi({ type: 'month' });
      if (filterType === 'year') return getOrdersAdminApi({ type: 'year' });
      if (filterType === 'range' && range.start && range.end) return getOrdersAdminApi({ startDate: range.start, endDate: range.end });
      return getOrdersAdminApi(); // all time
    },
    refetchInterval: 10000,
  });

  return (
    <div className="p-2 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Orders Dashboard</h1>
      <div className="flex items-center gap-4 mb-6">
        <label className="font-semibold">Order Filter:</label>
        <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="border rounded px-2 py-1">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="range">Custom Range</option>
        </select>
        {filterType === 'range' && (
          <>
            <input type="date" value={range.start} onChange={e => setRange(r => ({ ...r, start: e.target.value }))} className="border rounded px-2 py-1 ml-2" />
            <span className="mx-2">to</span>
            <input type="date" value={range.end} onChange={e => setRange(r => ({ ...r, end: e.target.value }))} className="border rounded px-2 py-1" />
          </>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Products</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-500">No orders found.</td></tr>
            ) : (
              (Array.isArray(orders) ? orders : []).map((o: any) => (
                <tr key={o._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{o.orderId}</td>
                  <td className="py-3 px-4">
                    {o.userId?.name ? o.userId.name : o.guestId ? `Guest (${o.guestId})` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${o.payment_status === 'Completed' ? 'text-green-600' : o.payment_status === 'Abandon Checkout' ? 'text-yellow-600' : 'text-red-600'}`}>{o.payment_status}</span>
                  </td>
                  <td className="py-3 px-4 text-green-700 font-bold">€{o.totalAmt?.toFixed(2) || '0.00'}</td>
                  <td className="py-3 px-4">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                  <td className="py-3 px-4">
                    {Array.isArray(o.product_detail) ? (
                      <ul className="list-disc ml-4">
                        {(Array.isArray(o.product_detail) ? o.product_detail : []).map((p: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                            <img src={p.image?.[0] || '/images/placeholder-product.jpg'} alt={p.name} className="w-8 h-8 object-contain rounded bg-slate-100 border" />
                            <span>{p.name}</span>
                            <span className="text-xs text-slate-500">x{p.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrder;
