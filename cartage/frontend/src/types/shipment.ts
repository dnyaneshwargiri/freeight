export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered';
  carrier: string;
  estimated_delivery: string;
  current_location?: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
  created_at: string;
  updated_at: string;
}

export interface ShipmentCreate {
  origin: string;
  destination: string;
  status?: 'pending' | 'in_transit' | 'delivered';
  carrier: string;
  estimated_delivery: string;
  current_location?: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
}

export interface ShipmentUpdate {
  status?: 'pending' | 'in_transit' | 'delivered';
  current_location?: string;
}

export interface ShipmentFilters {
  status?: string;
  search?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
