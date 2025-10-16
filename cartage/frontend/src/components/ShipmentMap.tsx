'use client';

import { useEffect, useRef } from 'react';
import { Shipment } from '@/types/shipment';

interface ShipmentMapProps {
  shipment: Shipment;
}

export default function ShipmentMap({ shipment }: ShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = await import('leaflet');
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create map
      const map = L.map(mapRef.current!).setView(
        [shipment.origin_lat, shipment.origin_lng], 
        6
      );

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers
      const originMarker = L.marker([shipment.origin_lat, shipment.origin_lng])
        .addTo(map)
        .bindPopup(`<b>Origin:</b><br>${shipment.origin}`);

      const destMarker = L.marker([shipment.dest_lat, shipment.dest_lng])
        .addTo(map)
        .bindPopup(`<b>Destination:</b><br>${shipment.destination}`);

      // Add current location marker if available
      if (shipment.current_location) {
        // For demo purposes, we'll place current location between origin and destination
        const currentLat = (shipment.origin_lat + shipment.dest_lat) / 2;
        const currentLng = (shipment.origin_lng + shipment.dest_lng) / 2;
        
        L.marker([currentLat, currentLng])
          .addTo(map)
          .bindPopup(`<b>Current Location:</b><br>${shipment.current_location}`)
          .setIcon(L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          }));
      }

      // Fit map to show all markers
      const group = L.featureGroup([originMarker, destMarker]);
      map.fitBounds(group.getBounds().pad(0.1));

      mapInstanceRef.current = map;
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [shipment]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
}
