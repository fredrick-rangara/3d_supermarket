// client/src/components/supermarket/SupermarketScene.jsx
import { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { PointerLockControls, Sky, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import ShoppingCart from './ShoppingCart'
import Aisle from './Aisle'
import Checkout from './Checkout'
import CartUI from './UI/CartUI'
import PaymentModal from './UI/PaymentModal'

// Player movement component
const Player = ({ cartRef }) => {
  const { camera } = useThree()
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, space: false })
  const velocity = useRef([0, 0, 0])
  const direction = new THREE.Vector3()
  const frontVector = new THREE.Vector3()
  const sideVector = new THREE.Vector3()
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(k => ({ ...k, [e.key.toLowerCase()]: true }))
      if (e.code === 'Space') setKeys(k => ({ ...k, space: true }))
    }
    const handleKeyUp = (e) => {
      setKeys(k => ({ ...k, [e.key.toLowerCase()]: false }))
      if (e.code === 'Space') setKeys(k => ({ ...k, space: false }))
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    camera.position.y = 2 // Keep camera at eye level
    
    // Calculate movement direction
    frontVector.set(0, 0, Number(keys.s) - Number(keys.w))
    sideVector.set(Number(keys.a) - Number(keys.d), 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5 * delta).applyEuler(camera.rotation)
    
    // Move camera
    camera.position.x += direction.x
    camera.position.z += direction.z
    
    // Update cart position to follow player
    if (cartRef.current) {
      const cartOffset = new THREE.Vector3(0, 0, -1.5).applyEuler(camera.rotation)
      cartRef.current.position.set(
        camera.position.x + cartOffset.x,
        0.5,
        camera.position.z + cartOffset.z
      )
      cartRef.current.rotation.y = camera.rotation.y
    }
  })

  return <PointerLockControls />
}

// Floor component
const Floor = () => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static'
  }))
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#f0f0f0" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

// Walls
const Walls = () => {
  const wallHeight = 5
  const storeWidth = 40
  const storeDepth = 30
  
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, wallHeight/2, -storeDepth/2]} receiveShadow castShadow>
        <boxGeometry args={[storeWidth, wallHeight, 0.5]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Front wall (with entrance) */}
      <mesh position={[-storeWidth/4, wallHeight/2, storeDepth/2]} receiveShadow castShadow>
        <boxGeometry args={[storeWidth/2, wallHeight, 0.5]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[storeWidth/4, wallHeight/2, storeDepth/2]} receiveShadow castShadow>
        <boxGeometry args={[storeWidth/2, wallHeight, 0.5]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Side walls */}
      <mesh position={[-storeWidth/2, wallHeight/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, wallHeight, storeDepth]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[storeWidth/2, wallHeight/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, wallHeight, storeDepth]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </>
  )
}

// Main Scene Component
const SupermarketScene = () => {
  const cartRef = useRef()
  const { logout } = useAuth()
  const { isOpen, setIsOpen } = useCart()
  const [showPayment, setShowPayment] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* UI Overlay */}
      <div className="ui-overlay">
        <div className="ui-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>🛒 3D Supermarket</h1>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative'
              }}
            >
              🛒 Cart
              <CartUI />
            </button>
          </div>
          <button 
            onClick={logout}
            style={{
              background: 'rgba(255,71,87,0.2)',
              border: '1px solid rgba(255,71,87,0.5)',
              color: '#ff4757',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div className="instructions">
          <span><span className="key">W</span><span className="key">A</span><span className="key">S</span><span className="key">D</span> Move</span>
          <span><span className="key">MOUSE</span> Look</span>
          <span><span className="key">CLICK</span> Grab Item</span>
          <span><span className="key">E</span> Add to Cart</span>
          <span><span className="key">SPACE</span> Push Cart</span>
        </div>
      </div>

      {/* Checkout Panel */}
      <Checkout 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onCheckout={() => setShowPayment(true)}
      />

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal onClose={() => setShowPayment(false)} />
      )}

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        
        <Physics gravity={[0, -9.82, 0]}>
          <Floor />
          <Walls />
          
          {/* Aisles with products */}
          <Aisle position={[-10, 0, -5]} category="produce" />
          <Aisle position={[0, 0, -5]} category="dairy" />
          <Aisle position={[10, 0, -5]} category="pantry" />
          <Aisle position={[-10, 0, 5]} category="frozen" />
          <Aisle position={[0, 0, 5]} category="beverages" />
          <Aisle position={[10, 0, 5]} category="bakery" />
          
          {/* Shopping Cart */}
          <ShoppingCart ref={cartRef} />
          
          {/* Player Controller */}
          <Player cartRef={cartRef} />
        </Physics>
        
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  )
}

export default SupermarketScene