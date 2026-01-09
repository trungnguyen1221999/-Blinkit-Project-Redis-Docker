import { useQuery } from '@tanstack/react-query';
import { getCustomersApi } from '../../api/adminApi/customerApi';

const AdminCustomer = () => {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomersApi,
  });

  return (
    <div className="p-2 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Customers Dashboard</h1>
      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">City</th>
              <th className="py-3 px-4 text-left">Postcode</th>
              <th className="py-3 px-4 text-left">Total Order Value</th>
              <th className="py-3 px-4 text-left">Orders</th>
              <th className="py-3 px-4 text-left">Customer Since</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="py-8 text-center text-slate-400">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-slate-500">No customers found.</td></tr>
            ) : (
              (Array.isArray(customers) ? customers : []).map((c: any) => {
                const totalValue = Array.isArray(c.orders) ? c.orders.reduce((sum: number, o: any) => sum + (o.totalAmt || 0), 0) : 0;
                return (
                  <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{c.name}</td>
                    <td className="py-3 px-4">{c.email || '-'}</td>
                    <td className="py-3 px-4">{c.address || '-'}</td>
                    <td className="py-3 px-4">{c.city || '-'}</td>
                    <td className="py-3 px-4">{c.postalCode || '-'}</td>
                    <td className="py-3 px-4 text-green-700 font-bold">€{totalValue.toFixed(2)}</td>
                    <td className="py-3 px-4">{Array.isArray(c.orders) ? c.orders.length : 0}</td>
                    <td className="py-3 px-4">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomer;
