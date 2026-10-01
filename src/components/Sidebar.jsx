import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  LogIn,
  LogOut,
  Users,
  Receipt,
  UserCog,
  BarChart3,
  Hotel,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { path: '/rooms',        icon: BedDouble,        label: 'Rooms'        },
  { path: '/reservations', icon: CalendarDays,     label: 'Reservations' },
  { path: '/checkin',      icon: LogIn,            label: 'Check In'     },
  { path: '/checkout',     icon: LogOut,           label: 'Check Out'    },
  { path: '/guests',       icon: Users,            label: 'Guests'       },
  { path: '/billing',      icon: Receipt,          label: 'Billing'      },
  { path: '/staff',        icon: UserCog,          label: 'Staff'        },
  { path: '/reports',      icon: BarChart3,        label: 'Reports'      },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        width: '240px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0d2b1d 0%, #0a1a0e 100%)',
        borderRight: '1px solid rgba(116,198,157,0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '28px 20px',
        borderBottom: '1px solid rgba(116,198,157,0.15)',
        textAlign: 'center',
      }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #c9a84c22, #c9a84c44)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Hotel size={28} color="#c9a84c" />
          </div>
        </motion.div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          color: '#c9a84c',
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: 1.3,
        }}>
          Royal Ceylon<br />Hotel
        </h2>
        <p style={{ color: '#74c69d', fontSize: '10px', letterSpacing: '2px', marginTop: '4px' }}>
          MANAGEMENT SYSTEM
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  textDecoration: 'none',
                  color: isActive ? '#0a1a0e' : '#a8b2aa',
                  background: isActive
                    ? 'linear-gradient(135deg, #c9a84c, #f0c96b)'
                    : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(116,198,157,0.15)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #c9a84c, #f0c96b)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <UserCog size={18} color="#0a1a0e" />
          </div>
          <div>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Admin User</p>
            <p style={{ color: '#74c69d', fontSize: '11px' }}>Hotel Manager</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(220,53,69,0.15)',
            border: '1px solid rgba(220,53,69,0.3)',
            borderRadius: '10px',
            color: '#ff6b7a',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut size={15} />
          Logout
        </motion.button>
      </div>
    </motion.div>
  )
}