interface FlightCardProps {
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  stops?: number;
  type?: string;
  onSelect: () => void;
  isSelected?: boolean;
}

export default function FlightCard({ 
  airline, 
  price, 
  duration, 
  departure, 
  arrival, 
  stops = 0,
  type = 'Outbound',
  onSelect,
  isSelected = false
}: FlightCardProps) {
  const departureTime = new Date(departure).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const arrivalTime = new Date(arrival).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const departureDate = new Date(departure).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const isReturn = type === 'Return';

  // Get airline logo (simplified - in production you'd use a real airline logo service)
  const getAirlineLogo = (airline: string) => {
    const logos: Record<string, string> = {
      'American Airlines': 'AA',
      'Delta': 'DL',
      'United': 'UA',
      'Southwest': 'WN',
      'JetBlue': 'B6',
      'Alaska': 'AS',
      'Spirit': 'NK',
      'Frontier': 'F9',
      'British Airways': 'BA',
      'Lufthansa': 'LH',
      'Air France': 'AF',
      'KLM': 'KL',
      'Emirates': 'EK',
      'Qatar': 'QR',
      'Etihad': 'EY',
      'Singapore': 'SQ',
      'Cathay Pacific': 'CX',
      'Japan Airlines': 'JL',
      'ANA': 'NH',
      'Air India': 'AI',
      'IndiGo': '6E',
      'SpiceJet': 'SG',
      'Vistara': 'UK',
    };
    return logos[airline] || airline.substring(0, 2).toUpperCase();
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'glass-card border-blue-400/60 bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-2 ring-blue-400/50 scale-[1.02] shadow-2xl'
          : 'glass-card hover:border-blue-400/40 hover:shadow-xl hover:bg-white/10 hover:scale-[1.01]'
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-purple-500"></div>

      <div className="relative z-10">
        {/* Header: Airline + Price + Type Badge */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Airline Logo */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {getAirlineLogo(airline)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                {airline}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{stops === 0 ? 'Non-stop' : stops === 1 ? '1 Stop' : `${stops} Stops`}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isReturn ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {type}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">${price}</div>
            <div className="text-xs text-slate-400">per person</div>
          </div>
        </div>

        {/* Flight times and route */}
        <div className="space-y-3 mb-5">
          {/* Departure */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Departure</p>
              <p className="text-base font-semibold text-white">{departureTime}</p>
              <p className="text-xs text-slate-400">{departureDate}</p>
            </div>
            {/* Flight icon */}
            <div className="flex-shrink-0 px-4">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {/* Arrival */}
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Arrival</p>
              <p className="text-base font-semibold text-white">{arrivalTime}</p>
              <p className="text-xs text-slate-400">{departureDate}</p>
            </div>
          </div>
        </div>

        {/* Duration and details */}
        <div className="flex items-center justify-between py-3 px-3 bg-white/5 rounded-lg mb-5 border border-white/10">
          <span className="text-sm font-medium text-slate-300">{duration}</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-300">
            ✓ Available
          </span>
        </div>

        {/* Select Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            isSelected
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 border border-blue-400/30 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/50'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select Flight'}
        </button>
      </div>

      {/* Selection indicator badge */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
