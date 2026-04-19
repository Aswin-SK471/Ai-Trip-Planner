'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  selectedFlight: {
    airline: string;
    price: number;
    duration: string;
    departure: string;
    arrival: string;
  };
  itinerary: {
    days: Array<{
      day: number;
      activities: string[];
    }>;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Fetch trips from API
    const fetchTrips = async () => {
      setTripsLoading(true);
      try {
        const response = await fetch('/api/trips');
        const result = await response.json();
        
        if (result.success) {
          setTrips(result.trips);
        } else {
          console.error('Failed to fetch trips:', result.error);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setTripsLoading(false);
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [router]);

  if (isLoading) {
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
          <p className="text-xl font-medium animate-pulse">Loading dashboard...</p>
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
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white text-center">
            My Trips
          </h1>
          <p className="mt-2 text-center text-slate-400">
            Manage and plan your travel adventures
          </p>
        </div>

        <div className="mb-12 text-center">
          <button
            onClick={() => router.push('/create-trip')}
            className="btn-gradient inline-flex justify-center py-3 px-8 text-base shadow-lg"
          >
            Create Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto glass-card p-10 border border-white/10 rounded-2xl">
              <svg className="mx-auto h-24 w-24 text-slate-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">No trips yet</h3>
              <p className="text-slate-400 mb-8">Start planning your adventure by creating your first trip.</p>
              <button
                onClick={() => router.push('/create-trip')}
                className="btn-outline px-6 py-3 border border-white/20 text-white w-full"
              >
                Create your first trip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="glass-card rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 border border-white/10 group">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {trip.destination}
                    </h3>
                    <div className="flex items-center text-sm text-slate-400 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m0 0-2h1m-6 0l-4 4m0 4 4h6m-6 0h6a2 2 0 012 4 012-4 4-4-4-4 4z"></path>
                      </svg>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {trip.selectedFlight.airline}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-5">
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">${trip.budget.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Total budget</p>
                    </div>
                    
                    <button
                      onClick={() => router.push(`/trip/${trip.id}`)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 transition-colors"
                    >
                      View Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
