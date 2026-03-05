// client/src/components/supermarket/Shelf.jsx
import { useBox } from '@react-three/cannon'

const Shelf = ({ position, side }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + 1.5, position[2]],
    args: [0.4, 3, 14]
  }))

  return (
    <group>
      {/* Main shelf structure */}
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[0.4, 3, 14]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Shelf levels */}
      {[0.5, 1.3, 2.1].map((y, i) => (
        <mesh 
          key={i}
          position={[position[0], y, position[2]]}
          castShadow
        >
          <boxGeometry args={[0.5, 0.05, 14]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      ))}
      
      {/* Back panel */}
      <mesh 
        position={[position[0] + (side === 'left' ? 0.2 : -0.2), 1.5, position[2]]}
        castShadow
      >
        <boxGeometry args={[0.02, 3, 14]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
}

export default Shelf