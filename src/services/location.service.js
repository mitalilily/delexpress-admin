import api from './axios'

const API_BASE = '/serviceability' // adjust based on your setup

export const normalizeLocationPayload = (data = {}) => {
  const lat = data?.geo?.lat ?? data?.geo?.latitude ?? data?.lat ?? data?.latitude
  const lng =
    data?.geo?.lng ?? data?.geo?.longitude ?? data?.lng ?? data?.longitude ?? data?.long
  const normalizedLat = Number(lat)
  const normalizedLng = Number(lng)

  const normalizedGeo = {
    ...(data.geo || {}),
    ...(Number.isFinite(normalizedLat) ? { lat: normalizedLat } : {}),
    ...(Number.isFinite(normalizedLng) ? { lng: normalizedLng } : {}),
  }

  return {
    ...data,
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
