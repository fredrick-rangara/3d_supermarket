# 3D Supermarket

An immersive 3D supermarket shopping experience inspired by [Bruno Simon's](https://bruno-simon.com) interactive portfolio. Features physics-based shopping cart mechanics, realistic product interaction, and secure M-Pesa/Card payment integration.

![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **Physics-Based Shopping Cart**: Drive your cart through aisles using WASD/Arrow keys (inspired by Bruno Simon's car physics)
- **Immersive 3D Environment**: Fully rendered supermarket with dynamic lighting and shadows
- **Product Interaction**: Click to pick up items, throw them into your cart with realistic physics
- **Authentication Required**: Users must login/signup before accessing the store
- **Payment Integration**: 
  - M-Pesa (East Africa mobile money)
  - Credit/Debit Cards via Stripe
- **Modular Architecture**: Clean separation of concerns across frontend and backend
- **Responsive UI**: Beautiful HUD and checkout interfaces

## 🎮 Controls

| Key | Action |
|-----|--------|
| `W/A/S/D` or `Arrows` | Drive cart |
| `Space` | Brake |
| `Shift` | Boost speed |
| `E` | Interact/Pick up item |
| `Q` | Drop item |
| `Mouse` | Camera control |
| `ESC` | Release cursor |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- M-Pesa Daraja API credentials (for payments)
- Stripe account (for card payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/supermarket-3d.git
cd supermarket-3d
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Environment Variables**
```bash
# In backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/supermarket3d
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# M-Pesa Config
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox

# Stripe Config
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```


5. **Run Development Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Open Browser**
Navigate to `http://localhost:5173`


## 🏗️ Architecture

### Frontend (Three.js + Cannon-es)
- **Physics Engine**: Cannon-es for realistic cart movement and collisions
- **Renderer**: Three.js with WebGL 2.0, shadows, post-processing
- **Input Handler**: Keyboard and mouse controls with pointer lock
- **Component System**: Modular UI and 3D world components
- **State Management**: Custom event-based store

### Backend (Node.js + Express)
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Payments**: 
  - M-Pesa Daraja API integration
  - Stripe for card payments
- **Security**: Helmet, CORS, rate limiting

## 🎨 Customization

### Adding Products
Edit `backend/models/Product.js` and seed database:
```javascript
{
  name: "Organic Bananas",
  price: 2.99,
  category: "produce",
  model: "banana.glb",
  position: { x: 10, y: 1, z: -5 }
}
```

### Modifying Physics
Edit `frontend/src/core/Physics.js`:
```javascript
// Adjust cart physics
cartBody.linearDamping = 0.5;
cartBody.angularDamping = 0.5;
```

## 🔒 Security Considerations

- All API routes protected with JWT middleware
- Passwords hashed with bcrypt (salt rounds: 12)
- M-Pesa callbacks validated with signature
- Stripe webhooks signature verification
- Rate limiting on auth endpoints (5 attempts per 15 min)
- Input sanitization with express-validator
- HTTPS required in production

## 🚧 Roadmap

- [ ] Multiplayer support (WebSockets)
- [ ] VR mode (WebXR)
- [ ] AI shopping assistants
- [ ] Inventory management dashboard
- [ ] Mobile app (React Native)

## 📝 License

MIT License - feel free to use for commercial projects!

## 🙏 Credits

- Inspired by [Bruno Simon's Portfolio](https://bruno-simon.com)
- Physics: [Cannon-es](https://github.com/pmndrs/cannon-es)
- 3D Rendering: [Three.js](https://threejs.org)
- UI Components: [Tailwind CSS](https://tailwindcss.com)

---

**Happy Shopping! 🛍️** Push your cart like Bruno drives his car! 🚗
