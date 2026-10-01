import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogIn,
  CheckCircle2,
  Calendar,
  Wifi,
  Coffee,
  KeyRound,
  Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getRooms, checkInGuest } from '../api'

export default function CheckIn() {
  const [availableRooms, setAvailableRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    guestName: '',
    nicPassport: '',
    nationality: 'Sri Lankan',
    phone: '',
    email: '',
    vehicleNumber: '',
    roomNumber: '',
    adults: 2,
    children: 0,
    checkInDate: '2026-10-01',
    checkOutDate: '2026-10-03',
    advancePaid: 10000,
    paymentMethod: 'Cash',
    specialRequests: 'Extra pillows, garden facing'
  })

  const [activeCheckInSlip, setActiveCheckInSlip] = useState(null)
  const [recentCheckIns, setRecentCheckIns] = useState([
    { id: 'CHK-901', name: 'Dr. John Smith', room: '202', time: '10:15 AM', nights: 3, deposit: 'Rs. 25,000' },
    { id: 'CHK-902', name: 'Amal Perera', room: '102', time: '11:40 AM', nights: 2, deposit: 'Rs. 15,000' },
  ])

  // Fetch available rooms from MySQL
  const loadRooms = async () => {
    try {
      setLoading(true)
      const res = await getRooms()
      // Filter for Available or Reserved rooms
      const freeRooms = res.data.filter(r => r.status === 'Available' || r.status === 'Reserved')
      setAvailableRooms(freeRooms)
      if (freeRooms.length > 0) {
        setFormData(prev => ({ ...prev, roomNumber: freeRooms[0].number }))
      }
    } catch (err) {
      console.error('Failed to load rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const selectedRoom = availableRooms.find(r => r.number === formData.roomNumber) || {
    rate: 8500,
    price: 8500,
    type: 'Deluxe Room',
    number: '101'
  }

  const roomRate = Number(selectedRoom.price || selectedRoom.rate || 8500)

  // Calculate nights
  const d1 = new Date(formData.checkInDate)
  const d2 = new Date(formData.checkOutDate)
  const nights = Math.max(Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)), 1)
  const totalAmount = nights * roomRate

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.guestName || !formData.nicPassport || !formData.roomNumber) return

    try {
      // Send to Laravel API -> Updates Room to Occupied & adds Guest to CRM
      await checkInGuest({
        room_number: formData.roomNumber,
        guest_name: formData.guestName,
        phone: formData.phone,
        nic_passport: formData.nicPassport,
        nationality: formData.nationality,
        advance_paid: formData.advancePaid
      })

      const newRecord = {
        id: `CHK-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.guestName,
        room: formData.roomNumber,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nights: nights,
        deposit: `Rs. ${Number(formData.advancePaid).toLocaleString()}`
      }

      setRecentCheckIns([newRecord, ...recentCheckIns])

      // Generate Reception Welcome Key Card Slip
      setActiveCheckInSlip({
        ...formData,
        bookingRef: newRecord.id,
        roomType: selectedRoom.type,
        nights,
        totalAmount,
        balance: Math.max(totalAmount - formData.advancePaid, 0),
        wifiPass: 'RoyalCeylon@2026'
      })

      // Refresh available rooms
      loadRooms()
    } catch (err) {
      alert('Check-in error: ' + (err.response?.data?.message || err.message))
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
          style={{ marginBottom: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogIn size={28} color="#c9a84c" />
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
              Guest Check-In Desk
            </h1>
          </div>
          <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
            Directly flips room status to 'Occupied' in MySQL & logs guest to CRM
          </p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#c9a84c' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ color: '#74c69d', fontSize: '14px' }}>Loading available rooms...</p>
          </div>
        ) : (
          /* 2 Column Layout: Check-In Form & Recent Check-Ins Sidebar */
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '28px'
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '20px', marginBottom: '20px' }}>
                Registration & Room Key Card Issue
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Personal Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>GUEST FULL NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Kasun Chamara"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PASSPORT / NIC NUMBER</label>
                    <input
                      type="text"
                      placeholder="e.g. 19951230456V / N8765432"
                      value={formData.nicPassport}
                      onChange={(e) => setFormData({ ...formData, nicPassport: e.target.value })}
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
                </div>

                {/* Contact info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PHONE</label>
                    <input
                      type="text"
                      placeholder="+94 77 000 0000"
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>NATIONALITY</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>VEHICLE (OPTIONAL)</label>
                    <input
                      type="text"
                      placeholder="e.g. CAB-1234"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
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

                {/* Room Selection & Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>ASSIGN AVAILABLE ROOM (FROM MYSQL)</label>
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
                      {availableRooms.map((r) => (
                        <option key={r.number} value={r.number}>
                          Room #{r.number} - {r.type} (Rs. {Number(r.price).toLocaleString()}) [{r.status}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>ADULTS</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
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
                      <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>CHILDREN</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: e.target.value })}
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
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>CHECK-IN DATE</label>
                    <input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
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
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
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

                {/* Payment Advance */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>DEPOSIT / ADVANCE PAID (Rs.)</label>
                    <input
                      type="number"
                      value={formData.advancePaid}
                      onChange={(e) => setFormData({ ...formData, advancePaid: Number(e.target.value) })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PAYMENT METHOD</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
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
                      <option>Cash</option>
                      <option>Visa / MasterCard</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                </div>

                {/* Live Cost Summary Bar */}
                <div style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#a8b2aa' }}>Stay Duration</span>
                    <div style={{ color: 'white', fontWeight: 600 }}>{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#a8b2aa' }}>Room Rate</span>
                    <div style={{ color: 'white', fontWeight: 600 }}>Rs. {roomRate.toLocaleString()} / night</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#a8b2aa' }}>Total Bill</span>
                    <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: '17px' }}>Rs. {totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
                    color: '#0a1a0e',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <KeyRound size={18} /> Complete Check-In & Flip Room to Occupied
                </motion.button>
              </form>
            </motion.div>

            {/* Right Column: Hotel Info & Today's Check-ins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Quick Reception Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'rgba(64,145,108,0.1)',
                  border: '1px solid rgba(64,145,108,0.25)',
                  borderRadius: '16px',
                  padding: '20px'
                }}
              >
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#74c69d', fontSize: '16px', margin: '0 0 12px 0' }}>
                  Reception Desk Quick Info
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wifi size={14} color="#74c69d" />
                    <span>Guest WiFi: <strong>Royal_Guest_5G</strong> (Pass: <code>Ceylon@2026</code>)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Coffee size={14} color="#74c69d" />
                    <span>Complimentary Breakfast: <strong>06:30 AM - 10:30 AM</strong> (Lotus Hall)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="#74c69d" />
                    <span>Standard Check-Out Time: <strong>12:00 PM (Noon)</strong></span>
                  </div>
                </div>
              </motion.div>

              {/* Today's Recent Check-Ins */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  flex: 1
                }}
              >
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '18px', margin: '0 0 16px 0' }}>
                  Today's Arrivals
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentCheckIns.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{item.name}</div>
                        <div style={{ color: '#74c69d', fontSize: '11px', marginTop: '2px' }}>
                          Room #{item.room} • {item.nights} Nights • {item.time}
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#c9a84c', fontWeight: 600 }}>
                        {item.deposit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

          </div>
        )}

      </div>

      {/* Check-In Welcome Slip Modal */}
      <AnimatePresence>
        {activeCheckInSlip && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                width: '460px',
                background: 'linear-gradient(180deg, #112918 0%, #0a1a0e 100%)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '24px',
                padding: '30px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px', height: '60px',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircle2 size={32} color="#4ade80" />
              </div>

              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '24px', margin: '0 0 4px 0' }}>
                Check-In Successful!
              </h2>
              <p style={{ color: '#74c69d', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                Welcome to Royal Ceylon Hotel
              </p>

              {/* Guest Slip Card */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px dashed rgba(201,168,76,0.3)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '12px' }}>GUEST NAME:</span>
                  <strong style={{ color: 'white', fontSize: '13px' }}>{activeCheckInSlip.guestName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '12px' }}>ASSIGNED ROOM:</span>
                  <span style={{ color: '#f0c96b', fontWeight: 700, fontSize: '16px' }}>Room #{activeCheckInSlip.roomNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '12px' }}>ROOM CATEGORY:</span>
                  <span style={{ color: 'white', fontSize: '12px' }}>{activeCheckInSlip.roomType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '12px' }}>CHECK-OUT DATE:</span>
                  <span style={{ color: 'white', fontSize: '12px' }}>{activeCheckInSlip.checkOutDate} (12:00 PM)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '12px' }}>DEPOSIT RECEIVED:</span>
                  <span style={{ color: '#4ade80', fontWeight: 600, fontSize: '13px' }}>Rs. {Number(activeCheckInSlip.advancePaid).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '12px' }}>REMAINING BALANCE:</span>
                  <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: '14px' }}>Rs. {activeCheckInSlip.balance.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Print Key Slip
                </button>
                <button
                  onClick={() => setActiveCheckInSlip(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
                    color: '#0a1a0e',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
