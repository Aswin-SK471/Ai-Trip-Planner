export interface Activity {
  time: string;
  activity: string;
  description: string;
  duration: number; // hours
  cost: number; // per person
  type?: 'food' | 'culture' | 'nature' | 'shopping' | 'adventure' | 'nightlife' | 'relaxation' | 'transport';
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  budget?: number;
  estimatedDailyBudget?: number;
}

export interface ItineraryRequest {
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
  interests?: string[];
}

export interface ItineraryOption {
  id: string;
  name: string;
  style: 'budget' | 'mid-range' | 'luxury' | 'adventure' | 'culture' | 'relaxation';
  description: string;
  days: DayPlan[];
  totalBudget: number;
  numberOfDays: number;
  startDate: string;
  budgetAllocation: {
    flights: number;
    hotels: number;
    activities: number;
    food: number;
  };
  tripScore: {
    budgetFit: number;
    activityDensity: number;
    overall: number;
  };
  estimatedCostPerDay: number;
}

export interface ItineraryResponse {
  options: ItineraryOption[];
  selectedOption?: ItineraryOption;
  destination: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
}

// ─── TIME SLOT DEFINITIONS ───
const TIME_SLOTS = {
  morning: ['08:00 AM', '09:00 AM', '10:00 AM', '10:30 AM'],
  afternoon: ['12:30 PM', '01:00 PM', '02:00 PM', '03:00 PM', '03:30 PM'],
  evening: ['05:30 PM', '06:00 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
} as const;

// ─── DESTINATION-SPECIFIC ACTIVITIES ───
const DESTINATION_ACTIVITIES: Record<string, Record<string, { name: string; description: string; cost: number; duration: number }[]>> = {
  paris: {
    morning: [
      { name: 'Eiffel Tower sunrise visit', description: 'Beat the crowds with an early visit to the iconic tower for panoramic city views', cost: 26, duration: 2 },
      { name: 'Montmartre walking tour', description: 'Explore the artistic hilltop neighborhood, visit Sacre-Coeur basilica', cost: 15, duration: 2.5 },
      { name: 'Louvre Museum exploration', description: 'Discover masterpieces including the Mona Lisa in the world\'s largest art museum', cost: 22, duration: 3 },
      { name: 'Breakfast at a Parisian cafe', description: 'Enjoy fresh croissants and cafe au lait at a traditional Left Bank cafe', cost: 12, duration: 1 },
      { name: 'Musee d\'Orsay visit', description: 'Admire Impressionist masterpieces by Monet, Renoir, and Degas', cost: 16, duration: 2.5 },
    ],
    afternoon: [
      { name: 'Seine River cruise', description: 'Glide past Notre-Dame, the Louvre, and bridges of Paris on a scenic cruise', cost: 18, duration: 1.5 },
      { name: 'Luxembourg Gardens stroll', description: 'Relax among fountains and sculptures in this elegant formal garden', cost: 0, duration: 1.5 },
      { name: 'Le Marais district exploration', description: 'Browse boutiques, galleries, and falafel shops in this trendy historic quarter', cost: 20, duration: 2 },
      { name: 'Versailles Palace day trip', description: 'Tour the opulent royal palace and its magnificent formal gardens', cost: 22, duration: 4 },
    ],
    evening: [
      { name: 'Dinner in Saint-Germain', description: 'Savor classic French cuisine at a bistro in the literary heart of Paris', cost: 55, duration: 2 },
      { name: 'Seine evening illumination walk', description: 'Stroll along the river as Paris landmarks light up after dark', cost: 0, duration: 1.5 },
      { name: 'Moulin Rouge cabaret show', description: 'Experience the legendary cabaret with dazzling performances', cost: 95, duration: 2.5 },
    ],
  },
  tokyo: {
    morning: [
      { name: 'Senso-ji Temple visit', description: 'Walk through the iconic Kaminarimon gate and explore Tokyo\'s oldest temple', cost: 0, duration: 1.5 },
      { name: 'Tsukiji Outer Market breakfast', description: 'Sample the freshest sushi and street food at the famous fish market area', cost: 15, duration: 1.5 },
      { name: 'Meiji Shrine and Harajuku', description: 'Find serenity at this forested Shinto shrine before exploring youth culture', cost: 0, duration: 2 },
      { name: 'Imperial Palace East Gardens', description: 'Tour the tranquil gardens of the Emperor\'s residence with seasonal blooms', cost: 0, duration: 1.5 },
    ],
    afternoon: [
      { name: 'Akihabara electronics district', description: 'Dive into anime culture, gadget shops, and maid cafes in Electric Town', cost: 25, duration: 2 },
      { name: 'TeamLab Borderless digital art', description: 'Immerse yourself in stunning interactive digital art installations', cost: 32, duration: 2.5 },
      { name: 'Ueno Park and museums', description: 'Explore world-class museums and cherry blossom paths in this cultural hub', cost: 12, duration: 2 },
      { name: 'Shibuya crossing experience', description: 'Stand at the world\'s busiest intersection and explore the vibrant district', cost: 10, duration: 1.5 },
    ],
    evening: [
      { name: 'Ramen street dinner', description: 'Slurp authentic ramen at a traditional counter-service noodle shop', cost: 12, duration: 1 },
      { name: 'Golden Gai bar hopping', description: 'Navigate tiny bars and izakayas in Shinjuku\'s atmospheric alleyway district', cost: 30, duration: 2.5 },
      { name: 'Tokyo Tower observatory', description: 'Enjoy sweeping nighttime views of the city from the illuminated tower', cost: 12, duration: 1.5 },
    ],
  },
  london: {
    morning: [
      { name: 'Tower of London tour', description: 'Discover 1000 years of history and see the Crown Jewels', cost: 33, duration: 2.5 },
      { name: 'British Museum exploration', description: 'View the Rosetta Stone and Egyptian mummies in this world-famous free museum', cost: 0, duration: 2.5 },
      { name: 'Full English breakfast', description: 'Start the day with a traditional fry-up at a classic London cafe', cost: 12, duration: 1 },
      { name: 'Buckingham Palace and Guard Change', description: 'Watch the famous Changing of the Guard ceremony at the royal residence', cost: 0, duration: 1.5 },
    ],
    afternoon: [
      { name: 'South Bank and Tate Modern', description: 'Walk along the Thames visiting the iconic contemporary art gallery', cost: 0, duration: 2 },
      { name: 'Borough Market food tour', description: 'Taste artisan cheeses, fresh pastries, and global street food', cost: 25, duration: 2 },
      { name: 'Westminster Abbey and Big Ben', description: 'Tour the Gothic abbey where monarchs are crowned and see the famous clock', cost: 27, duration: 2 },
      { name: 'Camden Town exploration', description: 'Browse quirky market stalls, vintage shops, and street food in North London', cost: 20, duration: 2 },
    ],
    evening: [
      { name: 'West End theatre show', description: 'See a world-class musical or play in London\'s famous theatre district', cost: 65, duration: 2.5 },
      { name: 'Pub dinner in Covent Garden', description: 'Enjoy classic British fare and local ales in a atmospheric gastropub', cost: 35, duration: 2 },
      { name: 'Thames evening cruise', description: 'Cruise past illuminated landmarks from Tower Bridge to Westminster', cost: 22, duration: 1.5 },
    ],
  },
  'new york': {
    morning: [
      { name: 'Central Park morning walk', description: 'Explore paths, bridges, and Bethesda Fountain in Manhattan\'s green heart', cost: 0, duration: 2 },
      { name: 'Brooklyn Bridge walk', description: 'Cross the iconic bridge with stunning views of the Manhattan skyline', cost: 0, duration: 1.5 },
      { name: 'Met Museum visit', description: 'Discover 5000 years of art from Egyptian temples to modern masterpieces', cost: 30, duration: 3 },
      { name: 'Bagels in Lower East Side', description: 'Try legendary New York bagels at a classic neighborhood deli', cost: 8, duration: 1 },
    ],
    afternoon: [
      { name: 'Statue of Liberty and Ellis Island', description: 'Ferry to Lady Liberty and learn about American immigration history', cost: 24, duration: 3.5 },
      { name: 'High Line elevated park', description: 'Walk this unique park built on former railway tracks above the streets', cost: 0, duration: 1.5 },
      { name: 'Times Square and Broadway', description: 'Experience the energy of neon-lit Times Square and the Theater District', cost: 15, duration: 2 },
      { name: 'Chelsea Market and Meatpacking', description: 'Explore a buzzing food hall with artisan vendors and local flavors', cost: 25, duration: 2 },
    ],
    evening: [
      { name: 'Broadway show', description: 'See a Tony Award-winning musical on the world\'s most famous stage', cost: 120, duration: 2.5 },
      { name: 'Rooftop bar in Manhattan', description: 'Sip cocktails with stunning skyline views from a stylish rooftop', cost: 40, duration: 2 },
      { name: 'Little Italy dinner', description: 'Feast on authentic Italian cuisine in this historic Manhattan neighborhood', cost: 45, duration: 2 },
    ],
  },
  dubai: {
    morning: [
      { name: 'Burj Khalifa observation deck', description: 'Rise to the 148th floor of the world\'s tallest building at sunrise', cost: 55, duration: 1.5 },
      { name: 'Dubai Creek and Gold Souk', description: 'Take a traditional abra boat and browse the glittering gold market', cost: 5, duration: 2 },
      { name: 'Dubai Mall exploration', description: 'Shop and explore the world\'s largest mall with its aquarium and ice rink', cost: 30, duration: 2.5 },
    ],
    afternoon: [
      { name: 'Desert safari adventure', description: 'Experience dune bashing, sandboarding, and camel rides in the Arabian desert', cost: 65, duration: 4 },
      { name: 'Palm Jumeirah beach day', description: 'Relax on pristine beaches at the iconic palm-shaped island', cost: 20, duration: 3 },
      { name: 'Dubai Marina walk', description: 'Stroll along the waterfront promenade past luxury yachts and skyscrapers', cost: 10, duration: 2 },
    ],
    evening: [
      { name: 'Dubai Fountain show and dinner', description: 'Watch the world\'s largest choreographed fountain while dining lakeside', cost: 60, duration: 2 },
      { name: 'Dhow cruise dinner', description: 'Enjoy an Arabic buffet aboard a traditional wooden boat on the Creek', cost: 50, duration: 2.5 },
      { name: 'JBR beachfront dining', description: 'Dine at restaurants along the lively Jumeirah Beach Residence promenade', cost: 45, duration: 2 },
    ],
  },
  bangkok: {
    morning: [
      { name: 'Grand Palace and Wat Phra Kaew', description: 'Visit the stunning royal palace complex and Temple of the Emerald Buddha', cost: 16, duration: 2.5 },
      { name: 'Wat Arun temple visit', description: 'Climb the steep steps of the Temple of Dawn for river views', cost: 3, duration: 1.5 },
      { name: 'Floating market excursion', description: 'Cruise canals lined with boat vendors selling food and crafts', cost: 15, duration: 3 },
    ],
    afternoon: [
      { name: 'Chatuchak Weekend Market', description: 'Browse thousands of stalls at one of the world\'s largest outdoor markets', cost: 20, duration: 3 },
      { name: 'Jim Thompson House and Museum', description: 'Tour the teak house of the American silk entrepreneur amid tropical gardens', cost: 8, duration: 1.5 },
      { name: 'Thai cooking class', description: 'Learn to prepare pad thai, green curry, and mango sticky rice with local chefs', cost: 30, duration: 3 },
    ],
    evening: [
      { name: 'Chinatown street food crawl', description: 'Feast on grilled seafood, noodle soups, and mango desserts on Yaowarat Road', cost: 10, duration: 2 },
      { name: 'Rooftop cocktails at Sky Bar', description: 'Sip drinks 64 floors above the city with panoramic views at this iconic bar', cost: 25, duration: 2 },
      { name: 'Thai massage experience', description: 'Unwind with a traditional Thai herbal compress massage at a top spa', cost: 20, duration: 1.5 },
    ],
  },
  rome: {
    morning: [
      { name: 'Colosseum and Roman Forum', description: 'Step inside the ancient amphitheater and walk through the heart of ancient Rome', cost: 18, duration: 3 },
      { name: 'Vatican Museums and Sistine Chapel', description: 'Marvel at Michelangelo\'s ceiling and centuries of papal art collections', cost: 20, duration: 3 },
      { name: 'Espresso at a Roman bar', description: 'Stand at the counter like a local and enjoy a perfect Italian espresso', cost: 3, duration: 0.5 },
    ],
    afternoon: [
      { name: 'Trastevere neighborhood walk', description: 'Wander cobblestone streets lined with ivy-covered buildings and trattorias', cost: 0, duration: 2 },
      { name: 'Trevi Fountain and Pantheon', description: 'Toss a coin in the Baroque fountain and visit the ancient temple with its oculus', cost: 0, duration: 2 },
      { name: 'Borghese Gallery visit', description: 'See masterworks by Bernini and Caravaggio in this intimate villa museum', cost: 15, duration: 2 },
    ],
    evening: [
      { name: 'Dinner in Trastevere', description: 'Savor cacio e pepe and Roman pizza at a family-run trattoria', cost: 35, duration: 2 },
      { name: 'Gelato walk past illuminated ruins', description: 'Enjoy artisanal gelato while strolling past the lit-up Colosseum at night', cost: 5, duration: 1.5 },
      { name: 'Aperitivo in Campo de\' Fiori', description: 'Join locals for the evening ritual of drinks and snacks at this lively piazza', cost: 15, duration: 1.5 },
    ],
  },
  singapore: {
    morning: [
      { name: 'Gardens by the Bay', description: 'Walk among the Supertree Grove and explore the Cloud Forest dome', cost: 28, duration: 2.5 },
      { name: 'Hawker center breakfast', description: 'Try kaya toast and soft-boiled eggs at a UNESCO-recognized food stall', cost: 5, duration: 1 },
      { name: 'Marina Bay Sands SkyPark', description: 'Take in panoramic city views from the iconic rooftop observation deck', cost: 26, duration: 1.5 },
    ],
    afternoon: [
      { name: 'Sentosa Island beach day', description: 'Relax on sandy beaches and enjoy attractions on this resort island', cost: 20, duration: 3 },
      { name: 'Little India and Chinatown', description: 'Experience two vibrant ethnic neighborhoods with temples and street food', cost: 10, duration: 2.5 },
      { name: 'Singapore Zoo and River Wonders', description: 'See wildlife in open-air exhibits and cruise past giant river creatures', cost: 40, duration: 3 },
    ],
    evening: [
      { name: 'Clarke Quay riverside dinner', description: 'Dine along the colorful waterfront with views of illuminated shophouses', cost: 40, duration: 2 },
      { name: 'Night Safari adventure', description: 'Explore the world\'s first nocturnal zoo on a tram ride through the jungle', cost: 55, duration: 2.5 },
      { name: 'Lau Pa Sat hawker dinner', description: 'Feast on satay and laksa at this stunning Victorian-era cast-iron market', cost: 12, duration: 1.5 },
    ],
  },
  mumbai: {
    morning: [
      { name: 'Gateway of India and harbor walk', description: 'Visit the iconic arch monument and watch fishing boats in the harbor', cost: 0, duration: 1.5 },
      { name: 'Dhobi Ghat open-air laundry', description: 'See the world\'s largest outdoor laundry and learn about this unique tradition', cost: 5, duration: 1 },
      { name: 'Chhatrapati Shivaji Terminus tour', description: 'Admire the UNESCO World Heritage Victorian Gothic railway station', cost: 0, duration: 1 },
    ],
    afternoon: [
      { name: 'Elephanta Caves ferry trip', description: 'Cruise across the harbor to ancient rock-cut cave temples on an island', cost: 15, duration: 3.5 },
      { name: 'Crawford Market and street food', description: 'Browse the bustling colonial-era market and try vada pav and pav bhaji', cost: 10, duration: 2 },
      { name: 'Marine Drive promenade walk', description: 'Stroll along the Queen\'s Necklace seaside boulevard at sunset', cost: 0, duration: 1.5 },
    ],
    evening: [
      { name: 'Dinner at a Bandra restaurant', description: 'Enjoy coastal Maharashtrian cuisine at a renowned restaurant in trendy Bandra', cost: 25, duration: 2 },
      { name: 'Juhu Beach evening', description: 'Enjoy chaat and bhel puri from street vendors on Mumbai\'s famous beach', cost: 5, duration: 1.5 },
    ],
  },
  delhi: {
    morning: [
      { name: 'Red Fort exploration', description: 'Tour the massive Mughal-era fort that served as the seat of imperial power', cost: 8, duration: 2 },
      { name: 'Qutub Minar complex visit', description: 'See the tallest brick minaret in the world surrounded by medieval ruins', cost: 8, duration: 1.5 },
      { name: 'Old Delhi walking tour', description: 'Navigate the chaotic bazaars and ancient lanes of Shahjahanabad', cost: 10, duration: 2.5 },
    ],
    afternoon: [
      { name: 'Humayun\'s Tomb and gardens', description: 'Visit the Mughal garden tomb that inspired the Taj Mahal', cost: 8, duration: 2 },
      { name: 'India Gate and Rajpath', description: 'Walk past the war memorial and sweeping ceremonial boulevard', cost: 0, duration: 1.5 },
      { name: 'Chandni Chowk food walk', description: 'Taste paranthas, jalebis, and kebabs in Old Delhi\'s legendary food lane', cost: 10, duration: 2 },
    ],
    evening: [
      { name: 'Dinner at Hauz Khas Village', description: 'Dine at a rooftop restaurant overlooking ancient ruins and a lake', cost: 20, duration: 2 },
      { name: 'Akshardham Temple light show', description: 'Watch a spectacular musical fountain show at the ornate Hindu complex', cost: 5, duration: 2 },
    ],
  },
  amsterdam: {
    morning: [
      { name: 'Anne Frank House visit', description: 'Tour the preserved hiding place and learn its powerful wartime story', cost: 16, duration: 1.5 },
      { name: 'Rijksmuseum gallery tour', description: 'See Rembrandt\'s Night Watch and Vermeer masterpieces in the Dutch national museum', cost: 22, duration: 2.5 },
      { name: 'Vondelpark morning stroll', description: 'Walk or cycle through Amsterdam\'s beloved green park', cost: 0, duration: 1 },
    ],
    afternoon: [
      { name: 'Canal ring cruise', description: 'Glide through UNESCO-listed canals past gabled merchant houses', cost: 16, duration: 1.5 },
      { name: 'Jordaan neighborhood walk', description: 'Browse independent boutiques and cozy brown cafes in this charming district', cost: 15, duration: 2 },
      { name: 'Van Gogh Museum visit', description: 'View the world\'s largest collection of Van Gogh paintings and letters', cost: 20, duration: 2 },
    ],
    evening: [
      { name: 'Indonesian rijsttafel dinner', description: 'Enjoy the Dutch-Indonesian feast of 15+ small dishes at a colonial-style restaurant', cost: 35, duration: 2 },
      { name: 'Heineken Experience tour', description: 'Tour the original brewery, learn about brewing, and taste fresh pints', cost: 21, duration: 1.5 },
    ],
  },
  barcelona: {
    morning: [
      { name: 'Sagrada Familia visit', description: 'Marvel at Gaudi\'s unfinished masterpiece basilica with its stunning interior light', cost: 26, duration: 2 },
      { name: 'La Boqueria Market breakfast', description: 'Sample fresh juices, jamon, and seafood at this legendary Ramblas market', cost: 15, duration: 1.5 },
      { name: 'Park Guell exploration', description: 'Explore Gaudi\'s whimsical mosaic park with panoramic city views', cost: 10, duration: 2 },
    ],
    afternoon: [
      { name: 'Gothic Quarter walking tour', description: 'Wander medieval streets, hidden plazas, and the Barcelona Cathedral', cost: 0, duration: 2 },
      { name: 'Barceloneta Beach relaxation', description: 'Sunbathe on the city\'s popular Mediterranean beach with seafront bars', cost: 5, duration: 2.5 },
      { name: 'Picasso Museum visit', description: 'Discover early works by Picasso in a series of medieval palaces', cost: 12, duration: 2 },
    ],
    evening: [
      { name: 'Tapas crawl in El Born', description: 'Hop between tapas bars sampling patatas bravas, jamon, and pintxos', cost: 30, duration: 2.5 },
      { name: 'Flamenco show', description: 'Experience the passion of live flamenco guitar, singing, and dance', cost: 40, duration: 1.5 },
    ],
  },
  sydney: {
    morning: [
      { name: 'Sydney Opera House tour', description: 'Go behind the scenes of the iconic sail-shaped performance venue', cost: 25, duration: 1.5 },
      { name: 'Bondi to Coogee coastal walk', description: 'Hike the stunning clifftop trail past beaches and ocean pools', cost: 0, duration: 2.5 },
      { name: 'Royal Botanic Garden visit', description: 'Stroll through harbor-side gardens with views of the Opera House and Bridge', cost: 0, duration: 1.5 },
    ],
    afternoon: [
      { name: 'Sydney Harbour Bridge climb', description: 'Scale the arch of the famous bridge for breathtaking 360-degree harbor views', cost: 150, duration: 3.5 },
      { name: 'Darling Harbour waterfront', description: 'Explore the entertainment precinct with aquarium, museums, and cafes', cost: 15, duration: 2 },
      { name: 'The Rocks historic district', description: 'Visit the oldest neighborhood with cobblestone lanes and weekend markets', cost: 10, duration: 2 },
    ],
    evening: [
      { name: 'Seafood dinner at Circular Quay', description: 'Feast on fresh oysters and barramundi with Opera House views', cost: 60, duration: 2 },
      { name: 'Sunset from Mrs Macquarie\'s Chair', description: 'Watch the sun set behind the Harbour Bridge from this classic viewpoint', cost: 0, duration: 1 },
    ],
  },
  istanbul: {
    morning: [
      { name: 'Hagia Sophia visit', description: 'Enter the awe-inspiring 6th-century monument bridging empires and faiths', cost: 15, duration: 2 },
      { name: 'Blue Mosque viewing', description: 'Admire the cascading domes and six minarets of the Sultanahmet Mosque', cost: 0, duration: 1 },
      { name: 'Topkapi Palace exploration', description: 'Tour the former seat of Ottoman sultans and see the Treasury jewels', cost: 20, duration: 2.5 },
    ],
    afternoon: [
      { name: 'Grand Bazaar shopping', description: 'Haggle for carpets, ceramics, spices, and lanterns in 4000+ shops', cost: 25, duration: 2.5 },
      { name: 'Bosphorus ferry cruise', description: 'Sail between Europe and Asia past palaces, fortresses, and waterfront mansions', cost: 5, duration: 2 },
      { name: 'Spice Bazaar and street food', description: 'Browse mountains of Turkish delight, saffron, and dried fruits, then try balik ekmek', cost: 10, duration: 1.5 },
    ],
    evening: [
      { name: 'Rooftop dinner in Sultanahmet', description: 'Dine on kebabs and meze with views of the illuminated Hagia Sophia and Blue Mosque', cost: 30, duration: 2 },
      { name: 'Traditional Turkish bath', description: 'Experience a centuries-old hamam ritual with steam, scrub, and massage', cost: 45, duration: 2 },
    ],
  },
  prague: {
    morning: [
      { name: 'Prague Castle complex tour', description: 'Explore the world\'s largest ancient castle, St. Vitus Cathedral, and Golden Lane', cost: 15, duration: 2.5 },
      { name: 'Charles Bridge sunrise walk', description: 'Cross the 14th-century stone bridge dotted with Baroque statues before crowds arrive', cost: 0, duration: 1 },
      { name: 'Jewish Quarter heritage walk', description: 'Visit centuries-old synagogues and the atmospheric Old Jewish Cemetery', cost: 14, duration: 2 },
    ],
    afternoon: [
      { name: 'Old Town Square tower climb', description: 'Ascend the astronomical clock tower for sweeping views of red rooftops and spires', cost: 10, duration: 1.5 },
      { name: 'Letna Park beer garden', description: 'Sip Czech pilsner at an open-air beer garden overlooking the Vltava river', cost: 8, duration: 1.5 },
      { name: 'Petrin Hill funicular and lookout', description: 'Ride the funicular up the hill and climb the Eiffel-inspired observation tower', cost: 6, duration: 2 },
    ],
    evening: [
      { name: 'Traditional Czech dinner', description: 'Feast on svickova, trdelnik, and dark Czech beer in a medieval cellar restaurant', cost: 20, duration: 2 },
      { name: 'Vltava river night cruise', description: 'Float past illuminated riverside landmarks with live music on board', cost: 18, duration: 1.5 },
    ],
  },
};

// ─── GENERIC ACTIVITY DATABASE (fallback for cities not in DESTINATION_ACTIVITIES) ───
const GENERIC_ACTIVITIES: Record<string, Record<string, { name: string; description: string; cost: number; duration: number }[]>> = {
  culture: {
    morning: [
      { name: 'Visit historic museum', description: 'Explore local history and art collections at a top-rated museum', cost: 15, duration: 2.5 },
      { name: 'Walking tour of old town', description: 'Discover hidden streets and architectural gems with a knowledgeable guide', cost: 20, duration: 2 },
      { name: 'Art gallery exploration', description: 'Browse contemporary and classical works at a local gallery', cost: 12, duration: 1.5 },
      { name: 'Archaeological site tour', description: 'Walk through ancient ruins and learn about the region\'s earliest civilizations', cost: 25, duration: 3 },
      { name: 'Religious monument visit', description: 'Admire sacred architecture and learn about local spiritual traditions', cost: 8, duration: 1.5 },
    ],
    afternoon: [
      { name: 'Historical landmark visit', description: 'Explore a significant local landmark with guided commentary', cost: 10, duration: 2 },
      { name: 'Local craft workshop', description: 'Learn traditional artisan techniques in a hands-on workshop session', cost: 30, duration: 2 },
      { name: 'Cultural center visit', description: 'Immerse in local arts, music, and storytelling at the cultural center', cost: 12, duration: 2.5 },
      { name: 'UNESCO site exploration', description: 'Tour a World Heritage Site and understand its global significance', cost: 15, duration: 3 },
    ],
    evening: [
      { name: 'Traditional performance show', description: 'Watch local dance, music, or theatrical traditions come alive on stage', cost: 35, duration: 2 },
      { name: 'Theater or opera performance', description: 'Experience a live classic production at a historic venue', cost: 40, duration: 2.5 },
    ],
  },
  food: {
    morning: [
      { name: 'Breakfast at local cafe', description: 'Start the day with fresh pastries and locally roasted coffee', cost: 8, duration: 1 },
      { name: 'Visit local morning market', description: 'Browse stalls of fresh produce, spices, and artisan breads', cost: 5, duration: 1.5 },
      { name: 'Coffee tasting experience', description: 'Sample single-origin brews and learn about local coffee culture', cost: 10, duration: 1 },
      { name: 'Bakery tour and tasting', description: 'Visit a traditional bakery and sample freshly baked goods', cost: 12, duration: 1.5 },
    ],
    afternoon: [
      { name: 'Cooking class with local chef', description: 'Master signature dishes using local ingredients and techniques', cost: 45, duration: 3 },
      { name: 'Food tour of historic district', description: 'Taste your way through the neighborhood\'s best hidden food spots', cost: 50, duration: 2.5 },
      { name: 'Wine tasting at local vineyard', description: 'Sample regional wines paired with artisan cheeses and charcuterie', cost: 40, duration: 2 },
      { name: 'Farm-to-table lunch experience', description: 'Enjoy a meal prepared with ingredients harvested that morning', cost: 35, duration: 2 },
    ],
    evening: [
      { name: 'Dinner at famous local restaurant', description: 'Savor signature dishes at a chef-driven restaurant loved by locals', cost: 60, duration: 2 },
      { name: 'Late-night food market', description: 'Graze through stalls of grilled meats, seafood, and desserts after dark', cost: 15, duration: 1.5 },
      { name: 'Casual dinner with city views', description: 'Dine at a terrace restaurant with sweeping views of the skyline', cost: 40, duration: 1.5 },
      { name: 'Street food crawl', description: 'Sample authentic local dishes from street vendors and carts', cost: 20, duration: 2 },
    ],
  },
  nature: {
    morning: [
      { name: 'Hiking in national park', description: 'Follow scenic trails through forests, meadows, and ridgelines', cost: 10, duration: 2.5 },
      { name: 'Sunrise at panoramic viewpoint', description: 'Wake early for a breathtaking sunrise over the landscape', cost: 0, duration: 1.5 },
      { name: 'Botanical garden visit', description: 'Walk through curated gardens of tropical and native plant species', cost: 12, duration: 2 },
      { name: 'Bird watching tour', description: 'Spot rare and colorful species with an expert naturalist guide', cost: 25, duration: 2.5 },
    ],
    afternoon: [
      { name: 'Beach day and swimming', description: 'Relax on sandy shores and cool off in crystal-clear waters', cost: 5, duration: 3 },
      { name: 'Mountain cable car ride', description: 'Ascend to a mountain peak for sweeping panoramic views', cost: 20, duration: 2 },
      { name: 'River boat trip', description: 'Cruise along the river spotting wildlife and scenic gorges', cost: 30, duration: 2 },
      { name: 'Wildlife sanctuary tour', description: 'Observe animals in their natural or rehabilitated habitat', cost: 40, duration: 2.5 },
    ],
    evening: [
      { name: 'Sunset viewing at natural site', description: 'Watch the sky transform at a scenic coastal or hilltop viewpoint', cost: 0, duration: 1 },
      { name: 'Evening nature walk', description: 'Enjoy the cool evening air on a guided walk through natural scenery', cost: 0, duration: 1.5 },
    ],
  },
  adventure: {
    morning: [
      { name: 'Rock climbing adventure', description: 'Scale natural or indoor walls with expert instruction and safety gear', cost: 60, duration: 2.5 },
      { name: 'Mountain biking trails', description: 'Ride single-track trails through forests and hills with stunning views', cost: 50, duration: 2 },
      { name: 'Kayaking adventure', description: 'Paddle through rivers, lakes, or coastal waters with a guide', cost: 45, duration: 2 },
      { name: 'Zip line forest tour', description: 'Soar through the canopy on a series of zip lines over valleys', cost: 65, duration: 1.5 },
    ],
    afternoon: [
      { name: 'Hot air balloon ride', description: 'Float peacefully above the landscape with panoramic aerial views', cost: 150, duration: 2 },
      { name: 'Paragliding over landscape', description: 'Experience the thrill of tandem paragliding with certified instructors', cost: 120, duration: 1.5 },
      { name: 'Scuba diving experience', description: 'Explore underwater reefs and marine life with a dive instructor', cost: 80, duration: 2 },
      { name: 'White water rafting', description: 'Navigate rapids and calm stretches on an exhilarating river ride', cost: 55, duration: 2.5 },
    ],
    evening: [
      { name: 'Night hiking with guide', description: 'Experience the wilderness after dark with headlamps and stargazing', cost: 35, duration: 2 },
    ],
  },
  relaxation: {
    morning: [
      { name: 'Yoga at sunrise', description: 'Start the day centered with a guided yoga session in a scenic setting', cost: 20, duration: 1 },
      { name: 'Meditation session', description: 'Find inner peace with a guided mindfulness session', cost: 15, duration: 1 },
      { name: 'Morning spa treatment', description: 'Begin the day refreshed with a massage and aromatherapy session', cost: 80, duration: 1.5 },
      { name: 'Beach relaxation', description: 'Spend a leisurely morning lounging on the beach with a good book', cost: 0, duration: 3 },
    ],
    afternoon: [
      { name: 'Full spa day treatment', description: 'Enjoy multiple treatments including massage, facial, and body wrap', cost: 100, duration: 2 },
      { name: 'Thermal springs visit', description: 'Soak in natural warm mineral springs surrounded by scenery', cost: 30, duration: 2 },
      { name: 'Massage therapy', description: 'Relieve tension with a professional therapeutic massage', cost: 60, duration: 1.5 },
      { name: 'Garden meditation', description: 'Find tranquility in a peaceful garden setting with guided contemplation', cost: 5, duration: 1.5 },
    ],
    evening: [
      { name: 'Sunset yoga session', description: 'Stretch and breathe as the sun sets in a beautiful location', cost: 20, duration: 1 },
      { name: 'Evening spa ritual', description: 'Wind down with a calming treatment before a restful night', cost: 70, duration: 1.5 },
    ],
  },
  shopping: {
    morning: [
      { name: 'Local market shopping', description: 'Browse handmade goods, textiles, and unique local finds', cost: 20, duration: 2 },
      { name: 'Antique store browsing', description: 'Hunt for vintage treasures and one-of-a-kind collectibles', cost: 15, duration: 1.5 },
      { name: 'Local craft market', description: 'Support local artisans and find handcrafted souvenirs', cost: 30, duration: 2 },
    ],
    afternoon: [
      { name: 'Modern mall visit', description: 'Explore international brands and local designers under one roof', cost: 50, duration: 2.5 },
      { name: 'Fashion district tour', description: 'Discover boutiques and flagship stores in the city\'s style hub', cost: 80, duration: 2 },
      { name: 'Souvenir district exploration', description: 'Find memorable gifts and local specialty items', cost: 25, duration: 2 },
    ],
    evening: [
      { name: 'Night market experience', description: 'Browse stalls under colorful lights with street food and live music', cost: 30, duration: 2 },
    ],
  },
  nightlife: {
    evening: [
      { name: 'Rooftop bar with city views', description: 'Enjoy craft cocktails and panoramic city views from a chic rooftop', cost: 35, duration: 2 },
      { name: 'Live music venue', description: 'Catch a live band or DJ performance at a popular local venue', cost: 40, duration: 2.5 },
      { name: 'Comedy club visit', description: 'Laugh the night away with stand-up comedy performances', cost: 45, duration: 1.5 },
    ],
  },
};

// ─── UTILITY FUNCTIONS ───

function calculateTripDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function generateDayTitle(day: number, totalDays: number, destination: string): string {
  if (day === 1) return `Arrival in ${destination}`;
  if (day === totalDays) return 'Final Exploration & Departure';
  if (day === 2) return `${destination} Discovery`;

  const titles = [
    'Local Experiences',
    'Hidden Gems',
    'Off the Beaten Path',
    'Cultural Immersion',
    'Deeper Exploration',
    'Adventure Day',
    'Authentic Encounters',
  ];
  return titles[(day - 3) % titles.length];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickTimeSlot(timeOfDay: 'morning' | 'afternoon' | 'evening', index: number): string {
  const slots = TIME_SLOTS[timeOfDay];
  return slots[index % slots.length];
}

// ─── ACTIVITY SELECTION ───

function getActivitiesForTimeAndInterest(
  destination: string,
  interests: string[],
  timeOfDay: 'morning' | 'afternoon' | 'evening',
  budgetLevel: 'budget' | 'mid-range' | 'luxury',
  usedActivities: Set<string>,
  slotIndex: number
): Activity | null {
  const destKey = destination.toLowerCase().trim();
  const destActivities = DESTINATION_ACTIVITIES[destKey];

  // Try destination-specific activities first
  if (destActivities && destActivities[timeOfDay]) {
    const candidates = shuffleArray(destActivities[timeOfDay]);
    for (const act of candidates) {
      const key = `${act.name}-${timeOfDay}`;
      if (usedActivities.has(key)) continue;

      let cost = act.cost;
      if (budgetLevel === 'budget') cost = Math.round(cost * 0.6);
      else if (budgetLevel === 'luxury') cost = Math.round(cost * 1.8);

      usedActivities.add(key);
      return {
        time: pickTimeSlot(timeOfDay, slotIndex),
        activity: act.name,
        description: act.description,
        duration: act.duration,
        cost,
        type: 'culture',
        timeOfDay,
      };
    }
  }

  // Fallback to generic activities based on interests
  const candidateInterests = interests.length > 0 ? interests : ['culture', 'food', 'nature'];

  for (const interest of shuffleArray(candidateInterests)) {
    const db = GENERIC_ACTIVITIES[interest as keyof typeof GENERIC_ACTIVITIES];
    if (!db || !db[timeOfDay]) continue;

    let candidates = shuffleArray(db[timeOfDay]);
    if (budgetLevel === 'budget') {
      candidates = candidates.filter((a) => a.cost <= 30);
    } else if (budgetLevel === 'mid-range') {
      candidates = candidates.filter((a) => a.cost <= 70);
    }

    for (const act of candidates) {
      const key = `${act.name}-${timeOfDay}`;
      if (usedActivities.has(key)) continue;

      let cost = act.cost;
      if (budgetLevel === 'budget') cost = Math.round(cost * 0.7);
      else if (budgetLevel === 'luxury') cost = Math.round(cost * 1.6);

      usedActivities.add(key);
      return {
        time: pickTimeSlot(timeOfDay, slotIndex),
        activity: act.name,
        description: act.description,
        duration: act.duration,
        cost,
        type: interest as Activity['type'],
        timeOfDay,
      };
    }
  }

  return null;
}

// ─── BUDGET ALLOCATION ───

function calculateBudgetAllocation(
  budget: number,
  days: number,
  passengers: { adults: number; children: number; infants: number }
) {
  const flights = Math.round(budget * 0.25);
  const remaining = budget * 0.75;
  const hotels = Math.round((remaining * 0.4) / days) * days;
  const activitiesFood = remaining * 0.6;
  const activities = Math.round((activitiesFood * 0.55) / days) * days;
  const food = Math.round((activitiesFood * 0.45) / days) * days;

  return { flights, hotels, activities, food };
}

// ─── TRIP SCORE ───

function calculateTripScore(
  budget: number,
  budgetAllocation: { flights: number; hotels: number; activities: number; food: number },
  days: number,
  activitiesCount: number
): { budgetFit: number; activityDensity: number; overall: number } {
  const totalAllocated = Object.values(budgetAllocation).reduce((sum, val) => sum + val, 0);
  const budgetFit = totalAllocated <= budget ? 10 : Math.max(0, 10 - (totalAllocated / budget - 1) * 5);

  const optimalPerDay = 3;
  const actualPerDay = activitiesCount / days;
  const activityDensity =
    actualPerDay >= 2.5 && actualPerDay <= 3.5
      ? 10
      : Math.max(0, 10 - Math.abs(optimalPerDay - actualPerDay) * 2);

  return {
    budgetFit: Math.round(budgetFit * 10) / 10,
    activityDensity: Math.round(activityDensity * 10) / 10,
    overall: Math.round(((budgetFit + activityDensity) / 2) * 10) / 10,
  };
}

// ─── ITINERARY OPTION GENERATOR ───

function generateSmartItineraryOption(
  style: ItineraryOption['style'],
  days: number,
  startDate: string,
  endDate: string,
  budget: number,
  interests: string[],
  passengers: { adults: number; children: number; infants: number },
  description: string,
  destination: string
): ItineraryOption {
  const dayPlans: DayPlan[] = [];
  const usedActivities = new Set<string>();
  const activitiesPerDay = style === 'luxury' ? 4 : style === 'budget' ? 2 : 3;
  const budgetPerDay = budget / days;

  for (let day = 1; day <= days; day++) {
    const activities: Activity[] = [];

    // Day 1 = arrival so lighter schedule
    const timesOfDay: ('morning' | 'afternoon' | 'evening')[] =
      day === 1 ? ['afternoon', 'evening'] : ['morning', 'afternoon', 'evening'];

    let slotIndex = 0;
    for (const timeOfDay of timesOfDay) {
      if (activities.length >= activitiesPerDay) break;

      const budgetLevel = (style === 'luxury' || style === 'budget') ? style : 'mid-range';

      const activity = getActivitiesForTimeAndInterest(
        destination,
        interests,
        timeOfDay,
        budgetLevel,
        usedActivities,
        slotIndex
      );

      if (activity) {
        activities.push(activity);
        slotIndex++;
      }
    }

    dayPlans.push({
      day,
      title: generateDayTitle(day, days, destination),
      activities,
      budget: budgetPerDay,
      estimatedDailyBudget: Math.round(
        activities.reduce((sum, a) => sum + a.cost, 0) + budgetPerDay * 0.3
      ),
    });
  }

  const budgetAllocation = calculateBudgetAllocation(budget, days, passengers);
  const totalActivities = dayPlans.reduce((sum, day) => sum + day.activities.length, 0);
  const tripScore = calculateTripScore(budget, budgetAllocation, days, totalActivities);

  return {
    id: `${style}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' '),
    style,
    description,
    days: dayPlans,
    totalBudget: budget,
    numberOfDays: days,
    startDate,
    budgetAllocation,
    tripScore,
    estimatedCostPerDay: Math.round(budget / days),
  };
}

// ─── MAIN EXPORT ───

export async function generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
  const days = calculateTripDays(request.startDate, request.endDate);
  const finalInterests =
    request.interests && request.interests.length > 0 ? request.interests : ['culture', 'food', 'nature'];
  const destination = request.destination.split(',')[0].split('(')[0].trim();

  const options: ItineraryOption[] = [];

  // Option 1: Budget-Conscious
  options.push(
    generateSmartItineraryOption(
      'budget',
      days,
      request.startDate,
      request.endDate,
      Math.round(request.budget * 0.75),
      finalInterests,
      request.passengers,
      'Travel smart with affordable activities and authentic local experiences',
      destination
    )
  );

  // Option 2: Balanced (Mid-Range)
  options.push(
    generateSmartItineraryOption(
      'mid-range',
      days,
      request.startDate,
      request.endDate,
      request.budget,
      finalInterests,
      request.passengers,
      'Perfect balance of comfort, experiences, and authentic discoveries',
      destination
    )
  );

  // Option 3: Luxury
  options.push(
    generateSmartItineraryOption(
      'luxury',
      days,
      request.startDate,
      request.endDate,
      Math.round(request.budget * 1.4),
      finalInterests,
      request.passengers,
      'Premium accommodations and exclusive experiences throughout',
      destination
    )
  );

  // Option 4: Interest-focused
  const primaryInterest = finalInterests[0] || 'culture';
  const styleMap: Record<string, ItineraryOption['style']> = {
    adventure: 'adventure',
    culture: 'culture',
    food: 'culture',
    nature: 'relaxation',
    relaxation: 'relaxation',
    nightlife: 'adventure',
    shopping: 'mid-range',
  };

  const focusedStyle = styleMap[primaryInterest] || 'culture';
  if (!['budget', 'mid-range', 'luxury'].includes(focusedStyle)) {
    options.push(
      generateSmartItineraryOption(
        focusedStyle,
        days,
        request.startDate,
        request.endDate,
        Math.round(request.budget * 1.1),
        [focusedStyle, ...finalInterests.filter((i) => i !== focusedStyle)],
        request.passengers,
        `Curated for ${focusedStyle} lovers with complementary activities`,
        destination
      )
    );
  }

  return {
    options,
    destination: request.destination,
    numberOfDays: days,
    startDate: request.startDate,
    endDate: request.endDate,
  };
}
