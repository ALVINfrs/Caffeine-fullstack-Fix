'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { DollarSign, Users, ShoppingCart } from 'lucide-react';

// Define types for our data
interface StatData {
  totalRevenue: number;
  orderCount: number;
  userCount: number;
}

interface SalesData {
  date: string;
  total: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [sales, setSales] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const [statsRes, salesRes] = await Promise.all([
          fetch('http://localhost:3000/api/admin/stats', { credentials: 'include' }),
          fetch('http://localhost:3000/api/admin/sales-chart', { credentials: 'include' })
        ]);

        if (!statsRes.ok) throw new Error(`Failed to fetch stats: ${statsRes.statusText}`);
        if (!salesRes.ok) throw new Error(`Failed to fetch sales data: ${salesRes.statusText}`);

        const statsData = await statsRes.json();
        const salesData = await salesRes.json();
        
        setStats(statsData);
        const formattedSales = salesData.map((item: any) => ({ ...item, date: new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }));
        setSales(formattedSales);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-center p-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <p className="text-red-500 p-8">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:border-amber-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp{stats?.totalRevenue.toLocaleString('id-ID') || '0'}</div>
          </CardContent>
        </Card>
        <Card className="hover:border-amber-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.orderCount || '0'}</div>
          </CardContent>
        </Card>
        <Card className="hover:border-amber-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.userCount || '0'}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Sales Trend</h2>
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={sales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickFormatter={(value) => `Rp${Number(value) / 1000}k`} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => `Rp${value.toLocaleString('id-ID')}`} />
            <Legend />
            <Line type="monotone" dataKey="total" name="Sales" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
