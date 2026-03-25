import api from './axios'

const API_BASE = '/serviceability' // adjust based on your setup

const toFiniteNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export const normalizeLocationPayload = (data = {}) => {
  const {
    lat: geoLat,
    lng: geoLng,
    latitude: geoLatitude,
    longitude: geoLongitude,
    long: geoLong,
    ...geoWithoutAliases
  } = data.geo || {}

  const latCandidate = geoLat ?? geoLatitude ?? data?.lat ?? data?.latitude
  const lngCandidate = geoLng ?? geoLongitude ?? geoLong ?? data?.lng ?? data?.longitude ?? data?.long

  const normalizedLat = toFiniteNumberOrNull(latCandidate)
  const normalizedLng = toFiniteNumberOrNull(lngCandidate)

  const normalizedGeo = {
    ...geoWithoutAliases,
    ...(normalizedLat !== null ? { lat: normalizedLat } : {}),
    ...(normalizedLng !== null ? { lng: normalizedLng } : {}),
  }

  const {
    lat: rootLat,
    lng: rootLng,
    latitude: rootLatitude,
    longitude: rootLongitude,
    long: rootLong,
    ...payloadWithoutAliases
  } = data

  return {
    ...payloadWithoutAliases,
    geo: normalizedGeo,
  }
}

export const locationService = {
  fetchLocations: async (params) => {
    const res = await api.get(`${API_BASE}/locations`, { params })
    return res.data
  },

  getLocationById: async (id) => {
    const res = await api.get(`${API_BASE}/locations/${id}`)
    return res.data
  },

  createLocation: async (data) => {
    const res = await api.post(`${API_BASE}/locations`, normalizeLocationPayload(data))
    return res.data
  },

  updateLocation: async (id, data) => {
    const res = await api.put(`${API_BASE}/locations/${id}`, normalizeLocationPayload(data))
    return res.data
  },

  deleteLocation: async (id) => {
    await api.delete(`${API_BASE}/locations/${id}`)
  },
}
