'use client';

import { useState, useEffect, useRef } from 'react';
import { useShipmentStore } from '@/store/shipmentStore';
import { ShipmentCard } from '@/components/ui/ShipmentCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Shipment } from '@/types/shipment';

export function ShipmentList() {
  const { shipments, loading, error, fetchShipments, setFilters, setSelectedShipment, filters } = useShipmentStore();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchShipments();
  }, []); // Only run once on mount

  // Refetch when filters change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchShipments();
  }, []); // Only watch filters

  const handleSearch = (query: string) => {
    setFilters({ search: query });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setFilters({ status: status || undefined });
  };

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading shipments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Grid */}
      {shipments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter || shipments.length === 0 
              ? 'Try adjusting your filters or search terms.' 
              : 'Get started by creating a new shipment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              shipment={shipment}
              onClick={handleShipmentClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
