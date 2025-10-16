'use client';

import React, { Suspense, useEffect } from 'react';
import { useShipmentStore } from '@/store/shipmentStore';
import { ShipmentDetail } from '@/components/ShipmentDetail';

interface ShipmentPageProps {
  params: {
    id: string;
  };
}

export default function ShipmentPage({ params }: ShipmentPageProps) {
  const { selectedShipment, fetchShipmentById, setSelectedShipment } = useShipmentStore();

  // Fetch shipment data when component mounts
  React.useEffect(() => {
    if (params.id) {
      fetchShipmentById(params.id);
    }
  }, [params.id]); // Remove fetchShipmentById from dependencies to prevent infinite loop

  const handleClose = () => {
    setSelectedShipment(null);
    // Navigate back to home page
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading shipment details...</span>
        </div>
      }>
        <ShipmentDetail 
          shipment={selectedShipment} 
          onClose={handleClose} 
        />
      </Suspense>
    </div>
  );
}
