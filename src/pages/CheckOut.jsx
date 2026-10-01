import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  Search,
  CheckCircle2,
  Printer,
  X,
  Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getRooms, checkOutGuest } from '../api'

export default function CheckOut() {
  const [occupiedRooms, setOccupiedRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [completedInvoice, setCompletedInvoice] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('Visa / MasterCard')

  // Fetch occupied rooms from MySQL
  const loadOccupied = async () => {
    try {
      setLoading(true)
      const res = await getRooms()
      // Only keep rooms that have guests and are occupied
      const occupied = res.data
        .filter(r => r.status === 'Occupied')
        .map(r => ({
          id: `OCC-${r.id}`,
          roomId: r.id,
          name: r.guest || 'Valued Guest',
          phone: '+94 77 000 0000',
          roomNumber: r.number,
          roomType: r.type,
          ratePerNight: Number(r.price),
          checkInDate: '2026-09-29',
          checkOutDate: '2026-10-01',
          nights: 2,
          depositPaid: Math.round(Number(r.price) * 0.8),
          roomService: 4500,
          laundry: 1200,
          minibar: 2500,
        }))
      setOccupiedRooms(occupied)
    } catch (err) {
      console.error('Failed to load occupied rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOccupied()
  }, [])

  // Search filter
  const filtered = occupiedRooms.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.roomNumber.includes(search) ||
    g.id.toLowerCase().includes(search.toLowerCase())
  )

  // Calculations for selected checkout guest
  const calculateBill = (guest) => {
    if (!guest) return { roomCharges: 0, extrasTotal: 0, grossTotal: 0, netPayable: 0 }
    const roomCharges = guest.nights * guest.ratePerNight
    const extrasTotal = guest.roomService + guest.laundry + guest.minibar
    const grossTotal = roomCharges + extrasTotal
    const netPayable = Math.max(grossTotal - guest.depositPaid, 0)
    return { roomCharges, extrasTotal, grossTotal, netPayable }
  }

  const bill = calculateBill(selectedGuest)

  // Finalize Check-Out: Sends API request to flip room to Cleaning in MySQL!
  const handleFinalizeCheckOut = async () => {
    if (!selectedGuest) return

    try {
      await checkOutGuest({ room_number: selectedGuest.roomNumber })

      const invoiceData = {
        ...selectedGuest,
        invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        checkoutTimestamp: new Date().toLocaleString(),
        paymentMethod,
        ...bill
      }

      setCompletedInvoice(invoiceData)
      setSelectedGuest(null)
      // Reload MySQL occupied rooms
      loadOccupied()
    } catch (err) {
      alert('Error checking out: ' + (err.response?.data?.message || err.message))
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
            <LogOut size={28} color="#c9a84c" />
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
              Guest Check-Out & Bill Settlement
            </h1>
          </div>
          <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
            Settles folios and automatically marks room for 'Cleaning' in MySQL database
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ color: '#a8b2aa', fontSize: '13px' }}>
            Occupied Rooms in MySQL: <strong style={{ color: 'white' }}>{occupiedRooms.length} Rooms</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={16} color="#74c69d" />
            <input
              type="text"
              placeholder="Search by room #, guest name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '13px',
                width: '240px'
              }}
            />
          </div>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#c9a84c' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ color: '#74c69d', fontSize: '14px' }}>Loading occupied rooms from database...</p>
          </div>
        ) : (
          /* 2 Column Layout: Occupied Rooms List & Bill Settlement Drawer */
          <div style={{ display: 'grid', gridTemplateColumns: selectedGuest ? '1.2fr 1fr' : '1fr', gap: '24px' }}>

            {/* Table of Occupied Rooms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px'
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '20px', marginBottom: '18px' }}>
                Occupied Rooms Ready for Departure
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(116,198,157,0.15)' }}>
                    {['Room', 'Guest', 'Stay Period', 'Rate/Night', 'Deposit', 'Action'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px', color: '#74c69d', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#a8b2aa' }}>
                        No occupied rooms currently found in MySQL. Check in a guest first!
                      </td>
                    </tr>
                  ) : (
                    filtered.map((guest) => (
                      <tr
                        key={guest.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: selectedGuest?.id === guest.id ? 'rgba(201,168,76,0.1)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ color: '#f0c96b', fontWeight: 700, fontSize: '15px' }}>#{guest.roomNumber}</span>
                          <div style={{ color: '#a8b2aa', fontSize: '11px' }}>{guest.roomType}</div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{guest.name}</div>
                        </td>
                        <td style={{ padding: '14px 12px', fontSize: '12px', color: '#cbd5e1' }}>
                          <div>{guest.checkInDate} → {guest.checkOutDate}</div>
                          <div style={{ color: '#74c69d', fontSize: '11px' }}>{guest.nights} Nights</div>
                        </td>
                        <td style={{ padding: '14px 12px', color: 'white', fontSize: '13px' }}>
                          Rs. {guest.ratePerNight.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 12px', color: '#4ade80', fontSize: '13px', fontWeight: 600 }}>
                          Rs. {guest.depositPaid.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <button
                            onClick={() => setSelectedGuest(guest)}
                            style={{
                              padding: '8px 14px',
                              background: selectedGuest?.id === guest.id ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #c9a84c, #f0c96b)',
                              color: selectedGuest?.id === guest.id ? '#f0c96b' : '#0a1a0e',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Select Bill
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>

            {/* Bill Settlement Panel */}
            {selectedGuest && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(180deg, #112918 0%, #0a1a0e 100%)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '20px', margin: 0 }}>
                    Billing Breakdown
                  </h3>
                  <button
                    onClick={() => setSelectedGuest(null)}
                    style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Guest Overview */}
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: '#a8b2aa' }}>Guest Name:</span>
                    <strong style={{ color: 'white' }}>{selectedGuest.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#a8b2aa' }}>Room Allocation:</span>
                    <span style={{ color: '#f0c96b', fontWeight: 600 }}>Room #{selectedGuest.roomNumber} ({selectedGuest.roomType})</span>
                  </div>
                </div>

                {/* Itemized charges list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Room Stay ({selectedGuest.nights} nights @ Rs. {selectedGuest.ratePerNight.toLocaleString()})</span>
                    <span>Rs. {bill.roomCharges.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Restaurant & Room Dining</span>
                    <span>Rs. {selectedGuest.roomService.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Mini-bar Beverages</span>
                    <span>Rs. {selectedGuest.minibar.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Laundry & Dry Cleaning</span>
                    <span>Rs. {selectedGuest.laundry.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', color: 'white', fontWeight: 600 }}>
                    <span>Gross Total</span>
                    <span>Rs. {bill.grossTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                    <span>Less: Advance Deposit Paid</span>
                    <span>- Rs. {selectedGuest.depositPaid.toLocaleString()}</span>
                  </div>
                </div>

                {/* Net Balance Due Box */}
                <div style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#a8b2aa', textTransform: 'uppercase', letterSpacing: '1px' }}>NET DUE AT DEPARTURE</span>
                    <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: '22px' }}>
                      Rs. {bill.netPayable.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>SETTLEMENT PAYMENT METHOD</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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
                    <option>Visa / MasterCard</option>
                    <option>Cash</option>
                    <option>American Express (AMEX)</option>
                    <option>Company Invoice / Cheque</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinalizeCheckOut}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
                    color: '#0a1a0e',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={18} /> Settle Bill & Release Room #{selectedGuest.roomNumber}
                </motion.button>
              </motion.div>
            )}

          </div>
        )}

      </div>

      {/* Final Hotel Tax Invoice Modal */}
      <AnimatePresence>
        {completedInvoice && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
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
                width: '500px',
                background: '#ffffff',
                color: '#0a1a0e',
                borderRadius: '16px',
                padding: '36px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {/* Hotel Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0a1a0e', paddingBottom: '16px', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', margin: '0 0 4px 0', color: '#0a1a0e' }}>
                  Royal Ceylon Hotel
                </h2>
                <p style={{ fontSize: '11px', color: '#555', margin: '0 0 2px 0' }}>
                  Sigiriya Road, Habarana, Cultural Triangle, Sri Lanka
                </p>
                <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>
                  Tel: +94 66 227 0000 | VAT Reg: 104589234-7000
                </p>
              </div>

              {/* Invoice Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '16px' }}>
                <div>
                  <div><strong>Invoice #:</strong> {completedInvoice.invoiceNumber}</div>
                  <div><strong>Date:</strong> {completedInvoice.checkoutTimestamp}</div>
                  <div><strong>Payment:</strong> {completedInvoice.paymentMethod}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>Guest:</strong> {completedInvoice.name}</div>
                  <div><strong>Room:</strong> #{completedInvoice.roomNumber} ({completedInvoice.roomType})</div>
                  <div><strong>Stay:</strong> {completedInvoice.nights} Nights</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0' }}>Description</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0' }}>Room Accommodation ({completedInvoice.nights} Nights)</td>
                    <td style={{ padding: '6px 0', textAlign: 'right' }}>{completedInvoice.roomCharges.toLocaleString()}</td>
                  </tr>
                  {completedInvoice.roomService > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0' }}>Restaurant & In-Room Dining</td>
                      <td style={{ padding: '6px 0', textAlign: 'right' }}>{completedInvoice.roomService.toLocaleString()}</td>
                    </tr>
                  )}
                  {completedInvoice.minibar > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0' }}>Mini-bar Consumption</td>
                      <td style={{ padding: '6px 0', textAlign: 'right' }}>{completedInvoice.minibar.toLocaleString()}</td>
                    </tr>
                  )}
                  {completedInvoice.laundry > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0' }}>Laundry Services</td>
                      <td style={{ padding: '6px 0', textAlign: 'right' }}>{completedInvoice.laundry.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '1px solid #ddd', fontWeight: 600 }}>
                    <td style={{ padding: '8px 0' }}>Subtotal</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>Rs. {completedInvoice.grossTotal.toLocaleString()}</td>
                  </tr>
                  <tr style={{ color: '#16a34a' }}>
                    <td style={{ padding: '4px 0' }}>Advance Deposit Credited</td>
                    <td style={{ padding: '4px 0', textAlign: 'right' }}>- Rs. {completedInvoice.depositPaid.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #0a1a0e', fontWeight: 700, fontSize: '14px' }}>
                    <td style={{ padding: '10px 0' }}>Total Paid at Check-Out</td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>Rs. {completedInvoice.netPayable.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginBottom: '24px' }}>
                Room #{completedInvoice.roomNumber} has been released and sent to Housekeeping (Cleaning). 🌿
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#0a1a0e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={16} /> Print Receipt
                </button>
                <button
                  onClick={() => setCompletedInvoice(null)}
                  style={{
                    padding: '12px 24px',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
