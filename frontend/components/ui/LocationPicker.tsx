"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed, Search, Loader2, CheckCircle2 } from "lucide-react";

interface PlaceResult {
  display_name: string;
  lat: number;
  lon: number;
}

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number) => void;
  placeholder?: string;
}

const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&accept-language=en`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.display_name ?? null;
  } catch {
    return null;
  }
};

export function LocationPicker({ latitude, longitude, onChange, placeholder }: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasCoords = latitude !== 0 || longitude !== 0;

  useEffect(() => {
    if (!hasCoords) return;
    let cancelled = false;
    reverseGeocode(latitude, longitude).then((name) => {
      if (!cancelled && name) setPlaceName(name);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  const search = (term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            term + ", Kenya"
          )}&format=jsonv2&accept-language=en&addressdetails=1&limit=6`
        );
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const pick = (r: PlaceResult) => {
    onChange(Number(r.lat), Number(r.lon));
    setPlaceName(r.display_name);
    setQuery(r.display_name);
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this device.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        onChange(lat, lon);
        const name = await reverseGeocode(lat, lon);
        setPlaceName(name);
        setQuery(name ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        setError("Could not get your location. Check permissions or search for your area instead.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="col-span-2">
      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
        Farm Location
      </label>

      {/* Location buttons */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-accent text-white text-xs font-semibold px-3 py-2 hover:bg-emerald-950 transition-colors disabled:opacity-50"
        >
          {locating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5" />
          )}
          Use my current location
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder={placeholder ?? "Search for your area e.g. Subukia, Kitale, Homa Bay…"}
          className="w-full border border-stone-300 rounded-lg py-2 pl-9 pr-9 text-sm bg-white outline-none focus:border-emerald-600"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-stone-400" />
        )}
        {showResults && results.length > 0 && (
          <ul className="absolute z-20 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={() => pick(r)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50"
                >
                  <span className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0" />
                    {r.display_name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation */}
      {hasCoords && placeName && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="font-medium">{placeName}</span>
        </p>
      )}
      {hasCoords && !placeName && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
          <MapPin className="w-3.5 h-3.5" />
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      )}
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}