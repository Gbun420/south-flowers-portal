import Link from 'next/link';
import { format } from 'date-fns';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderHistoryProps {
  orders: Array<{
    id: string;
    quantity_grams: number;
    status: 'pending' | 'ready' | 'completed' | 'cancelled';
    created_at: string;
    strains: Array<{
      name: string;
      type: string;
    }> | {
      name: string;
      type: string;
    } | null;
  }>;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-primary-400',
    bg: 'bg-primary-400/20',
    border: 'border-primary-400/30',
    label: 'Pending'
  },
  ready: {
    icon: Package,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/20',
    border: 'border-semantic-success/30',
    label: 'Ready'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-primary-600',
    bg: 'bg-primary-600/20',
    border: 'border-primary-600/30',
    label: 'Completed'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-semantic-error',
    bg: 'bg-semantic-error/20',
    border: 'border-semantic-error/30',
    label: 'Cancelled'
  }
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-glass-heavy rounded-full animate-pulse-slow" />
          <div className="relative w-12 h-12 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
        <p className="text-primary-300">Your reservation history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const config = statusConfig[order.status];
        const StatusIcon = config.icon;
        
        // Handle case where strains might be null or array (Supabase returns array)
        const strain = order.strains 
          ? (Array.isArray(order.strains) ? order.strains[0] : order.strains)
          : null;
        
        if (!strain) return null;

        return (
          <Link href={`/dashboard/orders/${order.id}`} key={order.id}>
            <div
              className="backdrop-blur-sm bg-glass-heavy rounded-2xl p-5 border border-glass-border hover:bg-glass-border transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white text-lg">{strain.name}</h4>
                    <span className="inline-flex items-center rounded-full bg-glass-bg border border-glass-border px-3 py-1 text-xs font-medium text-primary-300 capitalize">
                      {strain.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-primary-300">
                    <span className="font-medium">{order.quantity_grams}g</span>
                    <span>•</span>
                    <span>{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                    <span>•</span>
                    <span>{format(new Date(order.created_at), 'HH:mm')}</span>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border ${config.border}`}>
                  <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}