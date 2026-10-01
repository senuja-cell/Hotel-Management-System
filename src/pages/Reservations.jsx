import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  X,
  Phone,
  Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getReservations, createReservation, updateReservation, deleteReservation, getRooms } from '../api'

const statusBadges = {
  Confirmed: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', color: '#4ade80', icon: CheckCircle2 },
  Pending:   { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', icon: Clock },
  Cancelled: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', color: '#f87171', icon: XCircle },
}

const paymentBadges = {
  Paid:           { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
  'Deposit Paid': { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' },
  Unpaid:         { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
  Refunded:       { bg: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1' },
}

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  // New reservation form state
  const [formData, setFormData] = useState({
    guest: '',
    phone: '',
    email: '',
    roomNumber: '101',
    checkIn: '2026-10-02',
    checkOut: '2026-10-04',
    guestsCount: 2,
    paymentStatus: 'Deposit Paid'
  })

  // Fetch reservations & rooms from API
  const fetchLiveData = async () => {
    try {
      setLoading(true)
      const [resRes, roomsRes] = await Promise.all([
        getReservations(),
        getRooms()
      ])
      setReservations(resRes.data)
      setRoomsList(roomsRes.data)
      if (roomsRes.data.length > 0) {
        setFormData(prev => ({ ...prev, roomNumber: roomsRes.data[0].number }))
      }
    } catch (err) {
      console.error('Failed to load reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveData()
  }, [])

  // Calculate nights and total dynamically
  const selectedRoom = roomsList.find(r => r.number === formData.roomNumber) || { rate: 8500, type: 'Deluxe Room', number: '101' }
  const roomPrice = Number(selectedRoom.price || selectedRoom.rate || 8500)
  const dIn = new Date(formData.checkIn)
  const dOut = new Date(formData.checkOut)
  const diffTime = Math.max(dOut - dIn, 0)
  const calculatedNights = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1)
  const calculatedTotal = calculatedNights * roomPrice

  // Filter and search
  const filtered = reservations.filter(res => {
    const matchesFilter = filter === 'All' || res.status === filter
    const guestName = res.guest || ''
    const bookingCode = res.booking_code || res.id || ''
    const rNum = String(res.room_number || '')
    const matchesSearch = guestName.toLowerCase().includes(search.toLowerCase()) ||
                          bookingCode.toLowerCase().includes(search.toLowerCase()) ||
                          rNum.includes(search)
    return matchesFilter && matchesSearch
  })

  // Create new reservation via POST
  const handleCreateReservation = async (e) => {
    e.preventDefault()
    if (!formData.guest || !formData.phone) return

    try {
      const payload = {
        booking_code: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
        guest: formData.guest,
        phone: formData.phone,
        email: formData.email,
        room_number: selectedRoom.number,
        room_type: selectedRoom.type,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        nights: calculatedNights,
        total: calculatedTotal,
        status: 'Confirmed',
        payment_status: formData.paymentStatus,
        guests_count: Number(formData.guestsCount)
      }

      const res = await createReservation(payload)
      setReservations([res.data, ...reservations])
      setShowModal(false)
      setFormData({
        guest: '',
        phone: '',
        email: '',
        roomNumber: roomsList[0]?.number || '101',
        checkIn: '2026-10-02',
        checkOut: '2026-10-04',
        guestsCount: 2,
        paymentStatus: 'Deposit Paid'
      })
    } catch (err) {
      alert('Error creating reservation: ' + (err.response?.data?.message || err.message))
    }
  }

  // Cancel reservation via PUT
  const handleCancelReservation = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await updateReservation(id, { status: 'Cancelled' })
      setReservations(reservations.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r))
    } catch (err) {
      alert('Failed to cancel reservation: ' + err.message)
    }
  }

  // Delete reservation via DELETE
  const handleDelete = async (id) => {
    if (!confirm('Delete this reservation record from MySQL?')) return
    try {
      await deleteReservation(id)
      setReservations(reservations.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete reservation: ' + err.message)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px', position: 'relative', zIndex: 10 }}>

        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarDays size={28} color="#c9a84c" />
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
                Reservations & Bookings
              </h1>
            </div>
            <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
              Live booking system connected to Laravel REST API & MySQL
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
              color: '#0a1a0e',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(201,168,76,0.3)'
            }}
          >
            <Plus size={18} /> New Reservation
          </motion.button>
        </motion.div>

        {/* Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Confirmed', 'Pending', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: filter === st ? 'rgba(201,168,76,0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: filter === st ? '#f0c96b' : '#a8b2aa',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: filter === st ? 'rgba(201,168,76,0.5)' : 'transparent',
                }}
              >
                {st} ({st === 'All' ? reservations.length : reservations.filter(r => r.status === st).length})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={16} color="#74c69d" />
            <input
              type="text"
              placeholder="Search by ID, guest, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '13px',
                width: '220px'
              }}
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#c9a84c' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ color: '#74c69d', fontSize: '14px' }}>Loading reservations from database...</p>
          </div>
        ) : (
          /* Reservations Table */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)', borderBottom: '1px solid rgba(116,198,157,0.15)' }}>
                  {['Booking ID', 'Guest Details', 'Room Info', 'Dates', 'Nights', 'Total Amount', 'Status', 'Payment', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        color: '#74c69d',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#a8b2aa' }}>
                      No reservations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((res, i) => {
                    const StatusIcon = statusBadges[res.status]?.icon || Clock
                    const bookingCode = res.booking_code || `RC-${res.id}`
                    return (
                      <motion.tr
                        key={res.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.04 * i }}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                      >
                        {/* Booking ID */}
                        <td style={{ padding: '16px', fontWeight: 700, color: '#f0c96b', fontSize: '13px' }}>
                          {bookingCode}
                        </td>

                        {/* Guest Details */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{res.guest}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a8b2aa', fontSize: '12px', marginTop: '3px' }}>
                            <Phone size={12} color="#74c69d" /> {res.phone}
                          </div>
                        </td>

                        {/* Room Info */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>Room #{res.room_number}</div>
                          <div style={{ color: '#a8b2aa', fontSize: '12px' }}>{res.room_type}</div>
                        </td>

                        {/* Dates */}
                        <td style={{ padding: '16px', fontSize: '12px' }}>
                          <div style={{ color: '#74c69d' }}>In: {String(res.check_in).substring(0, 10)}</div>
                          <div style={{ color: '#a8b2aa' }}>Out: {String(res.check_out).substring(0, 10)}</div>
                        </td>

                        {/* Nights */}
                        <td style={{ padding: '16px', color: 'white', fontSize: '13px' }}>
                          {res.nights} {res.nights === 1 ? 'Night' : 'Nights'}
                        </td>

                        {/* Total */}
                        <td style={{ padding: '16px', color: '#c9a84c', fontWeight: 700, fontSize: '14px' }}>
                          Rs. {Number(res.total).toLocaleString()}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: statusBadges[res.status]?.bg,
                            color: statusBadges[res.status]?.color,
                            border: `1px solid ${statusBadges[res.status]?.border}`
                          }}>
                            <StatusIcon size={12} />
                            {res.status}
                          </span>
                        </td>

                        {/* Payment */}
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: paymentBadges[res.payment_status]?.bg || 'rgba(255,255,255,0.1)',
                            color: paymentBadges[res.payment_status]?.color || '#ffffff'
                          }}>
                            {res.payment_status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {res.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleCancelReservation(res.id)}
                                title="Cancel Reservation"
                                style={{
                                  background: 'rgba(239,68,68,0.15)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  borderRadius: '6px',
                                  color: '#f87171',
                                  padding: '6px',
                                  cursor: 'pointer'
                                }}
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(res.id)}
                              title="Delete from Database"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#a8b2aa',
                                padding: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </motion.div>
        )}

      </div>

      {/* New Reservation Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '520px',
                background: 'linear-gradient(180deg, #112918 0%, #0a1a0e 100%)',
                border: '1px solid rgba(116,198,157,0.25)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '22px', margin: 0 }}>
                  Create New Reservation (MySQL)
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateReservation}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>GUEST FULL NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Ruwan Wickramasinghe"
                    value={formData.guest}
                    onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(116,198,157,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PHONE NUMBER</label>
                    <input
                      type="text"
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(116,198,157,0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      placeholder="guest@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(116,198,157,0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>SELECT ROOM</label>
                    <select
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#0d2415',
                        border: '1px solid rgba(116,198,157,0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      {roomsList.map((r) => (
                        <option key={r.number} value={r.number}>
                          Room #{r.number} - {r.type} (Rs. {Number(r.price).toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PAYMENT STATUS</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#0d2415',
                        border: '1px solid rgba(116,198,157,0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Deposit Paid">Deposit Paid</option>
                      <option value="Paid">Fully Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>CHECK-IN DATE</label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#0d2415',
                        border: '1px solid rgba(116,198,157,0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>CHECK-OUT DATE</label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#0d2415',
                        border: '1px solid rgba(116,198,157,0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Auto Calculated Summary Box */}
                <div style={{
                  padding: '14px',
                  background: 'rgba(201,168,76,0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(201,168,76,0.25)',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#a8b2aa' }}>Calculated Duration</span>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                      {calculatedNights} {calculatedNights === 1 ? 'Night' : 'Nights'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#a8b2aa' }}>Estimated Total</span>
                    <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: '18px' }}>
                      Rs. {calculatedTotal.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
                      color: '#0a1a0e',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Confirm & Save to MySQL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#a8b2aa',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
