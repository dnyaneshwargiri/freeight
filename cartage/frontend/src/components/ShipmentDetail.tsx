'use client';

import { useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';
import { StatusBadge } from '@/components/ui/StatusBadge';
import ShipmentMap from '@/components/ShipmentMap';

interface ShipmentDetailProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export function ShipmentDetail({ shipment, onClose }: ShipmentDetailProps) {
  if (!shipment) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusTimeline = (status: Shipment['status']) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'in_transit', label: 'In Transit', completed: status !== 'pending' },
      { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
    ];
    return steps;
  };

  const timeline = getStatusTimeline(shipment.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{shipment.id}</h3>
                <p className="text-sm text-gray-600">{shipment.carrier}</p>
              </div>
              <div className="flex items-center space-x-4">
                <StatusBadge status={shipment.status} />
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Details */}
              <div className="space-y-6">
                {/* Route Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Route Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Origin</p>
                        <p className="text-sm text-gray-600">{shipment.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Destination</p>
                        <p className="text-sm text-gray-600">{shipment.destination}</p>
                      </div>
                    </div>
                    {shipment.current_location && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium text-gray-900">Current Location</p>
                          <p className="text-sm text-gray-600">{shipment.current_location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Timeline</h4>
                  <div className="space-y-3">
                    {timeline.map((step, index) => (
                      <div key={step.key} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className={`text-sm ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Shipment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{formatDate(shipment.estimated_delivery)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDateTime(shipment.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{formatDateTime(shipment.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Route Map</h4>
                <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                  <ShipmentMap shipment={shipment} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
