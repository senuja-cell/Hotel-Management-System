import Sidebar from '../components/Sidebar'
export default function Billing() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a1a0e' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px', color: 'white' }}>
        <h1 style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif' }}>💰 Billing — Coming Soon!</h1>
      </div>
    </div>
  )
}
