'use client';

import { useState, Suspense, lazy } from 'react';
import { useShipmentStore } from '@/store/shipmentStore';
import { ShipmentList } from '@/components/ShipmentList';

// Lazy load heavy components
const ShipmentDetail = lazy(() => import('@/components/ShipmentDetail').then(module => ({ default: module.ShipmentDetail })));
const CreateShipmentForm = lazy(() => import('@/components/CreateShipmentForm').then(module => ({ default: module.CreateShipmentForm })));

export default function HomePage() {
  const { selectedShipment, setSelectedShipment } = useShipmentStore();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleCloseDetail = () => {
    setSelectedShipment(null);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipment Tracker</h1>
              <p className="text-gray-600">Track and manage your freight shipments</p>
            </div>
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Shipment
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        }>
          <ShipmentList />
        </Suspense>
      </main>

      {/* Modals */}
      {selectedShipment && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }>
          <ShipmentDetail 
            shipment={selectedShipment} 
            onClose={handleCloseDetail} 
          />
        </Suspense>
      )}

      {isCreateFormOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }>
          <CreateShipmentForm 
            isOpen={isCreateFormOpen} 
            onClose={handleCloseCreateForm} 
          />
        </Suspense>
      )}
    </div>
  );
}