import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  Printer,
  Download,
  Eye,
  X,
  FileText
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const initialInvoices = [
  {
    id: 'INV-78401',
    guest: 'Dr. John Smith',
    room: '202',
    date: '2026-10-01',
    amount: 69500,
    status: 'Paid',
    method: 'Visa / MasterCard',
    nights: 3,
    breakdown: { room: 55500, dining: 8200, minibar: 3800, laundry: 2000 }
  },
  {
    id: 'INV-78402',
    guest: 'Amal Perera',
    room: '102',
    date: '2026-10-01',
    amount: 45200,
    status: 'Paid',
    method: 'Cash',
    nights: 2,
    breakdown: { room: 37000, dining: 4500, minibar: 2500, laundry: 1200 }
  },
  {
    id: 'INV-78403',
    guest: 'Nimal Silva',
    room: '201',
    date: '2026-09-30',
    amount: 25500,
    status: 'Pending',
    method: 'Bank Transfer',
    nights: 3,
    breakdown: { room: 25500, dining: 0, minibar: 0, laundry: 0 }
  },
  {
    id: 'INV-78404',
    guest: 'Sarah Jenkins',
    room: '301',
    date: '2026-09-29',
    amount: 175000,
    status: 'Paid',
    method: 'American Express',
    nights: 5,
    breakdown: { room: 175000, dining: 0, minibar: 0, laundry: 0 }
  },
  {
    id: 'INV-78405',
    guest: 'Elena Rostova',
    room: '103',
    date: '2026-09-28',
    amount: 16500,
    status: 'Refunded',
    method: 'Credit Card Reversal',
    nights: 3,
    breakdown: { room: 16500, dining: 0, minibar: 0, laundry: 0 }
  }
]

const statusStyles = {
  Paid:     { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#4ade80' },
  Pending:  { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
  Refunded: { bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.4)', text: '#cbd5e1' },
}

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Financial Stats
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0)

  const pendingAmount = invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + i.amount, 0)

  const paidCount = invoices.filter(i => i.status === 'Paid').length

  // Filter & Search
  const filtered = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
                          inv.guest.toLowerCase().includes(search.toLowerCase()) ||
                          inv.room.includes(search)
    return matchesStatus && matchesSearch
  })

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
            <Receipt size={28} color="#c9a84c" />
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
              Hotel Billing & Folios
            </h1>
          </div>
          <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
            Track settled invoices, room charges, merchant card transactions, and pending guest folios
          </p>
        </motion.div>

        {/* Financial KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={24} color="#4ade80" />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#a8b2aa', letterSpacing: '1px', textTransform: 'uppercase' }}>TOTAL SETTLED REVENUE</span>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '24px', marginTop: '2px' }}>
                Rs. {totalRevenue.toLocaleString()}
              </div>
              <span style={{ color: '#4ade80', fontSize: '12px' }}>{paidCount} Settled Invoices</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="#fbbf24" />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#a8b2aa', letterSpacing: '1px', textTransform: 'uppercase' }}>PENDING RECEIVABLES</span>
              <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '24px', marginTop: '2px' }}>
                Rs. {pendingAmount.toLocaleString()}
              </div>
              <span style={{ color: '#a8b2aa', fontSize: '12px' }}>Awaiting Bank Clearance</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(201, 168, 76, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={24} color="#f0c96b" />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#a8b2aa', letterSpacing: '1px', textTransform: 'uppercase' }}>PAYMENT CHANNELS</span>
              <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: '24px', marginTop: '2px' }}>
                Visa / Cash / AMEX
              </div>
              <span style={{ color: '#74c69d', fontSize: '12px' }}>100% Tax Compliant</span>
            </div>
          </motion.div>
        </div>

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
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Paid', 'Pending', 'Refunded'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: statusFilter === st ? 'rgba(201,168,76,0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: statusFilter === st ? '#f0c96b' : '#a8b2aa',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: statusFilter === st ? 'rgba(201,168,76,0.5)' : 'transparent',
                }}
              >
                {st} ({st === 'All' ? invoices.length : invoices.filter(i => i.status === st).length})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={16} color="#74c69d" />
            <input
              type="text"
              placeholder="Search invoice #, guest, room..."
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

        {/* Invoices Table */}
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
                {['Invoice #', 'Guest', 'Room', 'Date', 'Amount (LKR)', 'Payment Method', 'Status', 'Action'].map(h => (
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
                    No invoice records found.
                  </td>
                </tr>
              ) : (
                filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '16px', color: '#f0c96b', fontWeight: 700, fontSize: '13px' }}>
                      {inv.id}
                    </td>
                    <td style={{ padding: '16px', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                      {inv.guest}
                    </td>
                    <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '13px' }}>
                      Room #{inv.room}
                    </td>
                    <td style={{ padding: '16px', color: '#a8b2aa', fontSize: '12px' }}>
                      {inv.date}
                    </td>
                    <td style={{ padding: '16px', color: '#c9a84c', fontWeight: 700, fontSize: '15px' }}>
                      Rs. {inv.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '13px' }}>
                      {inv.method}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: statusStyles[inv.status]?.bg,
                        color: statusStyles[inv.status]?.text,
                        border: `1px solid ${statusStyles[inv.status]?.border}`
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'rgba(201,168,76,0.15)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          borderRadius: '8px',
                          color: '#f0c96b',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={13} /> View Folio
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

      </div>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedInvoice && (
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '480px',
                background: '#ffffff',
                color: '#0a1a0e',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0a1a0e', paddingBottom: '14px', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', margin: '0 0 4px 0', color: '#0a1a0e' }}>
                  Royal Ceylon Hotel
                </h2>
                <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>
                  Cultural Triangle, Sigiriya, Sri Lanka • Tax Invoice
                </p>
              </div>

              {/* Folio Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '14px' }}>
                <div>
                  <div><strong>Folio ID:</strong> {selectedInvoice.id}</div>
                  <div><strong>Issue Date:</strong> {selectedInvoice.date}</div>
                  <div><strong>Payment Method:</strong> {selectedInvoice.method}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>Guest:</strong> {selectedInvoice.guest}</div>
                  <div><strong>Room:</strong> #{selectedInvoice.room}</div>
                  <div><strong>Status:</strong> {selectedInvoice.status}</div>
                </div>
              </div>

              {/* Line items */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '6px 0' }}>Item Description</th>
                    <th style={{ textAlign: 'right', padding: '6px 0' }}>Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0' }}>Room Stay ({selectedInvoice.nights} Nights)</td>
                    <td style={{ textAlign: 'right', padding: '6px 0' }}>{selectedInvoice.breakdown.room.toLocaleString()}</td>
                  </tr>
                  {selectedInvoice.breakdown.dining > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0' }}>Restaurant & Bar</td>
                      <td style={{ textAlign: 'right', padding: '6px 0' }}>{selectedInvoice.breakdown.dining.toLocaleString()}</td>
                    </tr>
                  )}
                  {selectedInvoice.breakdown.minibar > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0' }}>In-Room Mini-Bar</td>
                      <td style={{ textAlign: 'right', padding: '6px 0' }}>{selectedInvoice.breakdown.minibar.toLocaleString()}</td>
                    </tr>
                  )}
                  {selectedInvoice.breakdown.laundry > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0' }}>Laundry Services</td>
                      <td style={{ textAlign: 'right', padding: '6px 0' }}>{selectedInvoice.breakdown.laundry.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '2px solid #0a1a0e', fontWeight: 700, fontSize: '14px' }}>
                    <td style={{ padding: '10px 0' }}>Total Invoiced</td>
                    <td style={{ textAlign: 'right', padding: '10px 0' }}>Rs. {selectedInvoice.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

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
                  <Printer size={16} /> Print Tax Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  style={{
                    padding: '12px 20px',
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
