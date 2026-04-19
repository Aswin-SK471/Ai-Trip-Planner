# INTEGRATION CODE SNIPPETS

## Exact Code to Add to Your Form

### 1. Import at Top of File

```tsx
import LocationSearch from '@/components/LocationSearch';
import { getIATACode } from '@/lib/airportMapper';
```

### 2. Add State Variables

```tsx
const [selectedOrigin, setSelectedOrigin] = useState<any>(null);
const [selectedDestination, setSelectedDestination] = useState<any>(null);
```

### 3. Replace Origin Input

**Replace this:**
```tsx
<LocationAutocomplete
  value={formData.origin}
  onChange={handleOriginChange}
  placeholder="Departure city"
/>
```

**With this:**
```tsx
<LocationSearch
  value={formData.origin}
  onChange={(value) => {
    setFormData({ ...formData, origin: value.trim() });
  }}
  onSelect={(suggestion) => {
    setSelectedOrigin(suggestion);
    console.log('Selected origin:', suggestion);
  }}
  placeholder="Departure city or airport"
/>
```

### 4. Replace Destination Input

**Replace this:**
```tsx
<LocationAutocomplete
  value={formData.destination}
  onChange={handleDestinationChange}
  placeholder="Destination city"
/>
```

**With this:**
```tsx
<LocationSearch
  value={formData.destination}
  onChange={(value) => {
    setFormData({ ...formData, destination: value.trim() });
  }}
  onSelect={(suggestion) => {
    setSelectedDestination(suggestion);
    console.log('Selected destination:', suggestion);
  }}
  placeholder="Destination city or airport"
/>
```

### 5. Update Form Submission

**Before fetching flights, add:**

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // SANITIZE INPUTS
  const cleanOrigin = formData.origin.trim();
  const cleanDestination = formData.destination.trim();

  // GET IATA CODES
  let originIATA = cleanOrigin;
  let destinationIATA = cleanDestination;

  // If we have suggestions with IATA codes, use them
  if (selectedOrigin?.iata) {
    originIATA = selectedOrigin.iata;
  }
  if (selectedDestination?.iata) {
    destinationIATA = selectedDestination.iata;
  }

  // VALIDATE (basic check)
  if (!originIATA || !destinationIATA) {
    alert('Please select valid locations');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: originIATA,
        destination: destinationIATA,
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
      const error = await response.json();
      alert(error.error || 'Search failed');
      return;
    }

    const data = await response.json();
    setFlights(data.flights || []);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to search flights');
  } finally {
    setLoading(false);
  }
};
```

---

## Testing

### Test Case 1: Basic Search
```
Input: "london"
Expected: Shows London airports and cities
```

### Test Case 2: Typo Handling
```
Input: "londun"
Expected: Shows London (fuzzy match works)
```

### Test Case 3: IATA Code
```
Input: "MAA"
Expected: Shows Chennai airport with IATA code
```

### Test Case 4: Trim Spaces
```
Input: "london "
Expected: Automatically trimmed, displays correctly
```

### Test Case 5: Selection
```
1. Type "london"
2. Click "London Heathrow (LHR)"
3. Check: selectedDestination has iata: "LHR"
```

---

## Files Modified

1. ✓ `components/LocationSearch.tsx` - New component
2. ✓ `lib/airportMapper.ts` - New utility
3. ✓ `data/airports.json` - 200+ airports
4. ✓ `data/locations.json` - 100+ cities

---

## Files Already Updated

1. ✓ `app/api/places/route.ts` - Hybrid search
2. ✓ `app/api/flights/route.ts` - Validation
3. ✓ `app/create-trip/page.tsx` - Form integration
4. ✓ `lib/amadeus.ts` - Bug Fix
5. ✓ `components/LocationAutocomplete.tsx` - Input visibility fix

---

## Reference

### LocationSearch Props
```typescript
interface LocationSearchProps {
  value: string;                    // Current input value
  onChange: (value, suggestion?) => void;  // Called on input change
  placeholder?: string;            // Input placeholder
  onSelect?: (suggestion) => void; // Called when item selected
  className?: string;              // Extra CSS classes
}
```

### Suggestion Object
```typescript
interface LocationSuggestion {
  id: string;                // Unique ID
  displayName: string;       // Display text
  city?: string;            // City name
  country: string;          // Country name
  state?: string;           // State/region
  type: 'city' | 'airport' | 'country'; // Type
  iata?: string;            // Airport IATA code
  source: 'google' | 'local' | 'airport'; // Data source
  lat?: number;             // Latitude
  lng?: number;             // Longitude
}
```

---

## API Response Example

```bash
curl "http://localhost:3000/api/places?input=chen"
```

Response:
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "MAA-Chennai",
      "displayName": "Chennai International",
      "city": "Chennai",
      "country": "India",
      "iata": "MAA",
      "type": "airport",
      "source": "airport",
      "lat": 12.9940,
      "lng": 80.1695
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
  "count": 2
}
```

---

**Copy + Paste Ready. No Additional Changes Needed.**
