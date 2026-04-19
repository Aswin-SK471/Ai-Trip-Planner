'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FlightCard from '@/components/FlightCard';
import LocationSearch from '@/components/LocationSearch';
import SwapButton from '@/components/SwapButton';
import DateRangePicker from '@/components/DateRangePicker';
import PassengerSelector from '@/components/PassengerSelector';
import BudgetSlider from '@/components/BudgetSlider';
import TripSummaryCard from '@/components/TripSummaryCard';
import MapPreview from '@/components/MapPreview';
import DestinationInsights from '@/components/DestinationInsights';
import InterestsSelector from '@/components/InterestsSelector';
import SkeletonLoader from '@/components/SkeletonLoader';
import ErrorState from '@/components/ErrorState';
import HotelsFilter, { Hotel } from '@/components/HotelsFilter';
import ItineraryOptions from '@/components/ItineraryOptions';
import PremiumItinerary from '@/components/PremiumItinerary';
import { generateItinerary, ItineraryOption, ItineraryResponse } from '@/lib/aiPlanner';

interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
}

interface SelectedLocation {
  displayName: string;
  city?: string;
  country?: string;
  iata?: string;
  lat?: number;
  lng?: number;
}

export default function CreateTripPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [itineraryResponse, setItineraryResponse] = useState<ItineraryResponse | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryOption | null>(null);

  const router = useRouter();
  const [savingTrip, setSavingTrip] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const hotelsRef = useRef<HTMLDivElement>(null);
  const itinerariesRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    budget: 500,
    tripType: 'round-trip' as 'round-trip' | 'one-way',
    interests: [] as string[],
  });

  const [selectedDestination, setSelectedDestination] = useState<SelectedLocation | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<SelectedLocation | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form handlers
  const handleDestinationChange = (value: string, suggestion?: any) => {
    setFormData({ ...formData, destination: value });
    if (suggestion) {
      setSelectedDestination({
        displayName: suggestion.displayName,
        city: suggestion.city,
        country: suggestion.country,
        iata: suggestion.iata,
        lat: suggestion.lat,
        lng: suggestion.lng,
      });
    }
    if (validationErrors.destination) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n.destination;
        return n;
      });
    }
  };

  const handleOriginChange = (value: string, suggestion?: any) => {
    setFormData({ ...formData, origin: value });
    if (suggestion) {
      setSelectedOrigin({
        displayName: suggestion.displayName,
        city: suggestion.city,
        country: suggestion.country,
        iata: suggestion.iata,
        lat: suggestion.lat,
        lng: suggestion.lng,
      });
    }
    if (validationErrors.origin) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n.origin;
        return n;
      });
    }
  };

  const handleSwap = () => {
    setFormData({
      ...formData,
      origin: formData.destination,
      destination: formData.origin,
    });
    const tempDest = selectedDestination;
    setSelectedDestination(selectedOrigin);
    setSelectedOrigin(tempDest);
  };

  const handlePassengersChange = (adults: number, children: number, infants: number) => {
    setFormData({ ...formData, adults, children, infants });
  };

  const handleBudgetChange = (budget: string) => {
    setFormData({ ...formData, budget: parseInt(budget) || 0 });
  };

  const handleInterestsChange = (interests: string[]) => {
    setFormData({ ...formData, interests });
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setFormData({ ...formData, startDate, endDate });
    if (validationErrors.startDate || validationErrors.endDate) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n.startDate;
        delete n.endDate;
        return n;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.origin.trim()) {
      errors.origin = 'Origin is required';
    } else if (!selectedOrigin?.iata) {
      errors.origin = 'Please select a valid location from the dropdown';
    }

    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    } else if (!selectedDestination?.iata) {
      errors.destination = 'Please select a valid location from the dropdown';
    }

    if (!formData.startDate) errors.startDate = 'Departure date is required';
    if (formData.tripType === 'round-trip' && !formData.endDate) errors.endDate = 'Return date is required';
    if (formData.adults < 1) errors.adults = 'At least 1 adult is required';
    if (formData.budget <= 0) errors.budget = 'Budget must be greater than 0';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setFlights([]);
    setSelectedFlight(null);
    setSelectedHotel(null);
    setItineraryResponse(null);
    setSelectedItinerary(null);
    setFlightError(null);

    try {
      const cleanOrigin = selectedOrigin?.iata || formData.origin.trim();
      const cleanDestination = selectedDestination?.iata || formData.destination.trim();

      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: cleanOrigin,
          destination: cleanDestination,
          departureDate: formData.startDate,
          returnDate: formData.endDate || undefined,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          budget: formData.budget,
          tripType: formData.tripType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to search flights');
      }

      const data = await response.json();
      setFlights(data.flights || []);

      if (!data.flights || data.flights.length === 0) {
        setFlightError('No flights found. Try adjusting your criteria.');
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      setFlightError(error instanceof Error ? error.message : 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelection = (flight: Flight) => {
    setSelectedFlight(flight);
    setSelectedHotel(null);
    setItineraryResponse(null);
    setSelectedItinerary(null);
    setTimeout(() => hotelsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleHotelSelection = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setItineraryResponse(null);
    setSelectedItinerary(null);
    setTimeout(() => itinerariesRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleGenerateItineraries = async () => {
    if (!selectedFlight) return;

    setGeneratingItinerary(true);
    setItineraryResponse(null);
    setSelectedItinerary(null);

    try {
      const result = await generateItinerary({
        origin: formData.origin,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        passengers: {
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
        },
        interests: formData.interests,
      });

      setItineraryResponse(result);

      setTimeout(() => {
        itinerariesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setGeneratingItinerary(false);
    }
  };

  const handleItinerarySelection = (option: ItineraryOption) => {
    setSelectedItinerary(option);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveTrip = async () => {
    if (!selectedFlight || !selectedItinerary || !selectedHotel) return;
    setSavingTrip(true);
    setSaveError(null);

    try {
        const response = await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                origin: formData.origin,
                destination: formData.destination,
                start_date: formData.startDate,
                end_date: formData.endDate,
                budget: formData.budget,
                flight_json: selectedFlight,
                hotel_json: selectedHotel,
                itinerary_json: selectedItinerary,
                passengers: {
                    adults: formData.adults,
                    children: formData.children,
                    infants: formData.infants
                }
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to save trip');
        }

        router.push('/dashboard');
    } catch(err: any) {
        setSaveError(err.message);
    } finally {
        setSavingTrip(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-blue)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--accent-purple)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Create Your Trip</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            Plan your perfect journey: search flights, choose hotels, and explore personalized itineraries
          </p>
        </div>

        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative glass-card p-8 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Search Flights</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">From</label>
                      <LocationSearch
                        value={formData.origin}
                        onChange={handleOriginChange}
                        onSelect={(suggestion) => setSelectedOrigin({
                          displayName: suggestion.displayName,
                          city: suggestion.city,
                          country: suggestion.country,
                          iata: suggestion.iata,
                          lat: suggestion.lat,
                          lng: suggestion.lng,
                        })}
                        placeholder="Departure city or airport"
                        className={validationErrors.origin ? 'ring-1 ring-red-400/50 rounded-xl' : ''}
                      />
                      {validationErrors.origin && (
                        <p className="text-xs text-red-400 mt-1">{validationErrors.origin}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">To</label>
                      <LocationSearch
                        value={formData.destination}
                        onChange={handleDestinationChange}
                        onSelect={(suggestion) => setSelectedDestination({
                          displayName: suggestion.displayName,
                          city: suggestion.city,
                          country: suggestion.country,
                          iata: suggestion.iata,
                          lat: suggestion.lat,
                          lng: suggestion.lng,
                        })}
                        placeholder="Destination city or airport"
                        className={validationErrors.destination ? 'ring-1 ring-red-400/50 rounded-xl' : ''}
                      />
                      {validationErrors.destination && (
                        <p className="text-xs text-red-400 mt-1">{validationErrors.destination}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <SwapButton onSwap={handleSwap} disabled={loading} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Dates</label>
                      <DateRangePicker
                        startDate={formData.startDate}
                        endDate={formData.endDate}
                        onChange={handleDateRangeChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Passengers</label>
                      <PassengerSelector
                        adults={formData.adults}
                        children={formData.children}
                        infants={formData.infants}
                        onChange={handlePassengersChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Budget per person</label>
                      <BudgetSlider value={formData.budget.toString()} onChange={handleBudgetChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Interests (for itinerary)</label>
                      <InterestsSelector
                        selectedInterests={formData.interests}
                        onChange={handleInterestsChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gradient py-4 px-6 font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <span>Search Flights</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {(loading || flights.length > 0 || flightError) && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">
                  {loading ? 'Searching...' : flightError ? 'Error' : `Flights (${flights.length})`}
                </h3>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonLoader key={i} variant="flight" />)
                  ) : flightError ? (
                    <ErrorState
                      title="Search Failed"
                      message={flightError}
                      onRetry={() => handleSubmit(new Event('submit') as any)}
                    />
                  ) : flights.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No flights found. Try different dates.</p>
                    </div>
                  ) : (
                    flights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        airline={flight.airline}
                        price={flight.price}
                        duration={flight.duration}
                        departure={flight.departure}
                        arrival={flight.arrival}
                        isSelected={selectedFlight?.id === flight.id}
                        onSelect={() => handleFlightSelection(flight)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <TripSummaryCard
                origin={formData.origin}
                destination={formData.destination}
                startDate={formData.startDate}
                endDate={formData.endDate}
                adults={formData.adults}
                children={formData.children}
                infants={formData.infants}
                budget={formData.budget.toString()}
              />
              {selectedDestination && (
                <div className="mt-6">
                  <MapPreview destination={formData.destination} selectedLocation={selectedDestination as any} />
                </div>
              )}
              {formData.destination && (
                <div className="mt-6">
                  <DestinationInsights destination={formData.destination} />
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedFlight && (
          <div ref={hotelsRef} className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Stay</h2>
            <p className="text-slate-400 mb-8">Select a hotel that fits your style and budget</p>
            <HotelsFilter
              destination={formData.destination}
              onSelectHotel={handleHotelSelection}
              selectedHotel={selectedHotel ?? undefined}
              budget={formData.budget}
            />
          </div>
        )}

        {selectedFlight && selectedHotel && (
          <div ref={itinerariesRef} className="mt-16 pt-12 border-t border-white/10">
            {!itineraryResponse ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-white mb-4">Ready for your itinerary?</h3>
                <p className="text-slate-400 mb-8">We will create multiple personalized itinerary options based on your interests</p>
                <button
                  onClick={handleGenerateItineraries}
                  disabled={generatingItinerary}
                  className="btn-gradient px-8 py-4 font-semibold inline-flex items-center gap-2"
                >
                  {generatingItinerary ? (
                    <>
                      <div className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span>Generate Itineraries</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <ItineraryOptions
                options={itineraryResponse.options}
                onSelectOption={handleItinerarySelection}
                selectedOption={selectedItinerary ?? undefined}
              />
            )}
          </div>
        )}

        {selectedItinerary && (
          <div ref={resultRef} className="mt-16 pt-12 border-t border-white/10">
            <PremiumItinerary itinerary={selectedItinerary} />
            
            <div className="mt-12 flex flex-col items-center justify-center">
              {saveError && <p className="text-red-400 mb-4">{saveError}</p>}
              <button
                onClick={handleSaveTrip}
                disabled={savingTrip}
                className="btn-gradient px-12 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 shadow-2xl hover:scale-[1.02] transition-all"
              >
                {savingTrip ? (
                  <>
                    <div className="animate-spin border-2 border-white/30 border-t-white rounded-full w-6 h-6"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    <span>Save to My Trips</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
