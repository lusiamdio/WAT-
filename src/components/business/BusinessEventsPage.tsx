import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Share2,
  Search,
  Plus,
} from 'lucide-react';
import { INITIAL_BUSINESS_EVENTS } from './businessData';
import { BusinessEvent } from './businessTypes';

interface Props {
  onBack: () => void;
}

export const BusinessEventsPage: React.FC<Props> = ({ onBack }) => {
  const [events, setEvents] = useState<BusinessEvent[]>(INITIAL_BUSINESS_EVENTS);
  const [rsvpedEventIds, setRsvpedEventIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Trade Expo', 'Summit & B2B', 'Pop-Up & Runway', 'Workshop'];

  const toggleRsvp = (eventId: string) => {
    if (rsvpedEventIds.includes(eventId)) {
      setRsvpedEventIds(rsvpedEventIds.filter((id) => id !== eventId));
    } else {
      setRsvpedEventIds([...rsvpedEventIds, eventId]);
    }
  };

  const filtered = events.filter((evt) => {
    if (categoryFilter !== 'All' && evt.category !== categoryFilter) return false;
    if (
      search &&
      !evt.title.toLowerCase().includes(search.toLowerCase()) &&
      !evt.location.toLowerCase().includes(search.toLowerCase()) &&
      !evt.organizer.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-neutral-100 text-neutral-800 transition-colors shadow-xs group"
            title="Back to Business Dashboard"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span>Business Suite</span>
              <span>/</span>
              <span className="text-blue-600">Events & Summits</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Discover Events & Trade Summits
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {rsvpedEventIds.length} Events Attending
          </span>
        </div>
      </div>

      {/* Hero Banner for Summits */}
      <div className="p-6 sm:p-7 rounded-3xl bg-blue-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[10px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Pan-African Commerce Summits</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">Trade Shows, Craft Expos & Cross-Border Forums</h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            Network in person and virtually with artisans, logistics leaders, and government trade facilitators. Instant calendar sync with verified attendance pass.
          </p>
        </div>
        <div className="z-10 flex items-center gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <div className="text-lg font-black font-mono">14+</div>
            <div className="text-[10px] text-blue-200 uppercase font-bold">Summits in 2026</div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, city, or organizer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] focus:border-black text-xs font-medium focus:outline-none transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List / Grid */}
      <div className="space-y-4">
        {filtered.map((evt) => {
          const isRsvped = rsvpedEventIds.includes(evt.id);
          return (
            <div
              key={evt.id}
              className="rounded-3xl border border-black/[0.06] p-5 sm:p-6 flex flex-col md:flex-row gap-6 hover:border-blue-300 hover:shadow-md transition-all bg-white group"
            >
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full md:w-56 h-44 rounded-2xl object-cover ring-1 ring-black/10 shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {evt.category}
                    </span>
                    <span className="text-sm font-mono font-black text-neutral-900">
                      {evt.price}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-black/[0.04] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 font-medium">
                    <span className="flex items-center gap-1.5 text-neutral-800 font-bold">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {evt.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      {evt.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-neutral-400" />
                      {evt.attendeesCount} Registered
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert(`Event link copied for ${evt.title}`);
                      }}
                      className="p-2.5 rounded-2xl border border-black/[0.08] hover:bg-neutral-50 text-neutral-700 transition-colors"
                      title="Share Event"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleRsvp(evt.id)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                        isRsvped
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isRsvped ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pass Confirmed</span>
                        </>
                      ) : (
                        <>
                          <span>RSVP Attendance</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
