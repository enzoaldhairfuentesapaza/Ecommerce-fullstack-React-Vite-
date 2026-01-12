"""
Product API routes
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from models import Product

from database import get_db
import schemas
from controllers import products as product_controller
import math

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/", response_model=schemas.PaginatedProducts)
def list_products(
    search: str = Query(None),
    min_price: float = Query(None),
    max_price: float = Query(None),
    sort_by: str = Query("name"),
    order: str = Query("asc"),
    page: int = Query(1),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """List all products with optional search, filters, sorting, and pagination"""
    return product_controller.list_products(db, search, min_price, max_price, sort_by, order, page, limit)


@router.get("/paginated", response_model=schemas.PaginatedProducts)
def get_products_paginated(page: int = Query(1, ge=1), limit: int = Query(10, ge=1), db: Session = Depends(get_db)):
    """Get products with basic pagination only"""
    return product_controller.get_products_paginated(db, page, limit)

@router.get("/all", response_model=List[schemas.Product])
def get_all_products(db: Session = Depends(get_db)):
    """Get all products"""
    return product_controller.get_all_products(db)


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    return product_controller.get_product_by_id(product_id, db)


@router.post("", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Create a new product (for admin/testing)"""
    return product_controller.create_product(product, db)
