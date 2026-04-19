'use client';

import { useState, useEffect } from 'react';

interface LocationSuggestion {
  id: string;
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
  placeType?: string;
  place_id?: string;
  lat?: number;
  lng?: number;
}

interface MapPreviewProps {
  destination: string;
  selectedLocation?: LocationSuggestion;
}

export default function MapPreview({ destination, selectedLocation }: MapPreviewProps) {
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only show map if we have valid coordinates
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      setMapUrl('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const generateMapUrl = async () => {
      try {
        const lat = parseFloat(selectedLocation.lat?.toString() || '0');
        const lng = parseFloat(selectedLocation.lng?.toString() || '0');

        // Validate coordinates
        if (isNaN(lat) || isNaN(lng)) {
          setError('Invalid coordinates');
          setIsLoading(false);
          return;
        }

        const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        let staticMapUrl: string;

        if (googleApiKey && googleApiKey.length > 0) {
          // Google Static Maps API
          const params = new URLSearchParams({
            center: `${lat},${lng}`,
            zoom: '12',
            size: '600x300',
            scale: '2',
            maptype: 'roadmap',
            markers: `color:0x3b82f6|${lat},${lng}`,
            key: googleApiKey
          });
          staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?${params}`;
        } else {
          // Fallback to OSM Static Map
          staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=12&size=600x300&markers=${lat},${lng},blue`;
        }

        setMapUrl(staticMapUrl);
      } catch (err) {
        console.error('Map generation error:', err);
        setError('Unable to load map');
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(generateMapUrl, 300);
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(prev => {
        if (prev) {
          setError('Map preview timed out');
          return false;
        }
        return prev;
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(fallbackTimeout);
    };
  }, [selectedLocation]);

  // Don't show map section if no location is selected
  if (!selectedLocation?.lat || !selectedLocation?.lng) {
    return null;
  }

  return (
    <div className="glass-card p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🗺️</span> Destination Map
      </h3>

      {isLoading ? (
        <div className="aspect-video bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-slate-400">Loading map...</p>
          </div>
        </div>
      ) : error ? (
        <div className="aspect-video bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl flex items-center justify-center border border-red-500/30">
          <div className="text-center">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-red-300 mt-1">{error}</p>
          </div>
        </div>
      ) : mapUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <img
            src={mapUrl}
            alt={`Map of ${destination}`}
            className="w-full h-full object-cover"
            onError={() => {
              setError('Map failed to load');
              setIsLoading(false);
            }}
            onLoad={() => setIsLoading(false)}
          />
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1 text-xs text-slate-200">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Map Preview
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl flex items-center justify-center border border-white/10">
          <div className="text-center">
            <svg className="w-12 h-12 text-slate-500/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-xs text-slate-500">No map available</p>
          </div>
        </div>
      )}
    </div>
  );
}

