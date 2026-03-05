// client/src/components/supermarket/Product.jsx
import { useState, useRef } from 'react'
import { useBox } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useCart } from '../../hooks/useCart'

const Product = ({ data, position }) => {
  const [hovered, setHovered] = useState(false)
  const [grabbed, setGrabbed] = useState(false)
  const { addToCart } = useCart()
  const meshRef = useRef()
  const { camera, scene } = useThree()
  
  const [ref, api] = useBox(() => ({
    mass: 0.5,
    position,
    args: [0.3, 0.4, 0.2],
    type: 'Dynamic'
  }))

  // Product colors by category
  const categoryColors = {
    produce: '#4CAF50',
    dairy: '#FFF9C4',
    meat: '#FFCDD2',
    bakery: '#D7CCC8',
    pantry: '#FFCC80',
    frozen: '#B3E5FC',
    beverages: '#81D4FA'
  }

  const color = categoryColors[data.category] || '#ff6b6b'

  useFrame(() => {
    if (hovered && !grabbed) {
      meshRef.current.rotation.y += 0.02
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (!grabbed) {
      setGrabbed(true)
      // Animate towards camera/cart
      setTimeout(() => {
        addToCart(data)
        setGrabbed(false)
        // Reset position
        api.position.set(...position)
        api.velocity.set(0, 0, 0)
      }, 500)
    }
  }

  return (
    <group>
      <mesh
        ref={(node) => {
          ref.current = node
          meshRef.current = node
        }}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[0.3, 0.4, 0.2]} />
        <meshStandardMaterial 
          color={color}
          emissive={hovered ? color : '#000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
        
        {/* Product Label */}
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.08}
          color="#333"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]}
        >
          {data.name}
        </Text>
      </mesh>
      
      {/* Price tag */}
      {hovered && (
        <mesh position={[0, 0.6, 0]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshBasicMaterial color="rgba(0,0,0,0.8)" transparent />
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            ${data.price.toFixed(2)}
          </Text>
        </mesh>
      )}
    </group>
  )
}

export default Product