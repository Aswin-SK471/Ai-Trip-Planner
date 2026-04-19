# AI Trip Planner

AI Trip Planner is a full-stack web application built with Next.js that delivers a production-level travel planning experience. It integrates real-time APIs, structured data processing, and a modern UI to allow users to search locations, view flights, select accommodations, and generate detailed itineraries.

## Overview

The application enables users to plan an entire trip in a single workflow. Users can search for global destinations, retrieve live flight data, choose hotel stays, and receive structured day-by-day travel plans based on trip duration, preferences, and budget.

## Features

- Global location autocomplete using a hybrid system (Google Places API + local dataset)
- Real-time flight search powered by the Amadeus Flight Offers API
- City to airport mapping using IATA codes for accurate flight queries
- Hotel selection system with structured data
- Dynamic itinerary generation with day-wise planning
- Destination map integration using geographic coordinates
- JWT-based authentication system
- Responsive and modern UI built with Tailwind CSS

## System Architecture

The application follows a modular full-stack architecture using Next.js:

- **Frontend:** React components with Tailwind CSS  
- **Backend:** API routes handled within Next.js  
- **Authentication:** JWT-based token system  

### External APIs

- Google Places API for location search  
- Amadeus API for flight data  

### Local Datasets

- Locations dataset for global coverage  
- Airports dataset for IATA mapping  

## Core Technical Concepts

- Hybrid search system combining API data and local datasets  
- Data normalization (city to airport mapping)  
- API validation and error handling  
- Debounced autocomplete for performance optimization  
- State synchronization across trip summary, flights, hotels, and itinerary  
- Structured itinerary generation using rule-based scheduling logic  

## Tech Stack

- Next.js  
- React  
- Tailwind CSS  
- TypeScript  
- Google Places API  
- Amadeus Flight API  
- JWT Authentication  

## Installation

Clone the repository:

```bash
git clone https://github.com/Aswin-SK471/Ai-Trip-Planner.git
cd Ai-Trip-Planner
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file in the root directory and add:

```env
GOOGLE_API_KEY=your_google_api_key
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
JWT_SECRET=your_jwt_secret
```

## Usage

1. Enter origin and destination using autocomplete  
2. Select travel dates and passengers  
3. Search and select a flight  
4. Choose a hotel for the destination  
5. View and customize the generated itinerary  

## Project Structure

```
app/                Application routes and pages
components/         UI components
lib/                Core logic and API integrations
data/               Local datasets (locations, airports)
public/             Static assets
types/              Type definitions
```

## Deployment

The application can be deployed using Vercel:

1. Import the GitHub repository into Vercel  
2. Configure the following environment variables:
   - GOOGLE_API_KEY  
   - AMADEUS_API_KEY  
   - AMADEUS_API_SECRET  
   - JWT_SECRET  
3. Deploy the project  

## Status

Production-ready MVP with full end-to-end functionality including location search, flight integration, hotel selection, and itinerary generation.