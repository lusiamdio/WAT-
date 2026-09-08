import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ExternalLink,
  Globe,
  Sparkles,
  Send,
  X,
  RefreshCw,
  Navigation,
  Star,
  Copy,
  Check,
  Compass,
  CornerDownLeft,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface WebChunk {
  web?: {
    uri: string;
    title: string;
  };
}

interface MapChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: Array<{
        reviewText?: string;
        author?: string;
        uri?: string;
      }>;
    };
  };
}

interface ExtractedUrl {
  title: string;
  uri: string;
  type: 'place' | 'review';
}

interface GoogleGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareToChat?: (content: string, type: 'search' | 'maps', metadata?: any) => void;
  initialTab?: 'search' | 'maps';
}

export const GoogleGroundingModal: React.FC<GoogleGroundingModalProps> = ({
  isOpen,
  onClose,
  onShareToChat,
  initialTab = 'search',
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps'>(initialTab);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchAnswer, setSearchAnswer] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<WebChunk[]>([]);
  const [webSearchQueries, setWebSearchQueries] = useState<string[]>([]);
  const [searchModel, setSearchModel] = useState<string>('gemini-3.5-flash');

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsAnswer, setMapsAnswer] = useState<string | null>(null);
  const [mapsSources, setMapsSources] = useState<MapChunk[]>([]);
  const [extractedUrls, setExtractedUrls] = useState<ExtractedUrl[]>([]);
  const [mapsModel, setMapsModel] = useState<string>('gemini-3.5-flash');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Request user location on Maps tab if available
  useEffect(() => {
    if (activeTab === 'maps' && !userLocation && navigator.geolocation) {
      handleGetLocation(false);
    }
  }, [activeTab]);

  const handleGetLocation = (triggerSearch = true) => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationName(`Lat: ${coords.latitude.toFixed(3)}, Lng: ${coords.longitude.toFixed(3)}`);
        if (triggerSearch && mapsQuery.trim()) {
          runMapsSearch(mapsQuery, coords);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation denied or unavailable:', err.message);
      },
      { timeout: 8000 }
    );
  };

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    setSearchAnswer(null);
    setSearchSources([]);
    setWebSearchQueries([]);
    soundEngine.playChime();

    try {
      const res = await fetch('/api/ai/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
        }),
      });

      const data = await res.json();
      setSearchAnswer(data.answer || 'No response returned from Search Grounding.');
      setSearchSources(data.groundingChunks || []);
      setWebSearchQueries(data.webSearchQueries || []);
      setSearchModel(data.source || 'gemini-3.5-flash');
      soundEngine.playMessageSent();
    } catch (err: any) {
      setSearchAnswer(`Failed to query Google Search Grounding: ${err?.message || 'Network error'}`);
    } finally {
      setIsSearching(false);
    }
  };

  const runMapsSearch = async (query: string, loc = userLocation) => {
    if (!query.trim() || isSearchingMaps) return;

    setIsSearchingMaps(true);
    setMapsAnswer(null);
    setMapsSources([]);
    setExtractedUrls([]);
    soundEngine.playChime();

    try {
      const res = await fetch('/api/ai/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          latitude: loc?.latitude,
          longitude: loc?.longitude,
        }),
      });

      const data = await res.json();
      setMapsAnswer(data.answer || 'No places information found.');
      setMapsSources(data.groundingChunks || []);
      setExtractedUrls(data.extractedUrls || []);
      setMapsModel(data.source || 'gemini-3.5-flash');
      soundEngine.playMessageSent();
    } catch (err: any) {
      setMapsAnswer(`Failed to retrieve Maps Grounding: ${err?.message || 'Network error'}`);
    } finally {
      setIsSearchingMaps(false);
    }
  };

  const handleMapsSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runMapsSearch(mapsQuery);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSearchToChat = () => {
    if (!searchAnswer) return;
    let shareText = `🔍 **Google Search Grounding (gemini-3.5-flash)**\n*Query: ${searchQuery}*\n\n${searchAnswer}`;
    if (searchSources.length > 0) {
      shareText += `\n\n**Sources:**\n`;
      searchSources.forEach((c) => {
        if (c.web?.uri) {
          shareText += `• [${c.web.title || c.web.uri}](${c.web.uri})\n`;
        }
      });
    }
    if (onShareToChat) {
      onShareToChat(shareText, 'search', { query: searchQuery, sources: searchSources });
    }
    onClose();
  };

  const handleShareMapsToChat = () => {
    if (!mapsAnswer) return;
    let shareText = `📍 **Google Maps Grounding (gemini-3.5-flash)**\n*Place Query: ${mapsQuery}*\n\n${mapsAnswer}`;
    if (extractedUrls.length > 0) {
      shareText += `\n\n**Google Maps Links & Reviews:**\n`;
      extractedUrls.forEach((u) => {
        shareText += `• [${u.title}](${u.uri})\n`;
      });
    }
    if (onShareToChat) {
      onShareToChat(shareText, 'maps', { query: mapsQuery, urls: extractedUrls });
    }
    onClose();
  };

  const searchSuggestions = [
    'Latest SpaceX launch update & mission status',
    'Today European football scores and transfer news',
    'Current tech stock market summary and currency trends',
    'AI developments and announcements this month',
  ];

  const mapsSuggestions = [
    'Specialty coffee shops with fast Wi-Fi',
    'Top rated authentic Italian restaurants',
    'Pharmacies and emergency healthcare open now',
    'Scenic landmarks and parks for walking',
  ];

  if (!isOpen) return null;

  return (
    <div
      id="google-grounding-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-black/10 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Google Grounding Hub</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  gemini-3.5-flash
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Verified real-time information with Google Search & Google Maps data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-2 bg-neutral-100/70 border-b border-black/[0.06] gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'search'
                ? 'bg-white text-neutral-900 shadow-sm border border-black/[0.06]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span>Google Search Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('maps')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'maps'
                ? 'bg-white text-neutral-900 shadow-sm border border-black/[0.06]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Google Maps Grounding</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'search' ? (
            /* Search Grounding View */
            <div className="space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center gap-2 bg-neutral-50 border border-black/[0.08] focus-within:border-black/30 focus-within:bg-white rounded-2xl px-3.5 py-2.5 shadow-inner transition-all">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything requiring real-time web verification..."
                    className="flex-1 bg-transparent text-sm text-neutral-900 focus:outline-none placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Ground</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Suggestions */}
              {!searchAnswer && !isSearching && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Suggested Search Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(sug);
                        }}
                        className="text-xs bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-700 px-3 py-1.5 rounded-xl text-left transition-colors flex items-center gap-1.5 border border-black/[0.04]"
                      >
                        <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isSearching && (
                <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm animate-pulse">
                    <Search className="w-6 h-6 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-900">Querying Google Search Grounding</h4>
                    <p className="text-xs text-neutral-500 max-w-sm">
                      Synthesizing live web results with gemini-3.5-flash and verifying citations...
                    </p>
                  </div>
                </div>
              )}

              {/* Search Result */}
              {searchAnswer && (
                <div className="space-y-4 pt-1 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-neutral-50/80 border border-black/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Grounded Answer
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(searchAnswer)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors"
                          title="Copy Answer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                      {searchAnswer}
                    </p>

                    {webSearchQueries.length > 0 && (
                      <div className="pt-2 border-t border-black/[0.04] flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold text-neutral-400">Search Queries:</span>
                        {webSearchQueries.map((q, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white border border-black/[0.06] text-neutral-600 px-2 py-0.5 rounded-md"
                          >
                            "{q}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sources List */}
                  {searchSources.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        Verified Google Search Sources ({searchSources.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {searchSources.map((chunk, idx) => {
                          const uri = chunk.web?.uri;
                          const title = chunk.web?.title || uri;
                          if (!uri) return null;
                          return (
                            <a
                              key={idx}
                              href={uri}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-white border border-black/[0.08] hover:border-blue-400 hover:shadow-sm transition-all group flex items-start gap-2 text-left"
                            >
                              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ExternalLink className="w-3 h-3" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                                  {title}
                                </p>
                                <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                                  {uri}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Share to Chat Action */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={handleShareSearchToChat}
                      className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share Search to Chat</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Maps Grounding View */
            <div className="space-y-4">
              <form onSubmit={handleMapsSubmit} className="space-y-2">
                <div className="flex items-center gap-2 bg-neutral-50 border border-black/[0.08] focus-within:border-black/30 focus-within:bg-white rounded-2xl px-3.5 py-2.5 shadow-inner transition-all">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    placeholder="Find places, restaurants, coffee shops, directions..."
                    className="flex-1 bg-transparent text-sm text-neutral-900 focus:outline-none placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingMaps || !mapsQuery.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isSearchingMaps ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Exploring...</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-3.5 h-3.5" />
                        <span>Ground Maps</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Geolocation bar */}
                <div className="flex items-center justify-between px-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleGetLocation(true)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>
                      {userLocation ? `Location attached: ${locationName}` : 'Attach My Location (GPS)'}
                    </span>
                  </button>

                  <span className="text-[11px] text-neutral-400">
                    Maps Grounding Tool (gemini-3.5-flash)
                  </span>
                </div>
              </form>

              {/* Suggestions */}
              {!mapsAnswer && !isSearchingMaps && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Explore Place Ideas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mapsSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setMapsQuery(sug);
                          runMapsSearch(sug);
                        }}
                        className="text-xs bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-700 px-3 py-1.5 rounded-xl text-left transition-colors flex items-center gap-1.5 border border-black/[0.04]"
                      >
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isSearchingMaps && (
                <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-pulse">
                    <Compass className="w-6 h-6 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-900">Querying Google Maps Grounding</h4>
                    <p className="text-xs text-neutral-500 max-w-sm">
                      Retrieving place data, reviews, and interactive map URLs with gemini-3.5-flash...
                    </p>
                  </div>
                </div>
              )}

              {/* Maps Result */}
              {mapsAnswer && (
                <div className="space-y-4 pt-1 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Google Maps Recommendation
                      </span>
                      <button
                        onClick={() => handleCopy(mapsAnswer)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors"
                        title="Copy Answer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                      {mapsAnswer}
                    </p>
                  </div>

                  {/* Extracted Google Maps Links (MANDATORY REQUIREMENT) */}
                  {extractedUrls.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Extracted Google Maps Places & Reviews ({extractedUrls.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                        {extractedUrls.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl bg-white border border-black/[0.08] hover:border-emerald-400 hover:shadow-sm transition-all group flex items-start gap-2 text-left"
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <ExternalLink className="w-3 h-3" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors truncate">
                                {link.title}
                              </p>
                              <span className="inline-block text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                                {link.type === 'place' ? 'Google Maps Place' : 'Google Review'}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Maps to Chat */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={handleShareMapsToChat}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share Location to Chat</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
