import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);

  /* =========================
     Order detail
  ========================= */
  useEffect(() => {
    fetch(`${API_URL}/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [orderId]);

  /* =========================
     Products, (Para las imagenes)
  ========================= */
  useEffect(() => {
  fetch(`${API_URL}/api/products/all`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

const getProductById = (id) => {
  if (!Array.isArray(products)) return null;
  return products.find(p => p.id === id);
};

  if (!order) return <p>Loading...</p>;

  /* =========================
     Calculos
  ========================= */
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const statusClassMap = {
    pending: "status-pending",
    completed: "status-successful",
    cancelled: "status-cancelled"
  };

  return (
    <div className="order-detail">

      {/* Back button */}
      <a
        href="#"
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        ← Back to Orders
      </a>

      {/* Header */}
      <div className="order-header">
        <div className="order-title">
          <h1>Order Details</h1>
          <div className="order-id">Order ID: {order.id}</div>
        </div>

        <span
          className={`order-status ${statusClassMap[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      {/* Info grid */}
      <div className="order-info-grid">
        <div className="info-item">
          <div className="info-label">Order Date</div>
          <div className="info-value">
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="info-item">
          <div className="info-label">Total Items</div>
          <div className="info-value">
            {order.items.length} items
          </div>
        </div>

        <div className="info-item">
          <div className="info-label">Payment Status</div>
          <div className="info-value">Paid</div>
        </div>

        <div className="info-item">
          <div className="info-label">Delivery Status</div>
          <div className="info-value">Processing</div>
        </div>
      </div>

      {/* Items */}
      <h2 className="section-title">Order Items</h2>

      <div className="items-list">
        {order.items.map((item, index) => {
          const product = getProductById(item.product_id);

          return (
            <div key={index} className="order-item">
              <img
                src={product?.image_url || "/placeholder.png"}
                alt={item.product_name}
                className="item-image"
              />

              <div className="item-details">
                <div className="item-name">{item.product_name}</div>
                <div className="item-meta">
                  Quantity: {item.quantity} × ${item.price}
                </div>
              </div>

              <div className="item-price">
                <div className="item-unit-price">
                  ${item.price} each
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="order-summary">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Shipping</span>
          <span className="summary-value">Free</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Tax (10%)</span>
          <span className="summary-value">
            ${tax.toFixed(2)}
          </span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button className="btn btn-secondary">
          Download Invoice
        </button>
        <button className="btn btn-primary">
          Track Order
        </button>
      </div>

    </div>
  );
}

export default OrderDetail;
