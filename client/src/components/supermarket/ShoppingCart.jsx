// client/src/components/supermarket/ShoppingCart.jsx
import { forwardRef, useRef, useState } from 'react'
import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ShoppingCart = forwardRef((props, ref) => {
  const [items, setItems] = useState([])
  
  // Physics body for the cart
  const [physicsRef, api] = useBox(() => ({
    mass: 10,
    position: [0, 0.5, 0],
    args: [1.2, 1, 0.8],
    type: 'Dynamic',
    linearDamping: 0.5,
    angularDamping: 0.5
  }))

  // Merge refs
  const localRef = useRef()
  const mergedRef = (node) => {
    physicsRef.current = node
    localRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <group ref={mergedRef}>
      {/* Cart Base */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[1, 0.1, 0.7]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cart Basket */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.8, 0.7]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Wireframe edges */}
      <lineSegments position={[0, 0.5, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 0.8, 0.7)]} />
        <lineBasicMaterial color="#999" />
      </lineSegments>
      
      {/* Handle */}
      <mesh castShadow position={[0, 0.9, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8]} rotation={[0, 0, Math.PI/2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Wheels */}
      {[[-0.4, -0.3], [0.4, -0.3], [-0.4, 0.3], [0.4, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
      
      {/* Items in cart */}
      {items.map((item, index) => (
        <mesh 
          key={index}
          position={[
            (Math.random() - 0.5) * 0.6,
            0.3 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.4
          ]}
          castShadow
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={item.color || '#ff6b6b'} />
        </mesh>
      ))}
    </group>
  )
})

ShoppingCart.displayName = 'ShoppingCart'

export default ShoppingCart