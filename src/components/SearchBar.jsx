import React, { useState, useEffect } from 'react'
import { fetchLocations, fetchCurrent } from '../api/weatherstack'

export default function SearchBar({ value, onChange, onSearch }) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    let mounted = true
    if (!value) {
      setSuggestions([])
      return
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetchLocations(value)
        if (mounted && res && res.locations) {
          setSuggestions(res.locations.slice(0, 6).map(l => l.name || l.region || l.country || l.locality))
          return
        }
      } catch (e) {
        // locations endpoint may be unavailable on some plans (404). Fallback to current endpoint.
      }

      try {
        const cur = await fetchCurrent(value)
        if (mounted && cur && cur.location) {
          const name = cur.location.name || `${cur.location.region || ''} ${cur.location.country || ''}`.trim()
          setSuggestions(name ? [name] : [])
        }
      } catch (e) {
        // ignore fallback errors
      }
    }, 400)
    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [value])

  return (
    <div className="searchbar">
      <input
        placeholder="City or coordinates (e.g., 36.96,-122.02)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <div className="suggestions">
        {suggestions.map((s, i) => (
          <div key={i} className="suggestion" onClick={() => onChange(s)}>
            {s}
          </div>
        ))}
        {suggestions.length === 0 && (
          <div className="info-grid" aria-hidden>
            <div className="info-card" onClick={() => { onChange('New York'); onSearch() }}>
              <svg className="mini-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4"/>
              </svg>
              <div className="info-title">Try: New York</div>
              <div className="info-sub">Clear • Tap to search</div>
            </div>
            <div className="info-card" onClick={() => { onChange('London'); onSearch() }}>
              <svg className="mini-icon cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 17.5A4.5 4.5 0 0 0 15.5 13h-1A6 6 0 1 0 4 16"/>
              </svg>
              <div className="info-title">Try: London</div>
              <div className="info-sub">Cloudy</div>
            </div>
            <div className="info-card" onClick={() => { onChange('Mumbai'); onSearch() }}>
              <svg className="mini-icon rain" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 13a4 4 0 0 0-8 0"/>
                <path d="M8 19l1.5-2M12 19l1.5-2M16 19l1.5-2"/>
              </svg>
              <div className="info-title">Try: Mumbai</div>
              <div className="info-sub">Rain</div>
            </div>
            <div className="info-card" onClick={() => { onChange('36.96,-122.02'); onSearch() }}>
              <svg className="mini-icon snow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M4.2 6.6l15.6 10.8"/>
              </svg>
              <div className="info-title">Try: Coordinates</div>
              <div className="info-sub">Use lat,lon</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
