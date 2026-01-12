import Modal from "./Modal";

export default function OrderConfirmationModal({
  isOpen,
  orderId,
  onClose,
  onViewOrder,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-icon">✓</div>

      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        Order Created Successfully!
      </h2>

      <p style={{ textAlign: "center", color: "#6b7280" }}>
        Your order has been placed and is being processed.
      </p>

      <div className="order-id">
        Order ID: <strong>{orderId}</strong>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#6b7280",
        }}
      >
        You will receive a confirmation email shortly.
      </p>

      <div className="modal-buttons">
        <button
          className="modal-btn modal-btn-secondary"
          onClick={onClose}
        >
          Continue Shopping
        </button>

        <button
          className="modal-btn modal-btn-primary"
          onClick={onViewOrder}
        >
          View Order
        </button>
      </div>
    </Modal>
  );
}
