// client/src/components/auth/AuthLayout.jsx
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </div>
  )
}

export default AuthLayout