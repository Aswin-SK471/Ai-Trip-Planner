import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-blue)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--accent-purple)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: 'var(--accent-cyan)' }} />
      </div>

      {/* Floating abstract elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full bg-blue-500/20 blur-2xl animate-float" />
        <div className="absolute top-[40%] left-[20%] w-32 h-32 rounded-full bg-purple-500/20 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-20 h-20 rounded-full bg-pink-500/20 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-28 h-28 rounded-full bg-cyan-500/20 blur-2xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        {/* Badge */}
        <div className="animate-fade-in-up opacity-0 mb-8">
          <div className="glass-chip px-4 py-2 text-sm">
            <svg className="w-4 h-4 mr-2 inline-block text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI-Powered Travel Planning
          </div>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up opacity-0 delay-100 text-center max-w-4xl">
          <span className="block text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
            Plan Your Dream
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-7xl font-bold gradient-text leading-tight tracking-tight">
            Trip with AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up opacity-0 delay-200 mt-6 text-lg sm:text-xl text-slate-400 text-center max-w-2xl leading-relaxed">
          Search flights, generate smart itineraries, and explore destination insights —
          all powered by artificial intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up opacity-0 delay-300 flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/create-trip" className="btn-gradient px-8 py-4 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Start Planning</span>
          </Link>
          <Link href="/dashboard" className="btn-outline px-8 py-4 text-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span>View My Trips</span>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="animate-fade-in-up opacity-0 delay-400 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            {
              icon: <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
              title: 'AI Itineraries',
              desc: 'Day-by-day plans tailored to your interests & budget',
              color: 'from-blue-500/20 to-blue-600/5',
            },
            {
              icon: <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              title: 'Flight Search',
              desc: 'Compare flights from top airlines with real-time results',
              color: 'from-purple-500/20 to-purple-600/5',
            },
            {
              icon: <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              title: 'Smart Insights',
              desc: 'Weather, currency, tips & best time to visit any destination',
              color: 'from-cyan-500/20 to-cyan-600/5',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card p-6 text-center group"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up opacity-0 delay-500 mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { value: '10K+', label: 'Trips Planned' },
            { value: '150+', label: 'Destinations' },
            { value: '4.9★', label: 'User Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
