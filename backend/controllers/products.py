"""
Product business logic
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

import models
import schemas
import uuid

import math
import models


def list_products(
    db: Session,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "name",
    order: str = "asc",
    page: int = 1,
    limit: int = 10
) -> schemas.PaginatedProducts:
    
    """
    List products with optional search, price filtering, sorting, and pagination.
    Returns a PaginatedProducts object.
    """

    query = db.query(models.Product)

    if search:
        query = query.filter(
            (models.Product.name.ilike(f"%{search}%")) |
            (models.Product.description.ilike(f"%{search}%"))
        )

    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)

    sort_column = getattr(models.Product, sort_by, models.Product.name)
    if order == "desc":
        sort_column = sort_column.desc()
    query = query.order_by(sort_column)

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    pages = math.ceil(total / limit) if total > 0 else 1

    return schemas.PaginatedProducts(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )



def get_products_paginated(db: Session, page: int = 1, limit: int = 10) -> schemas.PaginatedProducts:
    """
    Basic pagination without filters.
    Useful for Challenge 04.
    """
    query = db.query(models.Product)
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    pages = math.ceil(total / limit) if total > 0 else 1

    return schemas.PaginatedProducts(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )

def get_all_products(db: Session):
    """Get all products from database"""
    return db.query(models.Product).all()


def get_product_by_id(product_id: str, db: Session):
    """Get a single product by ID"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def create_product(product_data: schemas.ProductCreate, db: Session):
    """Create a new product"""
    db_product = models.Product(
        id=str(uuid.uuid4()),
        **product_data.dict()
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def init_sample_products(db: Session):
    """Initialize database with sample products if empty"""
    count = db.query(models.Product).count()
    if count > 0:
        return

    sample_products = [
        models.Product(
            id=str(uuid.uuid4()),
            name="Wireless Headphones",
            description="High-quality wireless headphones with noise cancellation",
            price=99.99,
            stock=50,
            image_url="https://i.imgur.com/ZANVnHE.jpg"
        ),
        models.Product(
            id=str(uuid.uuid4()),
            name="Smart Watch",
            description="Fitness tracker with heart rate monitor",
            price=199.99,
            stock=30,
            image_url="https://i.imgur.com/mp3rUty.jpg"
        ),
        models.Product(
            id=str(uuid.uuid4()),
            name="Laptop Backpack",
            description="Water resistant laptop backpack with USB charging port",
            price=49.99,
            stock=100,
            image_url="https://i.imgur.com/9DqEOV5.jpg"
        ),
        models.Product(
            id=str(uuid.uuid4()),
            name="Running Shoes",
            description="Comfortable running shoes with excellent cushioning",
            price=89.99,
            stock=75,
            image_url="https://i.imgur.com/tXeOYWE.jpg"
        ),
        models.Product(
            id=str(uuid.uuid4()),
            name="Mechanical Keyboard",
            description="RGB mechanical keyboard with blue switches",
            price=129.99,
            stock=40,
            image_url="https://i.imgur.com/R3iobJA.jpg"
        ),
        models.Product(
            id=str(uuid.uuid4()),
            name="Wireless Mouse",
            description="Ergonomic wireless mouse with precision tracking",
            price=29.99,
            stock=120,
            image_url="https://i.imgur.com/w3Y8NwQ.jpg"
        ),
    ]

    db.add_all(sample_products)
    db.commit()
