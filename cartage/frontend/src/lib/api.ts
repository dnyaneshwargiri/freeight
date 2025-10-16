import { Shipment, ShipmentCreate, ShipmentUpdate } from '@/types/shipment';

const API_BASE_URL = 'http://localhost:8000';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status
    );
  }
  return response.json();
}

export const api = {
  async getShipments(filters?: { status?: string; search?: string }): Promise<Shipment[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const url = `${API_BASE_URL}/api/shipments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse<Shipment[]>(response);
  },

  async getShipmentById(id: string): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/api/shipments/${id}`);
    return handleResponse<Shipment>(response);
  },

  async createShipment(shipment: ShipmentCreate): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/api/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipment),
    });
    return handleResponse<Shipment>(response);
  },

  async updateShipment(id: string, update: ShipmentUpdate): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/api/shipments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });
    return handleResponse<Shipment>(response);
  },

  async seedDatabase(): Promise<{ message: string; shipments: Shipment[] }> {
    const response = await fetch(`${API_BASE_URL}/api/seed`, {
      method: 'POST',
    });
    return handleResponse<{ message: string; shipments: Shipment[] }>(response);
  },
};
