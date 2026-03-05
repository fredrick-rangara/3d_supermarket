// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AuthLayout from './components/auth/AuthLayout'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import SupermarketScene from './components/supermarket/SupermarketScene'
import { useAuth } from './hooks/useAuth'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route 
            path="/shop" 
            element={
              <PrivateRoute>
                <SupermarketScene />
              </PrivateRoute>
            } 
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App