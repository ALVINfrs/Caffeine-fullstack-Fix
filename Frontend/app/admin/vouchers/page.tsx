'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Voucher {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  expires_at: string;
  is_active: boolean;
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/admin/vouchers', { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`Failed to fetch vouchers: ${response.statusText}`);
        }
        const data = await response.json();
        setVouchers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user]);

  if (loading) {
    return <p>Loading vouchers...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Vouchers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>{voucher.id}</TableCell>
                <TableCell className="font-mono">{voucher.code}</TableCell>
                <TableCell>{voucher.discount_type}</TableCell>
                <TableCell>
                  {voucher.discount_type === 'percentage' 
                    ? `${voucher.discount_value}%` 
                    : `Rp${voucher.discount_value.toLocaleString('id-ID')}`}
                </TableCell>
                <TableCell>{new Date(voucher.expires_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={voucher.is_active ? 'success' : 'destructive'}>
                    {voucher.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}