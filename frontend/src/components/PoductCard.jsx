import AddToCartButton from './AddToCartButton'

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>

      <p className="description">{product.description}</p>

      <div className="product-footer">
        <span className="price">${product.price}</span>
        <span className="stock">Stock: {product.stock}</span>
      </div>

      <AddToCartButton
        stock={product.stock}
        productId={product.id}
        onAdd={onAddToCart}
      />
    </div>
  )
}

export default ProductCard