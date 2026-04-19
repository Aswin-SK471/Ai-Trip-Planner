# 🚀 AI Trip Planner — Real APIs Setup Guide

**Status**: ✅ Code is ready. Follow these steps to enable real flight data and location search.

---

## 📋 QUICK CHECKLIST

- [ ] Create Google Cloud Project & enable APIs
- [ ] Generate Google Maps API Key  
- [ ] Restrict API Key for security
- [ ] Create Amadeus Developer Account
- [ ] Create Amadeus Application & get credentials
- [ ] Add credentials to `.env.local`
- [ ] Test the integration

---

## 🌍 PART 1 — GOOGLE PLACES API SETUP (10 mins)

### 1️⃣ Create Google Cloud Project

1. Go to **[Google Cloud Console](https://console.cloud.google.com)**
2. Click **"Select a Project"** at the top → **"NEW PROJECT"**
3. Fill in:
   - **Project name**: `AI Trip Planner`
   - **Organization**: Skip (or select if available)
4. Click **Create**
5. Wait for the project to be created (usually 1-2 minutes)
6. Select the new project from the top dropdown

### 2️⃣ Enable Required APIs

1. Go to **APIs & Services** → **[Library](https://console.cloud.google.com/apis/library)**
2. Search for **"Places API"**
   - Click on it
   - Click **Enable**
   - Wait for confirmation
3. Search for **"Maps JavaScript API"**
   - Click on it
   - Click **Enable**
   - Wait for confirmation

### 3️⃣ Create API Key

1. Go to **APIs & Services** → **[Credentials](https://console.cloud.google.com/apis/credentials)**
2. Click **+ CREATE CREDENTIALS** (top left)
3. Select **API Key**
4. A dialog shows your new API Key - **Copy it immediately**
5. **Save it in a safe place** (you'll need it in Step 4)

### 4️⃣ Restrict API Key (IMPORTANT FOR SECURITY)

1. In **Credentials** page, find your key in the list
2. Click on it to open details
3. **Application restrictions** → Select **HTTP referrers (web sites)**
4. Click **Add an HTTP referrer** and add:
   - `http://localhost:3000/*`
   - `http://localhost:3000`
   - (Later add production URLs: `https://yourdomain.com/*`)
5. Scroll down to **API restrictions**
   - Select **Restrict key**
   - Check only:
     - ✅ **Places API**
     - ✅ **Maps JavaScript API**
6. Click **Save**

### 5️⃣ Add to `.env.local`

Create or edit `.env.local` in your project root:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here_xyz123
```

**Replace** `your_api_key_here_xyz123` with the key from Step 3.

---

## ✈️ PART 2 — AMADEUS API SETUP (15 mins)

### 1️⃣ Sign Up for Amadeus

1. Go to **[Amadeus for Developers](https://developers.amadeus.com)**
2. Click **Register** (top right)
3. Create account with:
   - Email
   - Strong password
4. **Check your email** and verify your account
5. Log in to your new account

### 2️⃣ Create Application

1. After logging in, go to **My Self-Service Workspace**
2. Click **Create new app** (or **+ New App**)
3. Fill in:
   - **App name**: `AI Trip Planner`
   - **Description** (optional): `Flight search and travel planning`
   - **Environment**: Select **Production-like Access** (for real flight data)
4. Click **Create**

### 3️⃣ Copy Credentials

1. After creation, you'll see:
   - **Client ID** (API Key)
   - **Client Secret** (API Secret)
2. **Copy both** and store them safely

### 4️⃣ Add to `.env.local`

Edit `.env.local` and add:

```env
AMADEUS_API_KEY=your_client_id_here
AMADEUS_API_SECRET=your_client_secret_here
```

---

## 📝 Complete `.env.local` Example

Your final `.env.local` should look like:

```env
# Database (already configured)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=aitripplanner
DB_PORT=3306

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Google Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...your_key_here...xyz

# Amadeus Flight API
AMADEUS_API_KEY=A...your_client_id...xyz
AMADEUS_API_SECRET=x...your_client_secret...xyz

# Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🧪 TEST THE INTEGRATION

### 1️⃣ Restart Development Server

```bash
# Stop any running server (Ctrl+C)
# Then restart:
npm run dev
```

Wait for compilation to complete.

### 2️⃣ Test Location Autocomplete

1. Open `http://localhost:3000/create-trip`
2. Click on the **"Where are you from?"** field
3. Type a city name: `London`, `Mumbai`, `New York`
4. You should see:
   - **Google Places suggestions** (real places from Google)
   - Dropdown with city names and coordinates
   - Select one to populate the field

### 3️⃣ Test Flight Search

1. Fill in the form:
   - **Origin**: `Delhi` or `Mumbai`
   - **Destination**: `New York` or `London`
   - **Departure date**: Pick a future date
   - **Budget**: `5000` (₹ per adult)
   - **Passengers**: `1 Adult`
2. Click **Search Flights**
3. You should see:
   - Real flight data from Amadeus (if configured)
   - Or demo flights (if Amadeus not configured yet)
   - Each flight shows: **Airline, Price, Duration, Departure/Arrival Time**

### 4️⃣ Check Console Logs

Open browser **DevTools** (F12) → **Console** tab:
- Look for logs like:
  - `✈️ Flight Search Request:` (shows your search parameters)
  - `🔍 Attempting Amadeus API search...` (Amadeus being called)
  - `✅ Found X flights from Amadeus` (Real data!)
  - `📊 Generating mock flights...` (Fallback if Amadeus fails)

---

## 🎯 WHAT'S NEW IN THIS UPDATE

### Location Search
✅ **Before**: Only 45 hardcoded airports  
✅ **After**: Real-time search with **Google Places API**
- Type city names (e.g., "New York")
- See real coordinates and place info
- Autocomplete as you type
- 300ms debounce for smooth UX

### Flight Search
✅ **Before**: Randomly generated mock flights  
✅ **After**: **Real flight data from Amadeus API**
- Actual available flights
- Real airline names and codes
- Accurate pricing based on departure date
- Dynamic pricing (last-minute vs. early-bird)
- One-way and round-trip support

### Error Handling
✅ **Before**: Basic error messages  
✅ **After**: Comprehensive error handling
- Fallback to mock data if API fails
- Console logging for debugging
- User-friendly error messages
- API source tracking (real vs. demo)

### API Files Created

| File | Purpose |
|------|---------|
| `lib/amadeus.ts` | Amadeus API client & flight search |
| `lib/googlePlacesProvider.ts` | Google Places API integration |
| `env.example.new` | Updated environment template |
| `SETUP_REAL_APIs.md` | This guide |

### Updated Files

| File | Changes |
|------|---------|
| `lib/locationProvider.ts` | Added Google Places support, fallback to local |
| `components/LocationAutocomplete.tsx` | Integrated Google Places, improved debouncing |
| `app/api/flights/route.ts` | Added Amadeus integration, fallback to mock |
| `package.json` | Added: `@react-google-maps/api`, `amadeus` |

---

## 🚨 TROUBLESHOOTING

### Location search shows no results
- ✅ Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- ✅ Verify the API key is valid in Google Cloud Console
- ✅ Check **API restrictions** allow Places API
- ✅ Check **Application restrictions** include `http://localhost:3000/*`
- Fallback: Local airport database will still work (45+ airports)

### Flight search returns only mock data
- ✅ Check that `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` are set
- ✅ Verify credentials in Amadeus Developer Portal
- ✅ Check **Server logs** (console) for error messages
- ✅ Open browser **DevTools** → **Console** and look for Amadeus error
- Fallback: Mock flight generation will work (realistic demo data)

### Environment variables not loading
- ✅ Edit `.env.local` (not `.env` or `.env.example`)
- ✅ Restart the dev server after editing `.env.local`
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Check for UTF-8 encoding (not UTF-16)

### API Key errors in browser console
- ✅ Make sure API key is restricted to `localhost:3000`
- ✅ Check browser console for specific error details
- ✅ Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials) to verify restrictions

---

## 📊 API QUOTAS & PRICING

### Google Places API
- **Free tier**: 25,000 requests/month (Places Autocomplete)
- **Pricing**: $0.017 per request after free tier
- **Docs**: https://developers.google.com/maps/billing-and-pricing/pricing

### Amadeus Flight API  
- **Free tier**: 2,000 API calls/month
- **Pricing**: Starts at $4.99/month for premium
- **Docs**: https://developers.amadeus.com/

---

## 🎓 HELPFUL LINKS

- **Google Cloud Console**: https://console.cloud.google.com
- **Amadeus Developer**: https://developers.amadeus.com
- **Google Places API Docs**: https://developers.google.com/maps/documentation/places
- **Amadeus Flight Search API**: https://developers.amadeus.com/self-service

---

## ✨ PRODUCTION DEPLOYMENT

When deploying to production:

1. **Environment variables**: Set in Vercel/deployment platform
2. **API restrictions**:
   - Add `https://yourdomain.com/*` to Google API key
   - Add production URLs to Amadeus account
3. **HTTPS only**: Google Places API requires HTTPS in production
4. **Monitoring**: Check logs for API failures and add alerting

---

## 🎉 YOU'RE ALL SET!

Your AI Trip Planner now has:
- ✅ Real location search (Google Places)
- ✅ Real flight data (Amadeus)
- ✅ Fallback to mock data when APIs unavailable
- ✅ Comprehensive error handling
- ✅ Production-ready error logging

Start searching flights! 🚀
