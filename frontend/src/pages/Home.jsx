import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/PoductCard";
import OrderConfirmationModal from "../components/OrderConfirmationModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]) // Productos por pagina
  const [allProducts, setAllProducts] = useState([]) // TODOS los productos

  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showOrders, setShowOrders] = useState(false)

  const [showOrderModal, setShowOrderModal] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState(null)


  // PAGINADO
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(3) // Productos por pagina
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('sessionId')
    return saved || `session-${Date.now()}`
  })

  // FILTERS
  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    min_price: "",
    max_price: "",
    sort_by: "name",
    order: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("name") // name, price, stock
  const [sortOrder, setSortOrder] = useState("asc") // asc, desc


  useEffect(() => {
    localStorage.setItem('sessionId', sessionId)
    fetchProducts()
    fetchCart()
  }, [sessionId])

  useEffect(() => {
    fetchProducts();
  }, [page, limit, filtersApplied]);


  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/all`)
        if (!response.ok) throw new Error('Failed to fetch all products')
        const data = await response.json()
        setAllProducts(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAllProducts()
  }, [])
  
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
        sort_by: filtersApplied.sort_by,
        order: filtersApplied.order,
      });

      if (filtersApplied.search) params.append("search", filtersApplied.search);
      if (filtersApplied.min_price) params.append("min_price", filtersApplied.min_price);
      if (filtersApplied.max_price) params.append("max_price", filtersApplied.max_price);

      const response = await fetch(`${API_URL}/api/products/?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      setProducts(Array.isArray(data.items) ? data.items : []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}`)
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      setCart(data.items || [])
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
  }

  const addToCart = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail)
      }
      await fetchCart()
    } catch (err) {
      alert(err.message)
    }
  }

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity === 0) {
        await removeFromCart(productId)
        return
      }
      const response = await fetch(`${API_URL}/api/cart/${sessionId}/items/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail)
      }
      await fetchCart()
    } catch (err) {
      alert(err.message)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}/items/${productId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to remove item')
      await fetchCart()
    } catch (err) {
      alert(err.message)
    }
  }

  const createOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_items: cart })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail)
      }
      const order = await response.json()
      // alert(`Order created successfully! Order ID: ${order.id}`)

      setCreatedOrderId(order.id)
      setShowOrderModal(true)

      // Clear cart
      await fetch(`${API_URL}/api/cart/${sessionId}`, { method: 'DELETE' })
      await fetchCart()
      await fetchProducts()
      setShowCart(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = allProducts.find(p => p.id === item.product_id)
      return total + (product ? product.price * item.quantity : 0)
    }, 0).toFixed(2)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>

  
  return (
    <div className="app">
      <header className="header">
        <h1>E-commerce Store</h1>
        <div className="header-buttons">
          <button
            className="cart-button"
            onClick={() => { setShowCart(!showCart); setShowOrders(false); }}
          >
            Cart ({getCartItemCount()})
          </button>
          <button
            className="orders-button"
            onClick={() => {
              setShowOrders(!showOrders);
              setShowCart(false);
              if (!showOrders) fetchOrders();
            }}
          >
            Orders
          </button>
        </div>
      </header>

      {showCart && (
        <div className="cart-panel">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => {
                  const product = allProducts.find(p => p.id === item.product_id)
                  if (!product) return null
                  return (
                    <div key={item.product_id} className="cart-item">
                      <img src={product.image_url} alt={product.name} />
                      <div className="cart-item-details">
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <div className="quantity-controls">
                          <button onClick={() => updateCartItem(item.product_id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartItem(item.product_id, item.quantity + 1)}>+</button>
                          <button
                            className="remove-button"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        ${(product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="cart-footer">
                <h3>Total: ${getCartTotal()}</h3>
                <button className="checkout-button" onClick={createOrder}>
                  Create Order
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showOrders && (
        <div className="orders-panel">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.id.substring(0, 8)}</h3>
                    <span className="order-status">{order.status}</span>
                  </div>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.product_name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <OrderConfirmationModal
      isOpen={showOrderModal}
      orderId={createdOrderId}
      onClose={() => setShowOrderModal(false)}
      onViewOrder={() => {
          setShowOrderModal(false);
          navigate(`/order/${createdOrderId}`);
      }}
      />
      {/* ==================== FILTERS ==================== */}
    <div className="filters">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
      />
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="stock">Stock</option>
      </select>
      <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      
      <button onClick={() => {
          setPage(1);
          setFiltersApplied({
            search: searchTerm,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: sortBy,
            order: sortOrder,
          });
        }}
      >
        Apply Filters
      </button>


      <button onClick={() => {
          setSearchTerm("");
          setMinPrice("");
          setMaxPrice("");
          setSortBy("name");
          setSortOrder("asc");
          setPage(1);

          setFiltersApplied({
            search: "",
            min_price: "",
            max_price: "",
            sort_by: "name",
            order: "asc",
          });
        }}
      >
        Clear Filters
      </button>

      </div>

      {/* ==================== PRODUCTS LIST ==================== */}

      <main className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
      </main>

      {/* ==================== PAGINATION ==================== */}
      <div className="pagination">
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <span key={idx + 1} className={`page-number ${page === idx + 1 ? "active" : ""}`} onClick={() => setPage(idx + 1)}>
            {idx + 1}
          </span>
        ))}

        <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
        Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalProducts)} of {totalProducts} products
      </p>

    </div>
  )
}

export default Home;
