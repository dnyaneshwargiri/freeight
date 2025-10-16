import { z } from 'zod';

export const ShipmentSchema = z.object({
  id: z.string(),
  origin: z.string(),
  destination: z.string(),
  status: z.enum(['pending', 'in_transit', 'delivered']),
  carrier: z.string(),
  estimated_delivery: z.string(),
  current_location: z.string().optional(),
  origin_lat: z.number(),
  origin_lng: z.number(),
  dest_lat: z.number(),
  dest_lng: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ShipmentCreateSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  status: z.enum(['pending', 'in_transit', 'delivered']).default('pending'),
  carrier: z.string().min(1, 'Carrier is required'),
  estimated_delivery: z.string().min(1, 'Estimated delivery is required'),
  current_location: z.string().optional(),
  origin_lat: z.number().min(-90).max(90),
  origin_lng: z.number().min(-180).max(180),
  dest_lat: z.number().min(-90).max(90),
  dest_lng: z.number().min(-180).max(180),
});

export const ShipmentUpdateSchema = z.object({
  status: z.enum(['pending', 'in_transit', 'delivered']).optional(),
  current_location: z.string().optional(),
});

export const ShipmentFiltersSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
});

export type Shipment = z.infer<typeof ShipmentSchema>;
export type ShipmentCreate = z.infer<typeof ShipmentCreateSchema>;
export type ShipmentUpdate = z.infer<typeof ShipmentUpdateSchema>;
export type ShipmentFilters = z.infer<typeof ShipmentFiltersSchema>;
