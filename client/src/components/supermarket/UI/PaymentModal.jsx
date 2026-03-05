// client/src/components/supermarket/UI/PaymentModal.jsx
import { useState } from 'react'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'
import axios from 'axios'
import toast from 'react-hot-toast'

const PaymentModal = ({ onClose }) => {
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const { cart, clearCart } = useCart()
  const { user } = useAuth()

  const handlePayment = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (method === 'mpesa') {
        const { data } = await axios.post('/api/payment/mpesa', { phone })
        toast.success('STK Push sent! Check your phone.')
        pollPaymentStatus(data.orderId)
      } else {
        // For demo, simulate card payment
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Payment successful!')
        clearCart()
        onClose()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const pollPaymentStatus = async (orderId) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/payment/status/${orderId}`)
        if (data.status === 'completed') {
          clearInterval(interval)
          toast.success('Payment confirmed!')
          clearCart()
          onClose()
        } else if (data.status === 'failed') {
          clearInterval(interval)
          toast.error('Payment failed')
        }
      } catch (error) {
        clearInterval(interval)
      }
    }, 3000)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: '40px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>
          Complete Payment
        </h2>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setMethod('card')}
            style={{
              flex: 1,
              padding: '16px',
              background: method === 'card' ? '#667eea' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            💳 Card
          </button>
          <button
            onClick={() => setMethod('mpesa')}
            style={{
              flex: 1,
              padding: '16px',
              background: method === 'mpesa' ? '#00d632' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            📱 M-Pesa
          </button>
        </div>

        <form onSubmit={handlePayment}>
          {method === 'mpesa' ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="254712345678"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                required
              />
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  marginBottom: '12px'
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <input
                  type="text"
                  placeholder="CVC"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px'
          }}>
            <span>Total Amount</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              ${(cart.total * 1.08).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '14px',
                background: method === 'mpesa' ? '#00d632' : '#667eea',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : `Pay $${(cart.total * 1.08).toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal