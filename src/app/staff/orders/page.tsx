'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { updateOrderStatus } from '@/app/staff/dashboard/actions'; // Import the updated action
import { format } from 'date-fns';

type OrderStatus = 'pending' | 'ready' | 'completed' | 'cancelled';

interface Order {
  id: string;
  user_id: string;
  strain_id: string;
  quantity_grams: number;
  status: OrderStatus;
  pickup_time: string | null;
  created_at: string;
  profiles: { full_name: string; email: string };
  strains: { name: string; type: string };
}

export default function StaffOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  // const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Removed this state
  const [activeFilter, setActiveFilter] = useState<OrderStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (full_name, email),
        strains (name, type)
      `)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching orders:', fetchError.message);
      setError('Failed to fetch orders.');
      setOrders([]);
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }, [setLoading, setError, setOrders, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();

    // Set up real-time subscription for orders
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Re-fetch all orders to ensure consistency after any change
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, supabase]);

  const filteredOrders = useMemo(() => { // Derived state using useMemo
    return orders.filter(order => order.status === activeFilter);
  }, [orders, activeFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'cancelled' && !confirm('Are you sure you want to cancel this order? This will refund the grams to the member.')) {
        return; // Prevent accidental cancellations
    }
    // Only allow status updates that the updateOrderStatus function supports
    if (newStatus === 'pending') {
      alert('Cannot set order back to pending status');
      return;
    }
    const result = await updateOrderStatus(orderId, newStatus as 'ready' | 'completed' | 'cancelled');
    if (result.error) {
      alert(result.error);
    } else {
      // Optimistically update the UI by re-fetching
      fetchOrders();
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <div className="flex space-x-4 mb-6">
        {['pending', 'ready', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status as OrderStatus)}
            className={`py-2 px-4 rounded-md capitalize transition-colors ${
              activeFilter === status
                ? 'bg-amber-600 text-black'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400">No {activeFilter} orders.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Strain</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity (g)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time Ordered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.profiles.full_name} ({order.profiles.email})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.strains.name} ({order.strains.type})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.quantity_grams}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {order.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'ready')}
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-xs"
                        >
                          Mark Ready
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {order.status === 'ready' && (
                       <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs"
                        >
                          Complete Pickup
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs"
                        >
                          Cancel
                        </button>
                       </div>
                    )}
                     {(order.status === 'completed' || order.status === 'cancelled') && (
                        <span className="text-gray-400 capitalize">{order.status}</span>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
