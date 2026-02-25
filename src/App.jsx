import React, { useState } from 'react'
import { fetchCurrent, fetchHistorical, fetchForecast, fetchMarine, fetchLocations } from './api/weatherstack'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'

const TABS = ['current', 'historical', 'forecast', 'marine', 'locations']

export default function App() {
  const [tab, setTab] = useState('current')
  const [query, setQuery] = useState('New York')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [historicalDate, setHistoricalDate] = useState('')
  const [forecastDays, setForecastDays] = useState(3)

  async function run() {
    setLoading(true)
    setError(null)
    try {
      let res = null
      if (tab === 'current') res = await fetchCurrent(query)
      if (tab === 'historical') res = await fetchHistorical(query, historicalDate || undefined)
      if (tab === 'forecast') res = await fetchForecast(query, forecastDays)
      if (tab === 'marine') res = await fetchMarine(query)
      if (tab === 'locations') res = await fetchLocations(query)
      setResult(res)
    } catch (e) {
      // Better surface API errors coming from axios / Weatherstack
      const apiMsg = e?.response?.data?.error?.info || e?.response?.data?.error || e?.message
      setError(apiMsg || e.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="topbar glass">
        <h1 className="brand">Whether</h1>
        <nav className="tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="container">
        <section className="panel glass">
          <div className="controls">
            <SearchBar value={query} onChange={setQuery} onSearch={run} />
            <div className="filters">
              {tab === 'historical' && (
                <input type="date" value={historicalDate} onChange={e => setHistoricalDate(e.target.value)} />
              )}
              {tab === 'forecast' && (
                <input type="number" min="1" max="14" value={forecastDays} onChange={e => setForecastDays(Number(e.target.value))} />
              )}
              <button className="primary" onClick={run} disabled={loading}>
                {loading ? 'Loading...' : 'Get'}
              </button>
            </div>
          </div>
        </section>

        <section className="panel results glass">
          {error && <div className="error">{error}</div>}
          {!result && <div className="hint">Search for a location and press Get to see results.</div>}
          {result && <WeatherCard data={result} mode={tab} />}
        </section>
      </main>

      <footer className="footer glass">
        <small>Whether — realistic SaaS weather UI • Glassmorphic design</small>
      </footer>
    </div>
  )
}
