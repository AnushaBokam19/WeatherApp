import React from 'react'

function Icon({ description, iconUrl }) {
  const desc = (description || '').toLowerCase()
  if (iconUrl) {
    return <img src={iconUrl} alt={description} className="wicon" />
  }
  if (desc.includes('rain') || desc.includes('drizzle')) {
    return (
      <svg className="wicon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16 13a4 4 0 0 0-8 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 19l1.5-2M12 19l1.5-2M16 19l1.5-2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  if (desc.includes('snow')) {
    return (
      <svg className="wicon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 3v18M4.2 6.6l15.6 10.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  if (desc.includes('cloud') || desc.includes('overcast') || desc.includes('fog') || desc.includes('mist')) {
    return (
      <svg className="wicon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 17.5A4.5 4.5 0 0 0 15.5 13h-1A6 6 0 1 0 4 16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  // default sun / clear
  return (
    <svg className="wicon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Row({ label, children }) {
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  )
}

function formatLocaltime(localtime) {
  if (!localtime) return ''
  // localtime expected format "YYYY-MM-DD HH:MM"
  const t = localtime.replace(' ', 'T')
  const d = new Date(t)
  if (isNaN(d)) return localtime
  const day = d.toLocaleDateString(undefined, { weekday: 'long' })
  const date = d.toLocaleDateString()
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${day}, ${date} • ${time}`
}

export default function WeatherCard({ data, mode }) {
  const cur = data.current || {}
  const loc = data.location || {}
  const desc = (cur.weather_descriptions && cur.weather_descriptions[0]) || ''
  const icon = (cur.weather_icons && cur.weather_icons[0]) || null

  return (
    <div className="weathercard">
      <div className="card-head">
        <div className="location">
          <h2>{loc.name || loc.country || 'Unknown location'}</h2>
          <div className="muted">{loc.region ? `${loc.region}, ${loc.country}` : loc.country}</div>
          <div className="muted small">{formatLocaltime(loc.localtime)}</div>
        </div>
        <div className="primary-visual">
          <Icon description={desc} iconUrl={icon} />
          <div className="temp">{cur.temperature != null ? `${cur.temperature}°C` : '--'}</div>
          <div className="desc">{desc}</div>
        </div>
      </div>

      <div className="card-body glass">
        <div className="left">
          <Row label="Feels like">{cur.feelslike != null ? `${cur.feelslike}°C` : '--'}</Row>
          <Row label="Condition">{desc || '—'}</Row>
          <Row label="Wind">{cur.wind_speed ? `${cur.wind_speed} km/h ${cur.wind_dir || ''}` : '—'}</Row>
          <Row label="Humidity">{cur.humidity != null ? `${cur.humidity}%` : '—'}</Row>
        </div>
        <div className="right">
          <Row label="Pressure">{cur.pressure ? `${cur.pressure} hPa` : '—'}</Row>
          <Row label="Visibility">{cur.visibility ? `${cur.visibility} km` : '—'}</Row>
          <Row label="Cloud cover">{cur.cloudcover != null ? `${cur.cloudcover}%` : '—'}</Row>
          <Row label="UV index">{cur.uv_index != null ? cur.uv_index : '—'}</Row>
        </div>
      </div>

      <details className="more glass">
        <summary>Raw data</summary>
        <pre className="json">{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  )
}
