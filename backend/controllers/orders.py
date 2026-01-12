"""
Order processing business logic
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
import models
import schemas
import uuid
import math
import models


def create_order(order_request: schemas.CreateOrderRequest, db: Session):
    """Create an order from cart items"""
    if not order_request.cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_items = []
    total = 0.0

    # Validate and process each item
    for cart_item in order_request.cart_items:
        product = db.query(models.Product).filter(
            models.Product.id == cart_item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {cart_item.product_id} not found"
            )

        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        # Deduct stock
        product.stock -= cart_item.quantity

        # Create order item
        order_item = models.OrderItem(
            product_id=product.id,
            product_name=product.name,
            quantity=cart_item.quantity,
            price=product.price
        )
        order_items.append(order_item)
        total += product.price * cart_item.quantity

    # Create order
    order = models.Order(
        id=str(uuid.uuid4()),
        total=round(total, 2),
        status="pending",
        items=order_items
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


def get_orders_paginated(db: Session, page: int = 1, limit: int = 10):
    """Get orders with pagination"""
    if page < 1:
        page = 1
    if limit < 1:
        limit = 10

    total = db.query(models.Order).count()
    pages = math.ceil(total / limit) if total > 0 else 1

    if page > pages:
        return {
            "items": [],
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }

    offset = (page - 1) * limit

    items = (
        db.query(models.Order)
        .order_by(models.Order.created_at.desc())  # opcional, orden reciente primero
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

def get_all_orders(db: Session):
    """Get all orders"""
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    return orders


def get_order_by_id(order_id: str, db: Session):
    """Get a single order by ID"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
