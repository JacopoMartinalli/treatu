import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix per le icone di Leaflet con Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// ============================================
// TYPES
// ============================================

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  popup?: string;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
  onMarkerClick?: (markerId: string) => void;
  showUserLocation?: boolean;
}

// ============================================
// MAP COMPONENT
// ============================================

export function Map({
  center = [45.4642, 9.19], // Milano di default
  zoom = 12,
  markers = [],
  height = '400px',
  className = '',
  onMarkerClick,
  showUserLocation = false,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inizializza la mappa
    const map = L.map(mapRef.current).setView(center, zoom);

    // Aggiungi il layer di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Aggiorna centro e zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Gestisci i markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Rimuovi i markers esistenti
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Aggiungi i nuovi markers
    markers.forEach((markerData) => {
      const marker = L.marker([markerData.latitude, markerData.longitude]).addTo(
        mapInstanceRef.current!
      );

      if (markerData.popup) {
        marker.bindPopup(markerData.popup);
      }

      if (markerData.title) {
        marker.bindTooltip(markerData.title);
      }

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(markerData.id));
      }

      markersRef.current.push(marker);
    });

    // Se ci sono markers, adatta la vista
    if (markers.length > 1) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.latitude, m.longitude])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, onMarkerClick]);

  // Geolocalizzazione utente
  useEffect(() => {
    if (!showUserLocation || !mapInstanceRef.current) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Icona personalizzata per la posizione utente
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div class="relative">
                <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                <div class="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current!)
            .bindTooltip('La tua posizione');
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, [showUserLocation]);

  return (
    <div
      ref={mapRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height, width: '100%' }}
    />
  );
}

// ============================================
// STATIC MAP COMPONENT (per preview)
// ============================================

interface StaticMapProps {
  latitude: number;
  longitude: number;
  height?: string;
  className?: string;
}

export function StaticMap({
  latitude,
  longitude,
  height = '200px',
  className = '',
}: StaticMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    }).setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}
