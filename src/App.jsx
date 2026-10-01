import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import FallingLeaves from './components/FallingLeaves'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Rooms        from './pages/Rooms'
import Reservations from './pages/Reservations'
import CheckIn      from './pages/CheckIn'
import CheckOut     from './pages/CheckOut'
import Guests       from './pages/Guests'
import Billing      from './pages/Billing'
import Staff        from './pages/Staff'
import Reports      from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      {/* Background tropical leaves rain animation */}
      <FallingLeaves />

      <Routes>
        <Route path="/"             element={<Navigate to="/login" />} />
        <Route path="/"             element={<Navigate to="/login" />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/rooms"        element={<Rooms />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/checkin"      element={<CheckIn />} />
        <Route path="/checkout"     element={<CheckOut />} />
        <Route path="/guests"       element={<Guests />} />
        <Route path="/billing"      element={<Billing />} />
        <Route path="/staff"        element={<Staff />} />
        <Route path="/reports"      element={<Reports />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App