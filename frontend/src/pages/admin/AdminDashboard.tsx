import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  Euro,
  Calendar,
  AlertCircle,
  ListOrdered,
  ChartColumnStacked
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllProductsApi } from '../../api/adminApi/productApi';
import { getCategoriesApi } from '../../api/categoryApi/categoryApi';
import { getRevenueApi } from '../../api/adminApi/revenueApi';
import StatCard from './dashboard/StatCard';

const AdminDashboard = () => {
  // Queries for data
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProductsApi,
  });


  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });


  const [filterType, setFilterType] = useState<'today' | 'all' | 'month' | 'year' | 'range'>('today');
  const [range, setRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // Revenue queries
  const { data: filteredRevenueData = { totalRevenue: 0, orders: [] } } = useQuery({
    queryKey: ['revenue', filterType, range],
    queryFn: () => {
      if (filterType === 'today') return getRevenueApi({ type: 'day' });
      if (filterType === 'month') return getRevenueApi({ type: 'month' });
      if (filterType === 'year') return getRevenueApi({ type: 'year' });
      if (filterType === 'range' && range.start && range.end) return getRevenueApi({ startDate: range.start, endDate: range.end });
      return getRevenueApi(); // all time
    },
    refetchInterval: 10000,
  });

  // Calculate statistics
  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const publishedProducts = products?.filter((p: any) => p.publish)?.length || 0;
  const lowStockProducts = products?.filter((p: any) => (p.stock || 0) < 10)?.length || 0;
  
  // Replace mock revenue data with real API data

  // Quick action buttons
  const quickActions = [
    {
      title: 'Add Product',
      description: 'Create new product',
      icon: <Package size={20} />,
      link: '/admin/products',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Add Category',
      description: 'Create new category',
      icon: <ListOrdered size={20} />,
      link: '/admin/categories',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Add SubCategory',
      description: 'Create new subcategory',
      icon: <ChartColumnStacked size={20} />,
      link: '/admin/sub-categories',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Manage Users',
      description: 'View all users',
      icon: <Users size={20} />,
      link: '/admin/users',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Array.isArray(quickActions) ? quickActions : []).map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${action.bgColor} ${action.textColor} group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 group-hover:text-slate-900">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Revenue Overview</h3>
          {/* Filter UI */}
          <div className="flex items-center gap-4 mb-4">
            <label className="font-semibold">Revenue Filter:</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="border rounded px-2 py-1">
              <option value="today">Today Revenue</option>
              <option value="all">All Time</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 justify-center items-center">
            <StatCard
              title={filterType === 'today' ? 'Today Revenue' : filterType === 'all' ? 'All Time Revenue' : filterType === 'month' ? 'This Month Revenue' : filterType === 'year' ? 'This Year Revenue' : 'Custom Range Revenue'}
              value={`€${filteredRevenueData.totalRevenue.toLocaleString()}`}
              icon={<Euro size={48} />}
              color="text-green-700"
              bgColor="from-green-100 to-green-300"
            />
            <StatCard
              title={filterType === 'today' ? 'Today Orders' : filterType === 'all' ? 'All Time Orders' : filterType === 'month' ? 'This Month Orders' : filterType === 'year' ? 'This Year Orders' : 'Custom Range Orders'}
              value={filteredRevenueData.orders.length.toLocaleString()}
              icon={<ShoppingBag size={48} />}
              color="text-purple-700"
              bgColor="from-purple-100 to-purple-300"
            />
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Inventory Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-800">{totalProducts}</div>
              <div className="text-sm text-slate-600">Total Products</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{publishedProducts}</div>
              <div className="text-sm text-slate-600">Published</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
              <div className="text-sm text-slate-600">Low Stock</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{totalCategories}</div>
              <div className="text-sm text-slate-600">Categories</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle size={20} />
              <span className="font-medium">Inventory Alerts</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              {lowStockProducts > 0 ? (
                `${lowStockProducts} products are running low on stock. Consider restocking soon.`
              ) : (
                'All products have sufficient stock levels.'
              )}
            </p>
          </div>
        </div>

       
      </div>

     
    </div>
  );
};

export default AdminDashboard;
