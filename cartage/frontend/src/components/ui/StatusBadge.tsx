import { Shipment } from '@/types/shipment';

interface StatusBadgeProps {
  status: Shipment['status'];
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '⏳'
  },
  in_transit: {
    label: 'In Transit',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🚚'
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅'
  }
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}
