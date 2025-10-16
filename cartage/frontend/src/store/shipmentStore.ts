import { create } from 'zustand';
import { Shipment, ShipmentCreate, ShipmentUpdate, ShipmentFilters } from '@/types/shipment';
import { api } from '../lib/api';

interface ShipmentStore {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  filters: ShipmentFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchShipments: () => Promise<void>;
  fetchShipmentById: (id: string) => Promise<void>;
  createShipment: (shipment: ShipmentCreate) => Promise<void>;
  updateShipment: (id: string, update: ShipmentUpdate) => Promise<void>;
  setFilters: (filters: Partial<ShipmentFilters>) => void;
  setSelectedShipment: (shipment: Shipment | null) => void;
  clearError: () => void;
}

export const useShipmentStore = create<ShipmentStore>((set, get) => ({
  shipments: [],
  selectedShipment: null,
  filters: {},
  loading: false,
  error: null,

  fetchShipments: async () => {
    const { loading } = get();
    if (loading) return; // Prevent concurrent calls
    
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const shipments = await api.getShipments(filters);
      set({ shipments, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch shipments',
        loading: false 
      });
    }
  },

  fetchShipmentById: async (id: string) => {
    const { loading } = get();
    if (loading) return; // Prevent concurrent calls
    
    set({ loading: true, error: null });
    try {
      const shipment = await api.getShipmentById(id);
      set({ selectedShipment: shipment, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch shipment',
        loading: false 
      });
    }
  },

  createShipment: async (shipmentData: ShipmentCreate) => {
    set({ loading: true, error: null });
    try {
      const newShipment = await api.createShipment(shipmentData);
      const { shipments } = get();
      set({ 
        shipments: [newShipment, ...shipments],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create shipment',
        loading: false 
      });
    }
  },

  updateShipment: async (id: string, update: ShipmentUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedShipment = await api.updateShipment(id, update);
      const { shipments, selectedShipment } = get();
      
      set({
        shipments: shipments.map(s => s.id === id ? updatedShipment : s),
        selectedShipment: selectedShipment?.id === id ? updatedShipment : selectedShipment,
        loading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update shipment',
        loading: false 
      });
    }
  },

  setFilters: (newFilters: Partial<ShipmentFilters>) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters });
    // Don't automatically refetch - let components handle this
  },

  setSelectedShipment: (shipment: Shipment | null) => {
    set({ selectedShipment: shipment });
  },

  clearError: () => {
    set({ error: null });
  },
}));
