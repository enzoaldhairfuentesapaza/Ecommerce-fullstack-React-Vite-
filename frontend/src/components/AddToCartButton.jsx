import { useRef, useState } from 'react'

function AddToCartButton({ stock, productId, onAdd }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef(null)

  const isOutOfStock = stock <= 0

  const handleClick = async () => {
    if (isOutOfStock) return

    setIsAnimating(false)

    requestAnimationFrame(() => {
      setIsAnimating(true)
    })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    onAdd(productId)

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isOutOfStock}
      className={ isOutOfStock? 'disabled' : (isAnimating ? 'adding' : '') }
    >
      <span className="text">  {isOutOfStock? 'Out of Stock' : 'Add to Cart'} </span>
    </button>
  )
}

export default AddToCartButton
