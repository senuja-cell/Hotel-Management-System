import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Rooms endpoints
export const getRooms = () => api.get('/rooms')
export const createRoom = (data) => api.post('/rooms', data)
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data)
export const deleteRoom = (id) => api.delete(`/rooms/${id}`)

// Operational Check-In and Check-Out
export const checkInGuest = (data) => api.post('/check-in', data)
export const checkOutGuest = (data) => api.post('/check-out', data)

// Reservations endpoints
export const getReservations = () => api.get('/reservations')
export const createReservation = (data) => api.post('/reservations', data)
export const updateReservation = (id, data) => api.put(`/reservations/${id}`, data)
export const deleteReservation = (id) => api.delete(`/reservations/${id}`)

// Guests endpoints
export const getGuests = () => api.get('/guests')
export const createGuest = (data) => api.post('/guests', data)
export const updateGuest = (id, data) => api.put(`/guests/${id}`, data)
export const deleteGuest = (id) => api.delete(`/guests/${id}`)
