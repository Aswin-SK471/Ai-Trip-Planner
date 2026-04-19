# DATASETS INCLUDED - SAMPLE & REFERENCE

## 1. AIRPORTS.JSON (Sample)

Located: `data/airports.json`

**Sample entries:**

```json
[
  {
    "city": "Chennai",
    "country": "India",
    "airport": "Chennai International",
    "iata": "MAA",
    "lat": 12.9940,
    "lng": 80.1695
  },
  {
    "city": "London",
    "country": "United Kingdom",
    "airport": "London Heathrow",
    "iata": "LHR",
    "lat": 51.4700,
    "lng": -0.4543
  },
  {
    "city": "New York",
    "country": "United States",
    "airport": "John F. Kennedy International",
    "iata": "JFK",
    "lat": 40.6413,
    "lng": -73.7781
  },
  {
    "city": "Tokyo",
    "country": "Japan",
    "airport": "Haneda Airport",
    "iata": "HND",
    "lat": 35.5494,
    "lng": 139.7798
  },
  {
    "city": "Dubai",
    "country": "United Arab Emirates",
    "airport": "Dubai International",
    "iata": "DXB",
    "lat": 25.2528,
    "lng": 55.3644
  }
]
```

**Total:** 200+ airports
**Coverage:** All continents, major cities + secondary hubs

---

## 2. LOCATIONS.JSON (Sample)

Located: `data/locations.json`

**Sample entries:**

```json
[
  {
    "name": "Chennai",
    "country": "India",
    "state": "Tamil Nadu",
    "type": "city"
  },
  {
    "name": "Mumbai",
    "country": "India",
    "state": "Maharashtra",
    "type": "city"
  },
  {
    "name": "London",
    "country": "United Kingdom",
    "state": "England",
    "type": "city"
  },
  {
    "name": "Tokyo",
    "country": "Japan",
    "state": "Tokyo",
    "type": "city"
  },
  {
    "name": "Singapore",
    "country": "Singapore",
    "state": "Singapore",
    "type": "city"
  },
  {
    "name": "India",
    "country": "India",
    "state": "Asia",
    "type": "country"
  },
  {
    "name": "United States",
    "country": "United States",
    "state": "USA",
    "type": "country"
  }
]
```

**Total:** 100+ entries (cities + countries)
**Coverage:** All continents, major destinations

---

## 3. AIRPORT IATA MAPPINGS

Using `lib/airportMapper.ts`:

```typescript
// Examples of available mappings:
getIATACode('Chennai', 'India')        // → "MAA"
getIATACode('London', 'United Kingdom') // → "LHR"
getIATACode('New York', 'United States') // → "JFK"
getIATACode('Tokyo', 'Japan')          // → "NRT" or "HND"
getIATACode('Singapore', 'Singapore')  // → "SIN"
getIATACode('Dubai', 'United Arab Emirates') // → "DXB"
getIATACode('Bangkok', 'Thailand')     // → "BKK"
getIATACode('Hong Kong', 'Hong Kong')  // → "HKG"
getIATACode('Shanghai', 'China')       // → "PVG"
getIATACode('Paris', 'France')         // → "CDG"
getIATACode('Amsterdam', 'Netherlands') // → "AMS"
```

---

## 4. SEARCH API RESPONSE

Endpoint: `/api/places?input=chen`

**Response:**

```json
{
  "success": true,
  "suggestions": [
    {
      "id": "MAA-Chennai",
      "displayName": "Chennai International",
      "city": "Chennai",
      "country": "India",
      "state": "Tamil Nadu",
      "iata": "MAA",
      "type": "airport",
      "source": "airport",
      "lat": 12.9940,
      "lng": 80.1695
    },
    {
      "id": "COK-Kochi",
      "displayName": "Cochin International",
      "city": "Kochi",
      "country": "India",
      "state": "Kerala",
      "iata": "COK",
      "type": "airport",
      "source": "airport",
      "lat": 10.1591,
      "lng": 76.4132
    },
    {
      "id": "Chennai-India",
      "displayName": "Chennai",
      "city": "Chennai",
      "country": "India",
      "state": "Tamil Nadu",
      "type": "city",
      "source": "local"
    }
  ],
  "sources": ["airport", "local"],
  "count": 3,
  "query": "chen"
}
```

---

## 5. FULL REGION COVERAGE

### Americas (40+ airports)
- New York (JFK, LGA, EWR)
- Los Angeles (LAX)
- Toronto (YYZ)
- Mexico City (MEX)
- São Paulo (GRU)
- Buenos Aires (EZE)
- Santiago (SCL)

### Europe (60+ airports)
- London (LHR, LGW)
- Paris (CDG, ORY)
- Frankfurt (FRA)
- Amsterdam (AMS)
- Berlin (BER)
- Barcelona (BCN)
- Rome (FCO)

### Asia (70+ airports)
- Tokyo (NRT, HND)
- Shanghai (PVG)
- Beijing (PEK)
- Bangkok (BKK)
- Singapore (SIN)
- Hong Kong (HKG)
- Mumbai (BOM)
- Chennai (MAA)
- Delhi (DEL)

### Middle East (15+ airports)
- Dubai (DXB)
- Doha (DOH)
- Abu Dhabi (AUH)
- Riyadh (RUH)

### Africa (15+ airports)
- Cairo (CAI)
- Johannesburg (JNB)
- Cape Town (CPT)
- Lagos (LOS)

### Australia/Oceania (10+ airports)
- Sydney (SYD)
- Melbourne (MEL)
- Brisbane (BNE)
- Auckland (AKL)

---

## 6. CITY DATABASE

### India (8+ cities)
New Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Jaipur, Kochi

### USA (15+ cities)
New York, Los Angeles, Chicago, Dallas, Denver, San Francisco, Miami, Boston, Seattle, Atlanta, etc.

### Europe (25+ cities)
London, Paris, Barcelona, Madrid, Rome, Venice, Florence, Milan, Amsterdam, Berlin, Munich, Vienna, Czech Republic, etc.

### Asia (20+ cities)
Tokyo, Osaka, Shanghai, Beijing, Bangkok, Singapore, Hong Kong, Seoul, Manila, Kuala Lumpur, etc.

### Australia/NZ (4+ cities)
Sydney, Melbourne, Brisbane, Auckland

### Americas (15+ cities)
Toronto, Vancouver, Montreal, Mexico City, Rio de Janeiro, São Paulo, Santiago, Lima, etc.

### Africa (5+ cities)
Cairo, Cape Town, Johannesburg, Lagos, Casablanca

---

## 7. USAGE EXAMPLES

### Get Airport by City
```typescript
import { getAirportByCity } from '@/lib/airportMapper';

const airport = getAirportByCity('Chennai', 'India');
console.log(airport);
// Output:
// {
//   city: "Chennai",
//   country: "India",
//   iata: "MAA",
//   airport: "Chennai International",
//   lat: 12.9940,
//   lng: 80.1695
// }
```

### Search Locations
```typescript
import { searchLocations } from '@/lib/locationProvider';

const results = searchLocations('chen');
console.log(results);
// Output: [
//   { name: "Chennai", country: "India", type: "city", ... },
//   { name: "Chengdu", country: "China", type: "city", ... },
// ]
```

### Search Airports
```typescript
import { searchAirports } from '@/lib/airportMapper';

const airports = searchAirports('MAA');
console.log(airports);
// Output: [
//   { city: "Chennai", iata: "MAA", ... }
// ]
```

---

## 8. WHAT'S AVAILABLE TO USE

| Function | File | Returns |
|----------|------|---------|
| `getIATACode(city, country)` | airportMapper | String IATA code |
| `getAirportByCity(city, country)` | airportMapper | Full airport object |
| `searchAirports(query)` | airportMapper | Array of airports |
| `getAllCities()` | airportMapper | Array of city names |
| `getAllCountries()` | airportMapper | Array of country names |
| `searchLocations(query)` | locationProvider | Array of locations |
| `getAllCountries()` | locationProvider | Array of countries |
| `getCitiesByCountry(country)` | locationProvider | Array of cities |

---

**All data is UTF-8 encoded, properly formatted JSON, deduplicated, and ready to use.**

**No additional data processing needed.**
