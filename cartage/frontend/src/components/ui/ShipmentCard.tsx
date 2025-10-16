import { Shipment } from '@/types/shipment';
import { StatusBadge } from './StatusBadge';

interface ShipmentCardProps {
  shipment: Shipment;
  onClick: (shipment: Shipment) => void;
  className?: string;
}

export function ShipmentCard({ shipment, onClick, className = '' }: ShipmentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onClick(shipment)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{shipment.id}</h3>
          <p className="text-sm text-gray-600">{shipment.carrier}</p>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">From:</span>
          <span className="ml-2">{shipment.origin}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">To:</span>
          <span className="ml-2">{shipment.destination}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">ETA:</span>
          <span className="ml-2">{formatDate(shipment.estimated_delivery)}</span>
        </div>
        {shipment.current_location && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Current:</span>
            <span className="ml-2">{shipment.current_location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
