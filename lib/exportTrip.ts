import { ItineraryOption } from './aiPlanner';

interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
}

export interface TripData {
  id: string;
  title: string;
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
  selectedFlight?: Flight;
  selectedHotel?: any;
  itinerary?: ItineraryOption;
  createdAt: string;
}

export function exportTripToPDF(tripData: TripData): void {
  const html = generatePrintableHTML(tripData);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export your trip');
    return;
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for the content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
}

export function downloadTripJSON(tripData: TripData): void {
  const jsonString = JSON.stringify(tripData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `trip-${tripData.id}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

function generatePrintableHTML(tripData: TripData): string {
  const tripDays = tripData.itinerary?.days || [];
  const budgetAllocation = tripData.itinerary?.budgetAllocation;
  const tripScore = tripData.itinerary?.tripScore;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip Itinerary - ${tripData.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 2em;
        }
        .header p {
            color: #6b7280;
            margin: 5px 0;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .trip-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .info-item {
            padding: 10px;
            background: #f9fafb;
            border-radius: 6px;
        }
        .info-item strong {
            color: #374151;
            display: block;
            margin-bottom: 5px;
        }
        .flight-card, .hotel-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background: #f9fafb;
        }
        .day-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin: 15px 0;
            overflow: hidden;
        }
        .day-header {
            background: #3b82f6;
            color: white;
            padding: 15px;
            font-weight: bold;
        }
        .day-content {
            padding: 15px;
        }
        .activity {
            border-left: 4px solid #3b82f6;
            padding: 10px 15px;
            margin: 10px 0;
            background: #f9fafb;
        }
        .activity-time {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .budget-allocation {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .budget-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        .budget-item strong {
            display: block;
            font-size: 1.2em;
            color: #1e40af;
        }
        .score {
            text-align: center;
            font-size: 1.5em;
            font-weight: bold;
            color: #1e40af;
            margin: 20px 0;
        }
        @media print {
            body { margin: 0; }
            .section { break-inside: avoid; }
            .day-card { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Trip Itinerary</h1>
        <p>${tripData.title}</p>
        <p>Generated on ${new Date(tripData.createdAt).toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>Trip Summary</h2>
        <div class="trip-info">
            <div class="info-item">
                <strong>Origin</strong>
                ${tripData.origin}
            </div>
            <div class="info-item">
                <strong>Destination</strong>
                ${tripData.destination}
            </div>
            <div class="info-item">
                <strong>Start Date</strong>
                ${new Date(tripData.startDate).toLocaleDateString()}
            </div>
            <div class="info-item">
                <strong>End Date</strong>
                ${new Date(tripData.endDate).toLocaleDateString()}
            </div>
            <div class="info-item">
                <strong>Total Budget</strong>
                $${tripData.budget.toLocaleString()}
            </div>
            <div class="info-item">
                <strong>Passengers</strong>
                ${tripData.passengers.adults} Adults${tripData.passengers.children > 0 ? `, ${tripData.passengers.children} Children` : ''}${tripData.passengers.infants > 0 ? `, ${tripData.passengers.infants} Infants` : ''}
            </div>
        </div>
    </div>

    ${tripData.selectedFlight ? `
    <div class="section">
        <h2>Flight Details</h2>
        <div class="flight-card">
            <p><strong>Airline:</strong> ${tripData.selectedFlight.airline}</p>
            <p><strong>Price:</strong> $${tripData.selectedFlight.price}</p>
            <p><strong>Duration:</strong> ${tripData.selectedFlight.duration}</p>
            <p><strong>Departure:</strong> ${new Date(tripData.selectedFlight.departure).toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${new Date(tripData.selectedFlight.arrival).toLocaleString()}</p>
        </div>
    </div>
    ` : ''}

    ${tripData.selectedHotel ? `
    <div class="section">
        <h2>Hotel Details</h2>
        <div class="hotel-card">
            <p><strong>Hotel:</strong> ${tripData.selectedHotel.name}</p>
            <p><strong>Area:</strong> ${tripData.selectedHotel.area}</p>
            <p><strong>Price per Night:</strong> $${tripData.selectedHotel.pricePerNight}</p>
            <p><strong>Rating:</strong> ${tripData.selectedHotel.rating} stars</p>
            <p><strong>Amenities:</strong> ${tripData.selectedHotel.amenities.join(', ')}</p>
        </div>
    </div>
    ` : ''}

    ${tripDays.length > 0 ? `
    <div class="section">
        <h2>Detailed Itinerary</h2>
        ${tripDays.map(day => `
            <div class="day-card">
                <div class="day-header">
                    Day ${day.day}: ${day.title}
                </div>
                <div class="day-content">
                    ${day.activities.map(activity => `
                        <div class="activity">
                            <div class="activity-time">${activity.time}</div>
                            <p>${activity.activity}</p>
                            ${activity.duration ? `<p><strong>Duration:</strong> ${activity.duration} hours</p>` : ''}
                            ${activity.cost ? `<p><strong>Cost:</strong> $${activity.cost}</p>` : ''}
                            ${activity.type ? `<p><strong>Type:</strong> ${activity.type}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${budgetAllocation ? `
    <div class="section">
        <h2>Budget Allocation</h2>
        <div class="budget-allocation">
            <div class="budget-item">
                <strong>$${budgetAllocation.flights.toLocaleString()}</strong>
                Flights
            </div>
            <div class="budget-item">
                <strong>$${budgetAllocation.hotels.toLocaleString()}</strong>
                Hotels
            </div>
            <div class="budget-item">
                <strong>$${budgetAllocation.activities.toLocaleString()}</strong>
                Activities
            </div>
            <div class="budget-item">
                <strong>$${budgetAllocation.food.toLocaleString()}</strong>
                Food
            </div>
        </div>
    </div>
    ` : ''}

    ${tripScore ? `
    <div class="section">
        <h2>Trip Score</h2>
        <div class="score">
            Overall Score: ${tripScore.overall.toFixed(1)}/10
        </div>
        <div class="trip-info">
            <div class="info-item">
                <strong>Budget Fit</strong>
                ${tripScore.budgetFit.toFixed(1)}/10
            </div>
            <div class="info-item">
                <strong>Activity Density</strong>
                ${tripScore.activityDensity.toFixed(1)}/10
            </div>
        </div>
    </div>
    ` : ''}
</body>
</html>
  `;
}
