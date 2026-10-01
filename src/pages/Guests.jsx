import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Plus,
  Crown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  History,
  X,
  Trash2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const initialGuests = [
  {
    id: 'GST-001',
    name: 'Dr. John Smith',
    country: 'United Kingdom',
    phone: '+44 7911 123456',
    email: 'dr.smith@oxford.ac.uk',
    nicPassport: 'GB89234102',
    tier: 'Platinum VIP',
    totalStays: 4,
    lifetimeSpend: 285000,
    preferredRoom: 'Royal Ocean Suite',
    notes: 'Prefers extra quiet top-floor room, sparkling water on arrival.'
  },
  {
    id: 'GST-002',
    name: 'Amal Perera',
    country: 'Sri Lanka',
    phone: '+94 77 234 5678',
    email: 'amal.perera@dialog.lk',
    nicPassport: '19841203491V',
    tier: 'Gold VIP',
    totalStays: 3,
    lifetimeSpend: 84000,
    preferredRoom: 'Deluxe Room',
    notes: 'Vegetarian meals, late check-out requested when possible.'
  },
  {
    id: 'GST-003',
    name: 'Sarah Jenkins',
    country: 'Australia',
    phone: '+61 412 345 678',
    email: 'sarah.j@sydney.com.au',
    nicPassport: 'PA7823901',
    tier: 'Platinum VIP',
    totalStays: 2,
    lifetimeSpend: 210000,
    preferredRoom: 'Presidential Villa',
    notes: 'Celebrates wedding anniversary in October. Allergic to peanuts.'
  },
  {
    id: 'GST-004',
    name: 'Kumari Jayasinghe',
    country: 'Sri Lanka',
    phone: '+94 71 456 7890',
    email: 'kumari.j@gmail.com',
    nicPassport: '19925670123V',
    tier: 'Regular Guest',
    totalStays: 1,
    lifetimeSpend: 17000,
    preferredRoom: 'Standard Nature Room',
    notes: 'First time visitor, enjoys morning bird watching tours.'
  },
  {
    id: 'GST-005',
    name: 'Elena Rostova',
    country: 'Russia',
    phone: '+7 903 123 4567',
    email: 'elena.rostova@mail.ru',
    nicPassport: 'RU67891234',
    tier: 'Gold VIP',
    totalStays: 2,
    lifetimeSpend: 68000,
    preferredRoom: 'Deluxe Room',
    notes: 'Requests airport transfer on departure.'
  }
]

const tierStyles = {
  'Platinum VIP': { bg: 'rgba(201, 168, 76, 0.2)', border: 'rgba(201, 168, 76, 0.5)', color: '#f0c96b' },
  'Gold VIP':     { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.5)', color: '#60a5fa' },
  'Regular Guest':{ bg: 'rgba(116, 198, 157, 0.2)', border: 'rgba(116, 198, 157, 0.5)', color: '#74c69d' },
}

export default function Guests() {
  const [guests, setGuests] = useState(initialGuests)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedGuestProfile, setSelectedGuestProfile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    country: 'Sri Lanka',
    phone: '',
    email: '',
    nicPassport: '',
    tier: 'Regular Guest',
    preferredRoom: 'Deluxe Room',
    notes: ''
  })

  // Filter & Search
  const filtered = guests.filter(g => {
    const matchesTier = tierFilter === 'All' || g.tier === tierFilter
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                          g.country.toLowerCase().includes(search.toLowerCase()) ||
                          g.phone.includes(search) ||
                          g.nicPassport.toLowerCase().includes(search.toLowerCase())
    return matchesTier && matchesSearch
  })

  const handleAddGuest = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    const newGuest = {
      id: `GST-00${guests.length + 1}`,
      ...formData,
      totalStays: 1,
      lifetimeSpend: 0
    }

    setGuests([newGuest, ...guests])
    setShowAddModal(false)
    setFormData({
      name: '',
      country: 'Sri Lanka',
      phone: '',
      email: '',
      nicPassport: '',
      tier: 'Regular Guest',
      preferredRoom: 'Deluxe Room',
      notes: ''
    })
  }

  const handleDelete = (id) => {
    if (confirm('Delete this guest record?')) {
      setGuests(guests.filter(g => g.id !== id))
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
              <Users size={28} color="#c9a84c" />
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
                Guests Directory & Loyalty CRM
              </h1>
            </div>
            <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
              Track guest profiles, loyalty tiers, lifetime spend, and personal hospitality preferences
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
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
            <Plus size={18} /> Add New Guest
          </motion.button>
        </motion.div>

        {/* Filter & Search Bar */}
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
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Tier Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Platinum VIP', 'Gold VIP', 'Regular Guest'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: tierFilter === tier ? 'rgba(201,168,76,0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: tierFilter === tier ? '#f0c96b' : '#a8b2aa',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: tierFilter === tier ? 'rgba(201,168,76,0.5)' : 'transparent',
                }}
              >
                {tier} ({tier === 'All' ? guests.length : guests.filter(g => g.tier === tier).length})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={16} color="#74c69d" />
            <input
              type="text"
              placeholder="Search by name, country, passport..."
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

        {/* Guests Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.08)', borderBottom: '1px solid rgba(116,198,157,0.15)' }}>
                {['Guest Name', 'Contact & Passport', 'Country', 'VIP Tier', 'Total Stays', 'Lifetime Spend', 'Preferences', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#74c69d', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#a8b2aa' }}>
                    No guests found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((guest, i) => (
                  <tr
                    key={guest.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    {/* Name */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{guest.name}</div>
                      <span style={{ color: '#74c69d', fontSize: '11px' }}>{guest.id}</span>
                    </td>

                    {/* Contact & Passport */}
                    <td style={{ padding: '16px', fontSize: '12px' }}>
                      <div style={{ color: '#cbd5e1' }}>{guest.phone}</div>
                      <div style={{ color: '#a8b2aa' }}>{guest.email}</div>
                      <div style={{ color: '#f0c96b', fontSize: '11px', marginTop: '2px' }}>ID: {guest.nicPassport}</div>
                    </td>

                    {/* Country */}
                    <td style={{ padding: '16px', color: 'white', fontSize: '13px' }}>
                      {guest.country}
                    </td>

                    {/* Tier */}
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: tierStyles[guest.tier]?.bg,
                        color: tierStyles[guest.tier]?.color,
                        border: `1px solid ${tierStyles[guest.tier]?.border}`
                      }}>
                        <Crown size={12} />
                        {guest.tier}
                      </span>
                    </td>

                    {/* Stays */}
                    <td style={{ padding: '16px', color: 'white', fontWeight: 600, fontSize: '13px' }}>
                      {guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'}
                    </td>

                    {/* Spend */}
                    <td style={{ padding: '16px', color: '#c9a84c', fontWeight: 700, fontSize: '14px' }}>
                      Rs. {guest.lifetimeSpend.toLocaleString()}
                    </td>

                    {/* Preferred room */}
                    <td style={{ padding: '16px', fontSize: '12px', color: '#cbd5e1' }}>
                      {guest.preferredRoom}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedGuestProfile(guest)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(201,168,76,0.15)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: '8px',
                            color: '#f0c96b',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

      </div>

      {/* Guest Profile Details Modal */}
      <AnimatePresence>
        {selectedGuestProfile && (
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '480px',
                background: 'linear-gradient(180deg, #112918 0%, #0a1a0e 100%)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '24px',
                padding: '30px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '22px', margin: 0 }}>
                    {selectedGuestProfile.name}
                  </h3>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: tierStyles[selectedGuestProfile.tier]?.color,
                    marginTop: '4px'
                  }}>
                    <Crown size={12} /> {selectedGuestProfile.tier}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedGuestProfile(null)}
                  style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '11px' }}>TOTAL VISITS</span>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>{selectedGuestProfile.totalStays} Stays</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px' }}>
                  <span style={{ color: '#a8b2aa', fontSize: '11px' }}>LIFETIME REVENUE</span>
                  <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: '18px' }}>Rs. {selectedGuestProfile.lifetimeSpend.toLocaleString()}</div>
                </div>
              </div>

              {/* Profile Details */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a8b2aa' }}>Passport / NIC:</span>
                  <span style={{ color: 'white' }}>{selectedGuestProfile.nicPassport}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a8b2aa' }}>Nationality:</span>
                  <span style={{ color: 'white' }}>{selectedGuestProfile.country}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a8b2aa' }}>Phone:</span>
                  <span style={{ color: 'white' }}>{selectedGuestProfile.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a8b2aa' }}>Email:</span>
                  <span style={{ color: 'white' }}>{selectedGuestProfile.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a8b2aa' }}>Favorite Room:</span>
                  <span style={{ color: '#f0c96b', fontWeight: 600 }}>{selectedGuestProfile.preferredRoom}</span>
                </div>
              </div>

              {/* Hospitality notes */}
              <div style={{ background: 'rgba(64,145,108,0.1)', border: '1px solid rgba(64,145,108,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#74c69d', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <Heart size={14} /> Hospitality & Dietary Notes
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
                  {selectedGuestProfile.notes || 'No specific preferences recorded.'}
                </p>
              </div>

              <button
                onClick={() => setSelectedGuestProfile(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
                  color: '#0a1a0e',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Guest Modal */}
      <AnimatePresence>
        {showAddModal && (
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
                  Add Guest to CRM
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddGuest}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>FULL NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Malith Fernando"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PHONE</label>
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>PASSPORT / NIC</label>
                    <input
                      type="text"
                      placeholder="1990456123V"
                      value={formData.nicPassport}
                      onChange={(e) => setFormData({ ...formData, nicPassport: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>COUNTRY</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>VIP TIER</label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
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
                      <option>Regular Guest</option>
                      <option>Gold VIP</option>
                      <option>Platinum VIP</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>HOSPITALITY / DIETARY PREFERENCES</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. King bed, non-smoking, vegetarian menu..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(116,198,157,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none'
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
                    Save Guest
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
