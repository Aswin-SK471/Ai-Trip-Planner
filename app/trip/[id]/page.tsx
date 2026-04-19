'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FlightCard from '@/components/FlightCard';
import PremiumItinerary from '@/components/PremiumItinerary';
import HotelSuggestions from '@/components/HotelSuggestions';
import TripMap from '@/components/TripMap';
import { exportTripToPDF, downloadTripJSON, TripData } from '@/lib/exportTrip';

interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
}

interface ItineraryData {
  days: Array<{
    day: number;
    activities: string[];
  }>;
}

interface Trip {
  id: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  selectedFlight: {
    id: string;
    airline: string;
    price: number;
    duration: string;
    departure: string;
    arrival: string;
  };
  selectedHotel?: any;
  itinerary?: any;
  createdAt: string;
}

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch('/api/trips');
        const result = await response.json();
        
        if (result.success) {
          const foundTrip = result.trips.find((t: Trip) => t.id === tripId);
          if (foundTrip) {
            setTrip(foundTrip);
            setSelectedHotel(foundTrip.selectedHotel || null);
          } else {
            setLoading(false);
          }
        } else {
          console.error('Failed to fetch trips:', result.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleHotelSelect = (hotel: any) => {
    setSelectedHotel(hotel);
    // TODO: Update trip in database
  };

  const handleShareTrip = async () => {
    const shareUrl = `${window.location.origin}/trip/${tripId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMessage('Link copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      setToastMessage('Failed to copy link');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleExportPDF = () => {
    if (!trip) return;
    
    const tripData: TripData = {
      id: trip.id,
      title: `Trip to ${trip.destination}`,
      origin: trip.origin || 'Origin',
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      passengers: trip.passengers,
      selectedFlight: trip.selectedFlight,
      selectedHotel: selectedHotel,
      itinerary: trip.itinerary,
      createdAt: trip.createdAt
    };
    
    exportTripToPDF(tripData);
  };

  const handleDownloadJSON = () => {
    if (!trip) return;
    
    const tripData: TripData = {
      id: trip.id,
      title: `Trip to ${trip.destination}`,
      origin: trip.origin || 'Origin',
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      passengers: trip.passengers,
      selectedFlight: trip.selectedFlight,
      selectedHotel: selectedHotel,
      itinerary: trip.itinerary,
      createdAt: trip.createdAt
    };
    
    downloadTripJSON(tripData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl animate-blob" style={{ background: 'var(--accent-blue)' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl animate-blob" style={{ background: 'var(--accent-purple)', animationDelay: '2s' }} />
        </div>
        <div className="text-slate-400 relative z-10 flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8 018 0 018-8 018-8-8-8zm-1 0a1 1 0 011 1 011 0 011-1 1-1-1 1-1-1z"></path>
          </svg>
          <p className="text-xl font-medium animate-pulse">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl animate-blob" style={{ background: 'var(--accent-blue)' }} />
        </div>
        <div className="text-center relative z-10 glass-card p-10 border border-white/10 max-w-lg w-full mx-4">
          <svg className="mx-auto h-20 w-20 text-slate-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-3xl font-bold text-white mb-4">Trip Not Found</h2>
          <p className="text-slate-400 mb-8 text-lg">The trip you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-outline w-full justify-center py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20" style={{ background: 'var(--gradient-hero)' }}>
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] animate-blob" style={{ background: 'var(--accent-cyan)' }} />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] animate-blob" style={{ background: 'var(--accent-purple)', animationDelay: '2s' }} />
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-5 blur-[120px] animate-blob" style={{ background: 'var(--accent-blue)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur text-white px-6 py-3 rounded-xl shadow-2xl flex items-center border border-green-400/50 animate-fade-in-up">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {toastMessage}
          </div>
        )}

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all focus:outline-none"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Trip Summary */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 border border-white/10">
          <h1 className="text-4xl font-bold text-white mb-6">
            Trip to <span className="gradient-text">{trip.destination}</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Travel Dates</p>
              <p className="font-semibold text-white whitespace-nowrap">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Passengers</p>
              <p className="font-semibold text-white whitespace-nowrap">
                {trip.passengers.adults} Adults
                {trip.passengers.children > 0 && `, ${trip.passengers.children} Children`}
                {trip.passengers.infants > 0 && `, ${trip.passengers.infants} Infants`}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-blue-400 leading-none">${trip.budget.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Generated On</p>
              <p className="font-semibold text-slate-300">{new Date(trip.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Selected Flight */}
        {trip.selectedFlight && (
          <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Selected Flight
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="transform scale-[0.98] hover:scale-100 transition-transform origin-top-left">
                <FlightCard
                  airline={trip.selectedFlight.airline}
                  price={trip.selectedFlight.price}
                  duration={trip.selectedFlight.duration}
                  departure={trip.selectedFlight.departure}
                  arrival={trip.selectedFlight.arrival}
                  onSelect={() => {}}
                />
              </div>
              <div className="flex flex-col justify-center space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-sm text-slate-400 uppercase tracking-wider">Flight Logistics</p>
                <div className="space-y-4 mt-2">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-semibold text-white">{trip.selectedFlight.duration}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-slate-400">Departure</span>
                    <span className="font-semibold text-white">{new Date(trip.selectedFlight.departure).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-400">Arrival</span>
                    <span className="font-semibold text-white">{new Date(trip.selectedFlight.arrival).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotel Suggestions */}
        <div className="mb-8">
          <HotelSuggestions
            destination={trip.destination}
            budget={trip.budget}
            nights={Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
            onHotelSelect={handleHotelSelect}
            selectedHotel={selectedHotel}
          />
        </div>

        {/* Trip Map */}
        <div className="mb-8">
          <TripMap
            origin={trip.origin || 'Origin'}
            destination={trip.destination}
            originCoords={{ lat: 48.8566, lon: 2.3522 }} // Paris coordinates as example
            destinationCoords={{ lat: 51.5074, lon: -0.1278 }} // London coordinates as example
          />
        </div>

        {/* Premium Itinerary */}
        {trip.itinerary && (
          <div className="mb-8">
            <PremiumItinerary
              itinerary={trip.itinerary}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            Trip Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExportPDF}
              className="btn-gradient px-6 py-3 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Trip (PDF)
            </button>
            
            <button
              onClick={handleShareTrip}
              className="btn-outline px-6 py-3 flex items-center bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"></path>
              </svg>
              Share Trip
            </button>
            
            <button
              onClick={handleDownloadJSON}
              className="btn-outline px-6 py-3 flex items-center bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
