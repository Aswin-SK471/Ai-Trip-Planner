'use client';

import { useState, useEffect } from 'react';

interface TripMapProps {
  origin: string;
  destination: string;
  originCoords?: { lat: number; lon: number };
  destinationCoords?: { lat: number; lon: number };
}

export default function TripMap({ 
  origin, 
  destination, 
  originCoords, 
  destinationCoords 
}: TripMapProps) {
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originCoords || !destinationCoords) {
      setMapUrl('');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a bounding box that includes both points
      const minLat = Math.min(originCoords.lat, destinationCoords.lat);
      const maxLat = Math.max(originCoords.lat, destinationCoords.lat);
      const minLon = Math.min(originCoords.lon, destinationCoords.lon);
      const maxLon = Math.max(originCoords.lon, destinationCoords.lon);
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLon = (minLon + maxLon) / 2;
      
      // Calculate appropriate zoom level based on distance
      const latDiff = maxLat - minLat;
      const lonDiff = maxLon - minLon;
      const maxDiff = Math.max(latDiff, lonDiff);
      
      let zoom = 10;
      if (maxDiff > 2) zoom = 4;
      else if (maxDiff > 1) zoom = 5;
      else if (maxDiff > 0.5) zoom = 6;
      else if (maxDiff > 0.2) zoom = 7;
      else if (maxDiff > 0.1) zoom = 8;
      else if (maxDiff > 0.05) zoom = 9;
      else zoom = 11;
      
      // Build markers for origin and destination
      const markers = [
        `${originCoords.lat},${originCoords.lon},blue`,
        `${destinationCoords.lat},${destinationCoords.lon},red`
      ].join('|');
      
      // Create OpenStreetMap URL with route visualization
      const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLon}&zoom=${zoom}&size=800x400&markers=${markers}`;
      
      // Debounce the map URL update
      const timeoutId = setTimeout(() => {
        setMapUrl(staticMapUrl);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } catch (err) {
      console.error('Error generating map URL:', err);
      setError('Failed to load map');
      setIsLoading(false);
    }
  }, [originCoords, destinationCoords]);

  if (!originCoords || !destinationCoords) {
    return (
      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Trip Route Map
          </h3>
          <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              <p className="text-slate-400 text-sm">Route map will appear here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
          Trip Route Map
        </h3>
        
        {isLoading ? (
          <div className="aspect-video bg-white/5 rounded-lg animate-pulse">
            <div className="h-full flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8 018 0 018-8 018-8-8-8zm-1 0a1 1 0 011 1 011 0 011-1 1-1-1 1-1-1z"></path>
              </svg>
            </div>
          </div>
        ) : error ? (
          <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Map Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
              {mapUrl ? (
                <img
                  src={mapUrl}
                  alt={`Route map from ${origin} to ${destination}`}
                  className="w-full h-full object-cover"
                  onError={() => setError('Failed to load map')}
                  onLoad={() => setIsLoading(false)}
                />
              ) : null}
              <div className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-300 shadow">
                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                OpenStreetMap
              </div>
            </div>
            
            {/* Route Information */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div>
                  <p className="text-xs text-slate-400">Origin</p>
                  <p className="text-sm font-medium text-white truncate">{origin}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div>
                  <p className="text-xs text-slate-400">Destination</p>
                  <p className="text-sm font-medium text-white truncate">{destination}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
