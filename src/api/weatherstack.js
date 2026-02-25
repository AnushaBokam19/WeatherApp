import axios from 'axios'

const BASE = 'https://api.weatherstack.com'
const KEY = import.meta.env.VITE_WEATHERSTACK_KEY

async function get(path, params = {}) {
  const url = `${BASE}/${path}`
  const res = await axios.get(url, {
    params: { access_key: KEY, ...params }
  })
  if (res.data.error) throw new Error(res.data.error.info || JSON.stringify(res.data.error))
  return res.data
}

export const fetchCurrent = async (query) => {
  return get('current', { query, units: 'm' })
}

export const fetchHistorical = async (query, date) => {
  // weatherstack historical expects historical_date or historical_date param per docs; accept single date
  const params = {}
  if (date) params.historical_date = date
  return get('historical', { query, ...params, units: 'm' })
}

export const fetchForecast = async (query, days = 3) => {
  return get('forecast', { query, forecast_days: days, units: 'm' })
}

export const fetchMarine = async (query) => {
  // marine endpoint often requires coordinates, but weatherstack supports query (e.g., "36.96,-122.02")
  return get('marine', { query })
}

export const fetchLocations = async (query) => {
  return get('locations', { query })
}
