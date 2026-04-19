'use client';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-lg mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>AI Trip Planner
            </h3>
            <p className="text-slate-400 text-sm">
              Your intelligent travel companion powered by AI. Plan, explore, and adventure like never before.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Create Trip</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Dashboard</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">My Trips</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Favorites</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Travel Guides</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Destinations</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Tips & Tricks</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">&copy; 2026 AI Trip Planner. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20v-7.21H5.5V9.25h2.79V7.38c0-2.77 1.69-4.28 4.16-4.28 1.18 0 2.2.09 2.49.13v2.88h-1.71c-1.34 0-1.6.64-1.6 1.57v2.05h3.2l-4.16 3.54V20" /></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" /></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
