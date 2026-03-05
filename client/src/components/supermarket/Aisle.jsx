// client/src/components/supermarket/Aisle.jsx
import { useEffect, useState } from 'react'
import { useBox } from '@react-three/cannon'
import Shelf from './Shelf'
import Product from './Product'

const Aisle = ({ position, category }) => {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    // Fetch products for this category
    fetch(`/api/products?category=${category}`)
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [category])

  return (
    <group position={position}>
      {/* Aisle Floor Marking */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[4, 15]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Category Sign */}
      <mesh position={[0, 3.5, -7]} castShadow>
        <boxGeometry args={[3, 0.5, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Shelves on both sides */}
      <Shelf position={[-1.5, 0, 0]} side="left" />
      <Shelf position={[1.5, 0, 0]} side="right" />
      
      {/* Products */}
      {products.map((product, index) => (
        <Product 
          key={product._id}
          data={product}
          position={[
            index % 2 === 0 ? -1.3 : 1.3,
            1 + Math.floor(index / 4) * 0.8,
            -6 + (index % 4) * 3
          ]}
        />
      ))}
    </group>
  )
}

export default Aisle