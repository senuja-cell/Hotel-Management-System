import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BedDouble,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  X,
  Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getRooms, createRoom, updateRoom, deleteRoom } from '../api'

const statusStyles = {
  Available: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#4ade80', icon: CheckCircle2 },
  Occupied:  { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171', icon: BedDouble },
  Reserved:  { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24', icon: Clock },
  Cleaning:  { bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.4)', text: '#cbd5e1', icon: Sparkles },
}

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'Deluxe Room',
    floor: '1st Floor',
    beds: '1 King Bed',
    price: '',
    status: 'Available',
    amenities: 'WiFi, AC, TV'
  })

  // Fetch rooms from Laravel REST API
  const fetchLiveRooms = async () => {
    try {
      setLoading(true)
      const res = await getRooms()
      setRooms(res.data)
    } catch (err) {
      console.error('Failed to load rooms from Laravel API:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveRooms()
  }, [])

  // Filtered rooms based on status & search keyword
  const filteredRooms = rooms.filter(room => {
    const matchesFilter = filter === 'All' || room.status === filter
    const matchesSearch = room.number.toLowerCase().includes(search.toLowerCase()) ||
                          room.type.toLowerCase().includes(search.toLowerCase()) ||
                          (room.guest && room.guest.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  // Create room via API (POST to MySQL)
  const handleAddRoom = async (e) => {
    e.preventDefault()
    if (!newRoom.number || !newRoom.price) return

    try {
      const payload = {
        number: newRoom.number,
        type: newRoom.type,
        floor: newRoom.floor,
        beds: newRoom.beds,
        price: Number(newRoom.price),
        status: newRoom.status,
        amenities: newRoom.amenities.split(',').map(s => s.trim()).filter(Boolean)
      }

      const res = await createRoom(payload)
      setRooms([res.data, ...rooms])
      setShowModal(false)
      setNewRoom({
        number: '',
        type: 'Deluxe Room',
        floor: '1st Floor',
        beds: '1 King Bed',
        price: '',
        status: 'Available',
        amenities: 'WiFi, AC, TV'
      })
    } catch (err) {
      alert('Error creating room: ' + (err.response?.data?.message || err.message))
    }
  }

  // Update room status (PUT to MySQL)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRoom(id, { status: newStatus })
      setRooms(rooms.map(r => r.id === id ? { ...r, status: newStatus } : r))
    } catch (err) {
      alert('Failed to update room status: ' + err.message)
    }
  }

  // Delete room (DELETE from MySQL)
  const handleDeleteRoom = async (id) => {
    if (!confirm('Are you sure you want to remove this room from the database?')) return
    try {
      await deleteRoom(id)
      setRooms(rooms.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete room: ' + err.message)
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
              <BedDouble size={28} color="#c9a84c" />
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
                Rooms Management
              </h1>
            </div>
            <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
              Live inventory connected to Laravel REST API & MySQL
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
            <Plus size={18} /> Add New Room
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
            {['All', 'Available', 'Occupied', 'Reserved', 'Cleaning'].map((st) => (
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
                {st} ({st === 'All' ? rooms.length : rooms.filter(r => r.status === st).length})
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={16} color="#74c69d" />
            <input
              type="text"
              placeholder="Search by room #, type, guest..."
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
            <p style={{ color: '#74c69d', fontSize: '14px' }}>Connecting to Royal Ceylon MySQL Database...</p>
          </div>
        ) : (
          /* Rooms Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredRooms.map((room, i) => {
              const StatusIcon = statusStyles[room.status]?.icon || CheckCircle2
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#74c69d', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          {room.floor}
                        </span>
                        <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: '2px 0 0 0' }}>
                          Room #{room.number}
                        </h3>
                        <p style={{ color: '#a8b2aa', fontSize: '13px', margin: 0 }}>{room.type}</p>
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: statusStyles[room.status]?.bg,
                        border: `1px solid ${statusStyles[room.status]?.border}`,
                        color: statusStyles[room.status]?.text,
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        <StatusIcon size={13} />
                        {room.status}
                      </div>
                    </div>

                    {/* Bed Info & Occupant */}
                    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '10px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a8b2aa', marginBottom: '4px' }}>
                        <span>Bed Configuration:</span>
                        <span style={{ color: 'white' }}>{room.beds}</span>
                      </div>
                      {room.guest && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a8b2aa' }}>
                          <span>Current Guest:</span>
                          <span style={{ color: '#f0c96b', fontWeight: 600 }}>{room.guest}</span>
                        </div>
                      )}
                    </div>

                    {/* Amenities Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {Array.isArray(room.amenities) && room.amenities.map((a, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(64, 145, 108, 0.15)',
                            color: '#74c69d',
                            border: '1px solid rgba(64, 145, 108, 0.25)'
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#a8b2aa' }}>Rate per night</span>
                        <p style={{ color: '#c9a84c', fontSize: '18px', fontWeight: 700, margin: 0 }}>
                          Rs. {Number(room.price).toLocaleString()}
                        </p>
                      </div>

                      {/* Change Status Dropdown */}
                      <select
                        value={room.status}
                        onChange={(e) => handleStatusChange(room.id, e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="Available" style={{ background: '#0a1a0e' }}>Mark: Available</option>
                        <option value="Occupied" style={{ background: '#0a1a0e' }}>Mark: Occupied</option>
                        <option value="Reserved" style={{ background: '#0a1a0e' }}>Mark: Reserved</option>
                        <option value="Cleaning" style={{ background: '#0a1a0e' }}>Mark: Cleaning</option>
                      </select>
                    </div>

                    {/* Delete button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          opacity: 0.7
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>

                </motion.div>
              )
            })}
          </div>
        )}

      </div>

      {/* Add Room Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
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
                width: '480px',
                background: 'linear-gradient(180deg, #112918 0%, #0a1a0e 100%)',
                border: '1px solid rgba(116,198,157,0.25)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '22px', margin: 0 }}>
                  Add New Room to Database
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddRoom}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>ROOM NUMBER</label>
                    <input
                      type="text"
                      placeholder="e.g. 401"
                      value={newRoom.number}
                      onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>FLOOR</label>
                    <select
                      value={newRoom.floor}
                      onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
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
                      <option>1st Floor</option>
                      <option>2nd Floor</option>
                      <option>3rd Floor</option>
                      <option>4th Floor - Penthouse</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>ROOM TYPE</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
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
                    <option>Standard Nature Room</option>
                    <option>Deluxe Room</option>
                    <option>Royal Ocean Suite</option>
                    <option>Presidential Villa</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>BED CONFIG</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 King Bed"
                      value={newRoom.beds}
                      onChange={(e) => setNewRoom({ ...newRoom, beds: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PRICE / NIGHT (Rs.)</label>
                    <input
                      type="number"
                      placeholder="e.g. 12000"
                      value={newRoom.price}
                      onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
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

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>
                    AMENITIES (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="WiFi, AC, TV, Balcony"
                    value={newRoom.amenities}
                    onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
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
                    Save to MySQL
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