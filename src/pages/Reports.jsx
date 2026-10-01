import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Percent,
  BedDouble,
  Calendar,
  Download,
  ArrowUpRight
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import Sidebar from '../components/Sidebar'

const weeklyRevenueData = [
  { day: 'Mon 25/09', revenue: 64000, occupancy: 70 },
  { day: 'Tue 26/09', revenue: 78000, occupancy: 78 },
  { day: 'Wed 27/09', revenue: 92000, occupancy: 85 },
  { day: 'Thu 28/09', revenue: 85000, occupancy: 80 },
  { day: 'Fri 29/09', revenue: 145000, occupancy: 95 },
  { day: 'Sat 30/09', revenue: 185000, occupancy: 100 },
  { day: 'Sun 01/10', revenue: 120000, occupancy: 88 },
]

const roomTypePerformance = [
  { type: 'Standard Nature', bookings: 28, revenue: 154000 },
  { type: 'Deluxe Room', bookings: 42, revenue: 357000 },
  { type: 'Royal Ocean Suite', bookings: 19, revenue: 351500 },
  { type: 'Presidential Villa', bookings: 6, revenue: 210000 },
]

const dailyPerformanceTable = [
  { date: '2026-10-01 (Today)', occupied: 41, available: 7, occupancyRate: '85.4%', adr: 'Rs. 14,200', revenue: 'Rs. 582,200' },
  { date: '2026-09-30', occupied: 48, available: 0, occupancyRate: '100.0%', adr: 'Rs. 15,800', revenue: 'Rs. 758,400' },
  { date: '2026-09-29', occupied: 44, available: 4, occupancyRate: '91.6%', adr: 'Rs. 14,900', revenue: 'Rs. 655,600' },
  { date: '2026-09-28', occupied: 38, available: 10, occupancyRate: '79.1%', adr: 'Rs. 13,800', revenue: 'Rs. 524,400' },
  { date: '2026-09-27', occupied: 36, available: 12, occupancyRate: '75.0%', adr: 'Rs. 13,500', revenue: 'Rs. 486,000' },
]

export default function Reports() {
  const [timeframe, setTimeframe] = useState('7D')

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
              <BarChart3 size={28} color="#c9a84c" />
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
                Executive Analytics & Reports
              </h1>
            </div>
            <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
              Hotel occupancy metrics, revenue yields, average daily rates (ADR), and category yields
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '10px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Download size={15} /> Export PDF
            </button>
          </div>
        </motion.div>

        {/* 4 Executive KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          {[
            {
              label: 'AVERAGE OCCUPANCY',
              value: '86.4%',
              sub: '+4.2% vs last week',
              color: '#4ade80',
              bg: 'rgba(34, 197, 94, 0.15)',
              icon: Percent
            },
            {
              label: 'AVG DAILY RATE (ADR)',
              value: 'Rs. 14,650',
              sub: 'Yield per sold room',
              color: '#c9a84c',
              bg: 'rgba(201, 168, 76, 0.15)',
              icon: DollarSign
            },
            {
              label: 'RevPAR',
              value: 'Rs. 12,657',
              sub: 'Rev Per Avail Room',
              color: '#60a5fa',
              bg: 'rgba(59, 130, 246, 0.15)',
              icon: TrendingUp
            },
            {
              label: 'WEEKLY REVENUE',
              value: 'Rs. 769,000',
              sub: '7 Days Collected',
              color: '#f97316',
              bg: 'rgba(249, 115, 22, 0.15)',
              icon: ArrowUpRight
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={22} color={kpi.color} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#a8b2aa', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {kpi.label}
                  </span>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '22px', marginTop: '2px' }}>
                    {kpi.value}
                  </div>
                  <span style={{ color: kpi.color, fontSize: '11px' }}>{kpi.sub}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 2 Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '28px' }}>

          {/* Revenue Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '18px', margin: 0 }}>
                  Weekly Revenue Trend (LKR)
                </h3>
                <span style={{ color: '#74c69d', fontSize: '12px' }}>Peak revenue observed over weekend</span>
              </div>
              <span style={{ color: '#f0c96b', fontWeight: 700, fontSize: '16px' }}>Total: Rs. 769K</span>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" stroke="#a8b2aa" fontSize={11} />
                  <YAxis stroke="#a8b2aa" fontSize={11} tickFormatter={(val) => `${val / 1000}K`} />
                  <Tooltip
                    contentStyle={{ background: '#0a1a0e', borderColor: 'rgba(201,168,76,0.3)', borderRadius: '10px', color: 'white' }}
                    formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Daily Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Room Category Yield Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '18px', margin: 0 }}>
                Revenue by Room Category
              </h3>
              <span style={{ color: '#74c69d', fontSize: '12px' }}>Contribution per inventory tier</span>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={roomTypePerformance} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#a8b2aa" fontSize={10} tickFormatter={(v) => `${v / 1000}K`} />
                  <YAxis type="category" dataKey="type" stroke="#a8b2aa" fontSize={10} width={90} />
                  <Tooltip
                    contentStyle={{ background: '#0a1a0e', borderColor: 'rgba(116,198,157,0.3)', borderRadius: '10px', color: 'white' }}
                    formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Total Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#40916c" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* Daily Performance Breakdown Table */}
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
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(116,198,157,0.15)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#c9a84c', fontSize: '18px', margin: 0 }}>
              Daily Hotel Performance Log
            </h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.08)', borderBottom: '1px solid rgba(116,198,157,0.15)' }}>
                {['Date', 'Occupied Rooms', 'Available', 'Occupancy Rate', 'ADR', 'Gross Daily Revenue'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: '#74c69d', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dailyPerformanceTable.map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td style={{ padding: '16px 20px', color: 'white', fontWeight: 600, fontSize: '13px' }}>
                    {row.date}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#4ade80', fontWeight: 600, fontSize: '13px' }}>
                    {row.occupied} Rooms
                  </td>
                  <td style={{ padding: '16px 20px', color: '#a8b2aa', fontSize: '13px' }}>
                    {row.available} Rooms
                  </td>
                  <td style={{ padding: '16px 20px', color: '#f0c96b', fontWeight: 700, fontSize: '14px' }}>
                    {row.occupancyRate}
                  </td>
                  <td style={{ padding: '16px 20px', color: 'white', fontSize: '13px' }}>
                    {row.adr}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#c9a84c', fontWeight: 700, fontSize: '15px' }}>
                    {row.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </div>
  )
}
