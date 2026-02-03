import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

// --- Fix Leaflet Default Icon ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OpenMapProps {
    venue: string;
    address?: string;
    onLocationSelect?: (address: string) => void;
}

// --- CSS for High Contrast Search ---
const CustomSearchStyles = () => (
  <style>{`
    .leaflet-control-geosearch form {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 2px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .leaflet-control-geosearch form input {
      color: #111827 !important;
      font-size: 14px;
      padding: 8px;
      outline: none;
    }
    .leaflet-control-geosearch .results {
      background: #ffffff !important;
      margin-top: 4px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      width: 100%;
      max-width: 300px;
    }
    .leaflet-control-geosearch .results > * {
      background-color: white;
      color: #1f2937 !important;
      padding: 10px 12px !important;
      border-bottom: 1px solid #f3f4f6;
      font-size: 13px;
      cursor: pointer;
    }
    .leaflet-control-geosearch .results > :hover,
    .leaflet-control-geosearch .results > .active {
      background-color: #f3f4f6 !important;
      color: #000000 !important;
      font-weight: 600;
      border-left: 3px solid #b91c1c;
    }
    /* Hide the default Leaflet Prefix just in case */
    .leaflet-control-attribution a:first-child {
       display: inline;
    }
    /* Ensure popup text is visible */
    .leaflet-popup-content-wrapper {
      background: white !important;
      color: #1f2937 !important;
    }
    .leaflet-popup-content {
      color: #1f2937 !important;
    }
    .leaflet-popup-content a {
      color: #ffffff !important;
      font-weight: 700 !important;
      text-decoration: none !important;
    }
  `}</style>
);

// --- HELPER: Fixes "Grey Map" issues by forcing a resize ---
const MapReSizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500); // Wait 500ms for container to settle then force redraw
  }, [map]);
  return null;
};

// --- COMPONENT: Search Bar ---
const SearchField = ({ onLocationSelect }: { onLocationSelect?: (address: string) => void }) => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Search address...',
    });
    
    const handleLocationFound = (e: any) => {
      if (onLocationSelect && e.location) {
        onLocationSelect(e.location.label);
      }
    };

    map.addControl(searchControl);
    map.on('geosearch/showlocation', handleLocationFound);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleLocationFound);
    };
  }, [map, onLocationSelect]);
  return null;
};

// --- COMPONENT: Moves the map when Venue changes ---
const MapController = ({ coords, directionsUrl }: { coords: { lat: number, lng: number } | null; directionsUrl: string }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView([coords.lat, coords.lng], 13); // Changed from flyTo to setView for stability
        }
    }, [coords, map]);

    return coords ? (
        <Marker position={[coords.lat, coords.lng]}>
             <Popup>
                <div className="text-center">
                    <p className="mb-2 font-semibold text-gray-800">Venue Location</p>
                    <a 
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors text-sm shadow-md border border-blue-700"
                        style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                        Get Directions
                    </a>
                </div>
             </Popup>
        </Marker>
    ) : null;
}

export const OpenMap: React.FC<OpenMapProps> = ({ venue, address, onLocationSelect }) => {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Generate Google Maps directions URL: use address if available, fallback to venue
    const directionsUrl = useMemo(() => {
        const location = address || venue;
        if (!location) return '#';
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    }, [address, venue]);

    // Geocoding Logic
    useEffect(() => {
        if (!venue) return;
        const fetchCoordinates = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(venue)}`
                );
                const data = await response.json();
                if (data && data.length > 0) {
                    setCoords({
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon)
                    });
                }
            } catch (error) {
                console.warn("Geocoding failed:", venue);
            }
        };
        const timer = setTimeout(() => fetchCoordinates(), 800);
        return () => clearTimeout(timer);
    }, [venue]);

    const center = coords || { lat: 51.505, lng: -0.09 };

    return (
        <div className="w-full h-full relative isolate">
            <CustomSearchStyles />
            <MapContainer 
                center={center} 
                zoom={13} 
                scrollWheelZoom={false} 
                className="w-full h-full z-0"
                attributionControl={false} // 1. Disable Default Control
            >
                {/* 2. Custom Attribution: Prefix="" hides "Leaflet" */}
                <AttributionControl position="bottomright" prefix="" />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <SearchField onLocationSelect={onLocationSelect} />
                <MapController coords={coords} directionsUrl={directionsUrl} />
                <MapReSizer /> {/* 3. Triggers the fix for grey/broken maps */}

            </MapContainer>
        </div>
    );
};