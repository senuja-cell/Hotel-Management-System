import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCog,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Coffee,
  Sparkles,
  Phone,
  Mail,
  X,
  Trash2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const initialStaff = [
  {
    id: 'EMP-101',
    name: 'Sanjeewa Kumara',
    role: 'Front Office Manager',
    department: 'Front Desk',
    phone: '+94 77 345 6789',
    email: 'sanjeewa.k@royalceylon.com',
    shift: 'Morning (06:00 - 15:00)',
    status: 'On Duty',
    assignedArea: 'Main Reception & Lobby'
  },
  {
    id: 'EMP-102',
    name: 'Dilini Senanayake',
    role: 'Head of Housekeeping',
    department: 'Housekeeping',
    phone: '+94 71 890 1234',
    email: 'dilini.s@royalceylon.com',
    shift: 'Morning (07:00 - 16:00)',
    status: 'On Duty',
    assignedArea: '2nd & 3rd Floor Suites'
  },
  {
    id: 'EMP-103',
    name: 'Chef Duminda Rathnayake',
    role: 'Executive Chef',
    department: 'Food & Beverage',
    phone: '+94 76 555 4321',
    email: 'duminda.chef@royalceylon.com',
    shift: 'Full Day (10:00 - 22:00)',
    status: 'On Duty',
    assignedArea: 'Lotus Main Kitchen'
  },
  {
    id: 'EMP-104',
    name: 'Pradeep Silva',
    role: 'Security Supervisor',
    department: 'Security',
    phone: '+94 77 999 8888',
    email: 'pradeep.security@royalceylon.com',
    shift: 'Night (22:00 - 06:00)',
    status: 'Off Duty',
    assignedArea: 'Perimeter & Gate 1'
  },
  {
    id: 'EMP-105',
    name: 'Anusha Wickramasinghe',
    role: 'Receptionist & Cashier',
    department: 'Front Desk',
    phone: '+94 78 111 2233',
    email: 'anusha.w@royalceylon.com',
    shift: 'Evening (14:00 - 23:00)',
    status: 'On Break',
    assignedArea: 'Desk Counter 2'
  }
]

const statusStyles = {
  'On Duty':  { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#4ade80' },
  'On Break': { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
  'Off Duty': { bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.4)', text: '#cbd5e1' },
}

export default function Staff() {
  const [staffList, setStaffList] = useState(initialStaff)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    role: 'Receptionist',
    department: 'Front Desk',
    phone: '',
    email: '',
    shift: 'Morning (06:00 - 15:00)',
    status: 'On Duty',
    assignedArea: 'Main Reception'
  })

  // Filter & Search
  const filtered = staffList.filter(s => {
    const matchesDept = deptFilter === 'All' || s.department === deptFilter
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.role.toLowerCase().includes(search.toLowerCase()) ||
                          s.id.toLowerCase().includes(search.toLowerCase())
    return matchesDept && matchesSearch
  })

  const handleToggleStatus = (id, newStatus) => {
    setStaffList(staffList.map(s => s.id === id ? { ...s, status: newStatus } : s))
  }

  const handleAddStaff = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    const newEmp = {
      id: `EMP-${Math.floor(106 + Math.random() * 800)}`,
      ...formData
    }

    setStaffList([newEmp, ...staffList])
    setShowModal(false)
    setFormData({
      name: '',
      role: 'Receptionist',
      department: 'Front Desk',
      phone: '',
      email: '',
      shift: 'Morning (06:00 - 15:00)',
      status: 'On Duty',
      assignedArea: 'Main Reception'
    })
  }

  const handleDelete = (id) => {
    if (confirm('Remove this employee profile?')) {
      setStaffList(staffList.filter(s => s.id !== id))
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
              <UserCog size={28} color="#c9a84c" />
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#c9a84c', margin: 0 }}>
                Hotel Staff & Roster
              </h1>
            </div>
            <p style={{ color: '#74c69d', fontSize: '14px', marginTop: '4px' }}>
              Coordinate front office, housekeeping, culinary chefs, and facility maintenance teams
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
            <Plus size={18} /> Add New Employee
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
          {/* Department Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Front Desk', 'Housekeeping', 'Food & Beverage', 'Security'].map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: deptFilter === dept ? 'rgba(201,168,76,0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: deptFilter === dept ? '#f0c96b' : '#a8b2aa',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: deptFilter === dept ? 'rgba(201,168,76,0.5)' : 'transparent',
                }}
              >
                {dept} ({dept === 'All' ? staffList.length : staffList.filter(s => s.department === dept).length})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={16} color="#74c69d" />
            <input
              type="text"
              placeholder="Search staff, role, ID..."
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

        {/* Staff Table */}
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
                {['Employee', 'Role & Dept', 'Contact Info', 'Shift Schedule', 'Assigned Area', 'Status Toggle', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#74c69d', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#a8b2aa' }}>
                    No staff members found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((emp, i) => (
                  <tr
                    key={emp.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    {/* Employee */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{emp.name}</div>
                      <span style={{ color: '#f0c96b', fontSize: '11px' }}>{emp.id}</span>
                    </td>

                    {/* Role & Dept */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{emp.role}</div>
                      <div style={{ color: '#74c69d', fontSize: '11px', marginTop: '2px' }}>{emp.department}</div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '16px', fontSize: '12px' }}>
                      <div style={{ color: '#cbd5e1' }}>{emp.phone}</div>
                      <div style={{ color: '#a8b2aa' }}>{emp.email}</div>
                    </td>

                    {/* Shift */}
                    <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '12px' }}>
                      {emp.shift}
                    </td>

                    {/* Area */}
                    <td style={{ padding: '16px', color: '#a8b2aa', fontSize: '12px' }}>
                      {emp.assignedArea}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '16px' }}>
                      <select
                        value={emp.status}
                        onChange={(e) => handleToggleStatus(emp.id, e.target.value)}
                        style={{
                          background: statusStyles[emp.status]?.bg || 'rgba(255,255,255,0.08)',
                          color: statusStyles[emp.status]?.text || 'white',
                          border: `1px solid ${statusStyles[emp.status]?.border || 'rgba(255,255,255,0.2)'}`,
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="On Duty" style={{ background: '#0a1a0e', color: '#4ade80' }}>● On Duty</option>
                        <option value="On Break" style={{ background: '#0a1a0e', color: '#fbbf24' }}>● On Break</option>
                        <option value="Off Duty" style={{ background: '#0a1a0e', color: '#cbd5e1' }}>● Off Duty</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

      </div>

      {/* Add Staff Modal */}
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
                  Add Staff Member
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#a8b2aa', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStaff}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>STAFF FULL NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Kasun Chamara"
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>ROLE / TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Receptionist"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>DEPARTMENT</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                      <option>Front Desk</option>
                      <option>Housekeeping</option>
                      <option>Food & Beverage</option>
                      <option>Security</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
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
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>EMAIL</label>
                    <input
                      type="email"
                      placeholder="staff@royalceylon.com"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>SHIFT</label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
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
                      <option>Morning (06:00 - 15:00)</option>
                      <option>Evening (14:00 - 23:00)</option>
                      <option>Night (22:00 - 06:00)</option>
                      <option>Full Day (10:00 - 22:00)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#74c69d', fontSize: '12px', marginBottom: '6px' }}>ASSIGNED AREA</label>
                    <input
                      type="text"
                      placeholder="e.g. 1st Floor Suites"
                      value={formData.assignedArea}
                      onChange={(e) => setFormData({ ...formData, assignedArea: e.target.value })}
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
                    Add Employee
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
