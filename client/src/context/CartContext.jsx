// client/src/context/CartContext.jsx
import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart')
      setCart(data)
    } catch (error) {
      console.error('Failed to fetch cart')
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      const { data } = await axios.post('/api/cart/add', {
        productId: product._id,
        quantity
      })
      setCart(data)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add item')
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put('/api/cart/update', {
        productId,
        quantity
      })
      setCart(data)
    } catch (error) {
      toast.error('Failed to update cart')
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove/${productId}`)
      setCart(data)
      toast.success('Item removed')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const clearCart = () => {
    setCart({ items: [], total: 0 })
  }

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      setIsOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}