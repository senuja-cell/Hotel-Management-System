import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'

const stats = [
  { icon: '🛏️', label: 'Total Rooms',     value: '48',      sub: '12 Available',      color: '#40916c' },
  { icon: '👤', label: 'Guests Today',    value: '24',      sub: '6 Checked In',      color: '#c9a84c' },
  { icon: '📅', label: 'Reservations',    value: '18',      sub: '5 This Week',       color: '#74c69d' },
  { icon: '💰', label: "Today's Revenue", value: 'Rs. 84K', sub: '+12% vs yesterday', color: '#f0c96b' },
]

const rooms = [
  { number: '101', type: 'Deluxe',   status: 'Available', guest: '-',           price: 'Rs. 8,500'  },
  { number: '102', type: 'Suite',    status: 'Occupied',  guest: 'Amal Perera', price: 'Rs. 15,000' },
  { number: '103', type: 'Standard', status: 'Available', guest: '-',           price: 'Rs. 5,500'  },
  { number: '201', type: 'Deluxe',   status: 'Reserved',  guest: 'Nimal Silva', price: 'Rs. 8,500'  },
  { number: '202', type: 'Suite',    status: 'Occupied',  guest: 'John Smith',  price: 'Rs. 15,000' },
  { number: '203', type: 'Standard', status: 'Cleaning',  guest: '-',           price: 'Rs. 5,500'  },
]

const statusColor = {
  Available: { bg: 'rgba(64,145,108,0.2)',  color: '#74c69d' },
  Occupied:  { bg: 'rgba(220,53,69,0.2)',   color: '#ff6b7a' },
  Reserved:  { bg: 'rgba(201,168,76,0.2)',  color: '#f0c96b' },
  Cleaning:  { bg: 'rgba(108,117,125,0.2)', color: '#adb5bd' },
}

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a1a0e' }}>
      <Sidebar />

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '32px',
            color: '#c9a84c',
            marginBottom: '4px',
          }}>
            Welcome Back! 🌿
          </h1>
          <p style={{ color: '#74c69d', fontSize: '14px' }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.icon}</div>
              <h3 style={{ color: stat.color, fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                {stat.value}
              </h3>
              <p style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ color: '#74c69d', fontSize: '12px' }}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Room Status + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>

          {/* Room Status Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              color: '#c9a84c',
              fontSize: '20px',
              marginBottom: '20px',
            }}>
              🛏️ Room Status Overview
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Room', 'Type', 'Status', 'Guest', 'Rate/Night'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      color: '#74c69d',
                      fontSize: '12px',
                      letterSpacing: '1px',
                      borderBottom: '1px solid rgba(116,198,157,0.2)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '12px', color: 'white', fontWeight: 600 }}>#{room.number}</td>
                    <td style={{ padding: '12px', color: '#a8b2aa', fontSize: '13px' }}>{room.type}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: statusColor[room.status].bg,
                        color: statusColor[room.status].color,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        {room.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#a8b2aa', fontSize: '13px' }}>{room.guest}</td>
                    <td style={{ padding: '12px', color: '#c9a84c', fontSize: '13px', fontWeight: 600 }}>{room.price}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              color: '#c9a84c',
              fontSize: '20px',
              marginBottom: '20px',
            }}>
              ⚡ Quick Actions
            </h2>

            {[
              { icon: '✅', label: 'New Check In',    color: '#40916c' },
              { icon: '🚪', label: 'Check Out Guest', color: '#c9a84c' },
              { icon: '📅', label: 'New Reservation', color: '#74c69d' },
              { icon: '🛏️', label: 'Add Room',        color: '#f0c96b' },
              { icon: '💰', label: 'View Billing',    color: '#40916c' },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 6, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{
                  width: '32px', height: '32px',
                  background: `${action.color}22`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {action.icon}
                </span>
                {action.label}
              </motion.button>
            ))}

            {/* Room availability summary */}
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: 'rgba(64,145,108,0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(64,145,108,0.2)',
            }}>
              <p style={{ color: '#74c69d', fontSize: '12px', marginBottom: '8px' }}>🏨 Room Availability</p>
              {[
                { label: 'Available', count: 12, color: '#74c69d' },
                { label: 'Occupied',  count: 28, color: '#ff6b7a' },
                { label: 'Reserved',  count: 5,  color: '#f0c96b' },
                { label: 'Cleaning',  count: 3,  color: '#adb5bd' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: item.color, fontSize: '12px' }}>● {item.label}</span>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}