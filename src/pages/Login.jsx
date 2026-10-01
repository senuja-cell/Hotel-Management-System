import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Temporary login for now (we add API later)
    if (email === 'admin@royalceylon.com' && password === 'admin123') {
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } else {
      setTimeout(() => {
        setError('Invalid email or password!')
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1a0e 0%, #1a3a22 50%, #0a1a0e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* Animated background circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #40916c, transparent)',
            width: `${150 + i * 80}px`,
            height: `${150 + i * 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}



      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '48px',
          width: '420px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <div style={{ fontSize: '56px', marginBottom: '8px' }}>🐘</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            color: '#c9a84c',
            fontWeight: 700,
            marginBottom: '4px'
          }}>
            Royal Ceylon Hotel
          </h1>
          <p style={{ color: '#74c69d', fontSize: '13px', letterSpacing: '2px' }}>
            MANAGEMENT SYSTEM
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(220,53,69,0.2)',
              border: '1px solid rgba(220,53,69,0.4)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '16px',
              color: '#ff6b7a',
              fontSize: '13px',
              textAlign: 'center'
            }}
          >
            ❌ {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#74c69d', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@royalceylon.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(116,198,157,0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#74c69d', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(116,198,157,0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(201,168,76,0.4)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading
                ? 'rgba(201,168,76,0.5)'
                : 'linear-gradient(135deg, #c9a84c, #f0c96b)',
              border: 'none',
              borderRadius: '12px',
              color: '#0a1a0e',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              letterSpacing: '1px',
            }}
          >
            {loading ? '🌿 Signing in...' : '🏨 LOGIN TO HOTEL'}
          </motion.button>
        </form>

        {/* Hint */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(64,145,108,0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(64,145,108,0.2)',
        }}>
          <p style={{ color: '#74c69d', fontSize: '12px', marginBottom: '4px' }}>
            🔑 Demo Credentials:
          </p>
          <p style={{ color: '#a8b2aa', fontSize: '12px' }}>
            admin@royalceylon.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  )
}