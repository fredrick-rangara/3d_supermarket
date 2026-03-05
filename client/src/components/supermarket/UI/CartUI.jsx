// client/src/components/supermarket/UI/CartUI.jsx
import { useCart } from '../../../hooks/useCart'

const CartUI = () => {
  const { cart } = useCart()
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  if (itemCount === 0) return null

  return (
    <span className="cart-badge">
      {itemCount > 9 ? '9+' : itemCount}
    </span>
  )
}

export default CartUI