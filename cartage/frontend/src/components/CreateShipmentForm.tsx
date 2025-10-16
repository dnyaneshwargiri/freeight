'use client';

import { useState } from 'react';
import { useShipmentStore } from '@/store/shipmentStore';
import { ShipmentCreateSchema, ShipmentCreate } from '@/lib/schemas';
import { Modal } from '@/components/ui/Modal';

interface CreateShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShipmentForm({ isOpen, onClose }: CreateShipmentFormProps) {
  const { createShipment, loading } = useShipmentStore();
  const [formData, setFormData] = useState<Partial<ShipmentCreate>>({
    origin: '',
    destination: '',
    carrier: '',
    estimated_delivery: '',
    status: 'pending',
    origin_lat: 0,
    origin_lng: 0,
    dest_lat: 0,
    dest_lng: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ShipmentCreate, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = ShipmentCreateSchema.parse(formData);
      
      // Create shipment
      await createShipment(validatedData);
      
      // Reset form and close modal
      setFormData({
        origin: '',
        destination: '',
        carrier: '',
        estimated_delivery: '',
        status: 'pending',
        origin_lat: 0,
        origin_lng: 0,
        dest_lat: 0,
        dest_lng: 0,
      });
      setErrors({});
      onClose();
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error creating shipment:', error);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      origin: '',
      destination: '',
      carrier: '',
      estimated_delivery: '',
      status: 'pending',
      origin_lat: 0,
      origin_lng: 0,
      dest_lat: 0,
      dest_lng: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Shipment" className="sm:max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin *
            </label>
            <input
              type="text"
              value={formData.origin || ''}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.origin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Los Angeles, CA"
            />
            {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              value={formData.destination || ''}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.destination ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., New York, NY"
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
          </div>

          {/* Carrier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier *
            </label>
            <input
              type="text"
              value={formData.carrier || ''}
              onChange={(e) => handleInputChange('carrier', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.carrier ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Swift Logistics"
            />
            {errors.carrier && <p className="text-red-500 text-xs mt-1">{errors.carrier}</p>}
          </div>

          {/* Estimated Delivery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Delivery *
            </label>
            <input
              type="datetime-local"
              value={formData.estimated_delivery || ''}
              onChange={(e) => handleInputChange('estimated_delivery', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.estimated_delivery ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.estimated_delivery && <p className="text-red-500 text-xs mt-1">{errors.estimated_delivery}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'pending'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Current Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Location
            </label>
            <input
              type="text"
              value={formData.current_location || ''}
              onChange={(e) => handleInputChange('current_location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Denver, CO"
            />
          </div>
        </div>

        {/* Coordinates Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Coordinates (for map display)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Origin Lat</label>
                <input
                  type="number"
                  step="any"
                  value={formData.origin_lat || ''}
                  onChange={(e) => handleInputChange('origin_lat', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="34.0522"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Origin Lng</label>
                <input
                  type="number"
                  step="any"
                  value={formData.origin_lng || ''}
                  onChange={(e) => handleInputChange('origin_lng', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="-118.2437"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Dest Lat</label>
                <input
                  type="number"
                  step="any"
                  value={formData.dest_lat || ''}
                  onChange={(e) => handleInputChange('dest_lat', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="40.7128"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Dest Lng</label>
                <input
                  type="number"
                  step="any"
                  value={formData.dest_lng || ''}
                  onChange={(e) => handleInputChange('dest_lng', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="-74.0060"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
