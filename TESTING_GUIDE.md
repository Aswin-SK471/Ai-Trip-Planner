# 🧪 Testing Guide - AI Trip Planner Production Upgrade

## Quick Start Testing

### 1. LOCAL SETUP
```bash
cd aitripplanner
npm install
npm run dev
# Open http://localhost:3000
```

---

## Phase 1 Testing: Global Location System

### Test 1.1: City Search (Exact Match)
```
TEST: Type "Paris" in location search
EXPECT: See "Paris — France (City)" in results
EXPECT: See CDG Airport suggestion
STATUS: Should instantly return results
```

### Test 1.2: Airport Search (Direct IATA)
```
TEST: Type "JFK" in location search
EXPECT: See "John F Kennedy Int'l (JFK)" 
EXPECT: Shows coordinates, major flag
STATUS: Should be first result
```

### Test 1.3: Fuzzy Matching (Typos)
```
TEST 1: Type "Pars" (missing 'i')
EXPECT: Autocorrects to "Paris" suggestions
TEST 2: Type "Londun" (wrong vowel)
EXPECT: Suggests "London"
TEST 3: Type "Tokio" (alternate spelling)
EXPECT: Suggests "Tokyo"
STATUS: All typos handled gracefully
```

### Test 1.4: Multiple Source Results
```
TEST: Type "london"
EXPECT RESULTS:
  1. Local dataset: London — United Kingdom (City)
  2. Airport: London Heathrow (LHR)
  3. (If Google Places API enabled): London, UK suggestions
STATUS: Mix of sources, no duplicates
```

### Test 1.5: Partial Match
```
TEST 1: Type "New" 
EXPECT: "New York" suggested highly
TEST 2: Type "San"
EXPECT: "San Francisco", "San Diego" suggested
TEST 3: Type "York"
EXPECT: "New York" or similar
STATUS: Partial matching works
```

---

## Phase 2 Testing: Flight Data Accuracy

### Test 2.1: Valid Flight Search
```
TEST:
  Origin: "New York"
  Destination: "Paris"
  Departure: 2025-06-15
  Return: 2025-06-22
  Budget: 5000
  Passengers: 2 adults

EXPECT:
  ✅ Response: success = true
  ✅ Flights array populated (3-6 flights)
  ✅ Source: "amadeus" or "mock"
  ✅ Outbound AND Return flights shown
  ✅ Prices reasonable (~$500-2000)
```

### Test 2.2: Invalid Origin Rejection
```
TEST:
  Origin: "XYZ"
  Destination: "Paris"
  Departure: 2025-06-15

EXPECT:
  ✅ Response: success = false
  ✅ Error message: "Invalid origin..."
  ✅ HTTP Status: 400
```

### Test 2.3: Same Origin & Destination Rejection
```
TEST:
  Origin: "New York"
  Destination: "New York"
  Departure: 2025-06-15

EXPECT:
  ✅ Response: success = false
  ✅ Error message: "Origin and destination cannot be the same"
  ✅ HTTP Status: 400
```

### Test 2.4: Date Validation - Past Date
```
TEST:
  Origin: "New York"
  Destination: "Paris"
  Departure: 2020-01-01

EXPECT:
  ✅ Response: success = false
  ✅ Error: "Cannot search for past dates"
```

### Test 2.5: Date Validation - Invalid Format
```
TEST:
  Origin: "New York"
  Destination: "Paris"
  Departure: "06-15-2025" (wrong format)

EXPECT:
  ✅ Response: success = false
  ✅ Error: "Date must be in YYYY-MM-DD format"
```

### Test 2.6: Return Date Logic
```
TEST 1 - Return before departure:
  Departure: 2025-06-22
  Return: 2025-06-15
  
  EXPECT: Error "Return date must be on or after departure"

TEST 2 - Return equals departure (same day):
  Departure: 2025-06-15
  Return: 2025-06-15
  
  EXPECT: Accepted (1-day trip)

TEST 3 - Return after departure:
  Departure: 2025-06-15
  Return: 2025-06-22
  
  EXPECT: Success
```

### Test 2.7: City-to-IATA Mapping
```
TEST 1:
  Origin: "New York" → Maps to JFK
  Destination: "London" → Maps to LHR
  
  EXPECT: Search succeeds with mapped IATA codes

TEST 2:
  Origin: "JFK" (already IATA)
  Destination: "CDG" (already IATA)
  
  EXPECT: Uses codes as-is, no re-mapping
```

### Test 2.8: Budget Filtering
```
TEST:
  Origin: "New York"
  Destination: "Paris"  
  Budget: 1000
  
EXPECT:
  ✅ Only flights ≤ $1000 returned
  ✅ Flights sorted by price ascending
  ✅ Count should be fewer than without budget
```

---

## Phase 3 Testing: Integrated Full Flow

### Test 3.1: End-to-End Flow
```
1. USER SEARCH
   - Type "Paris" in destination
   - Select suggested "Paris — France"
   
2. FLIGHT SELECTION
   - Enter dates: June 15 - June 22
   - Enter budget: $5000
   - See flights load within 2 seconds
   - Select an outbound and return flight
   
3. HOTEL SELECTION
   - Hotel grid displays
   - Can filter by budget, rating
   - Date calculation shows correct number of nights
   
4. ITINERARY GENERATION
   - Click "Generate Itineraries"
   - See 3-5 different options
   - Each shows: budget, activities per day, score
   
5. ITINERARY VIEW
   - Select an option
   - Timeline displays with expandable days
   - Activities show time, cost, type
   
6. TRIP SUMMARY
   - Flight shown at top
   - Hotel price calculated correctly
   - Itinerary name and style shown
   - "Trip planned!" status displays
```

### Test 3.2: Multiple Searches
```
TEST: Repeat search flow 3 times

EXPECT:
  ✅ Response time < 2s each time (caching working)
  ✅ Results consistent
  ✅ No errors or crashes
```

---

## API Testing (Using curl or Postman)

### Test A1: Places API - Location Search
```bash
curl "http://localhost:3000/api/places?input=paris&session=testsession"

EXPECT Response:
{
  "success": true,
  "suggestions": [
    {
      "name": "Paris",
      "country": "France",
      "type": "city",
      "source": "local",
      "score": 100
    },
    {
      "name": "Paris Charles de Gaulle",
      "country": "France",
      "type": "airport",
      "iata": "CDG",
      "source": "airport",
      "score": 92
    }
  ],
  "sources": ["local", "airport"],
  "count": 2
}
```

### Test A2: Flights API - Valid Search
```bash
curl -X POST http://localhost:3000/api/flights \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "New York",
    "destination": "Paris",
    "departureDate": "2025-06-15",
    "returnDate": "2025-06-22",
    "budget": 5000,
    "passengers": {
      "adults": 2,
      "children": 0,
      "infants": 0
    }
  }'

EXPECT Response:
{
  "success": true,
  "flights": [...],
  "count": 6,
  "source": "mock",
  "hasOutbound": true,
  "hasReturn": true,
  "searchParams": {
    "origin": "JFK",
    "destination": "CDG",
    "departureDate": "2025-06-15",
    "returnDate": "2025-06-22"
  }
}
```

### Test A3: Flights API - Invalid Origin
```bash
curl -X POST http://localhost:3000/api/flights \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "INVALID",
    "destination": "Paris",
    "departureDate": "2025-06-15"
  }'

EXPECT Response (400):
{
  "success": false,
  "error": "Invalid origin: \"INVALID\". Please provide a valid city or IATA code."
}
```

---

## Performance Testing

### Test P1: Response Time
```
TARGET: < 2 seconds for complete flow

TEST:
  1. Start server: npm run dev
  2. Open DevTools → Network tab
  3. Search location: measure time
  4. Search flights: measure time
  5. Generate itinerary: measure time
  
EXPECTED:
  ✅ Location: < 500ms
  ✅ Flights: < 2s
  ✅ Itinerary: < 1s
```

### Test P2: Caching Effectiveness
```
TEST:
  1. Search "Paris" (first time) - note response time
  2. Search "Paris" again (cached) - should be faster
  3. Search "Pari" (fuzzy, different) - should be fresh
  
EXPECT:
  ✅ Exact repeat: < 50ms (cache hit)
  ✅ Similar search: Takes normal time (cache miss)
```

### Test P3: Debouncing Works
```
TEST:
  1. Rapid typing: "p", "pa", "par", "pari", "paris"
  2. Watch network tab
  
EXPECT:
  ✅ Only 1-2 actual API calls (300ms debounce working)
  ✅ Not one call per character
```

---

## Error Handling Testing

### Test E1: Network Error
```
TEST:
  1. Turn off internet / block API
  2. Try to search locations
  
EXPECT:
  ✅ Shows user-friendly error message
  ✅ Does NOT show stack trace
  ✅ Offers to retry
```

### Test E2: Invalid Passenger Count
```
TEST:
  Passengers: 15 adults (too many)
  
EXPECT:
  ✅ Capped at 9 adults automatically
  ✅ Or shows error message
```

### Test E3: Empty Results Handling
```
TEST:
  Search for very obscure location: "Zzzzzzz"
  
EXPECT:
  ✅ Shows "No results found" message
  ✅ Does NOT crash
  ✅ Suggests trying different search
```

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome 120+
- [ ] Firefox 120+
- [ ] Safari 17+
- [ ] Mobile Safari (iPhone)
- [ ] Chrome Mobile (Android)

EXPECT:
- ✅ All features work
- ✅ Responsive layout
- ✅ Touch interactions smooth
- ✅ No console errors

---

## Checklist for Production Readiness

- [ ] All Phase 1 tests passing (location search)
- [ ] All Phase 2 tests passing (flight validation)
- [ ] All Phase 3 tests passing (full flow)
- [ ] API tests working (curl/Postman)
- [ ] Performance < 2s for main flows
- [ ] No console errors
- [ ] Error messages are clear and helpful
- [ ] Works on desktop and mobile
- [ ] Caching working (repeated searches fast)
- [ ] Debouncing working (no API spam)
- [ ] Mock data shows when Amadeus API unavailable
- [ ] All IATA codes recognized

---

## Reporting Issues Found

If any tests fail:
1. Check browser console (F12)
2. Check Network tab for API responses
3. Check response status codes
4. Verify your environment variables are set
5. Check logs: `npm run dev` should show detailed logs

---

**All tests passing? 🎉 Your app is production-ready!**
