# E-commerce Full Stack Challenge

This is a technical challenge for mid-level full-stack developers. The challenge involves building an e-commerce application with product listing, shopping cart, and order management functionality using React and FastAPI.

> **Quick Start**: Want to jump right in? Check out [QUICK_START.md](QUICK_START.md) for commands and troubleshooting.

## 📋 Challenge Overview

### Current Implementation

The application currently includes:

- **Backend (FastAPI)**:
  - Product management API with SQLAlchemy ORM
  - Shopping cart management with session handling
  - Order creation and tracking
  - PostgreSQL database with persistent storage
  - RESTful API endpoints
  - Automatic database initialization with sample products

- **Frontend (React + Vite)**:
  - Product listing with images and details
  - Shopping cart functionality
  - Order creation
  - Order history view
  - Responsive design

### Tech Stack

- **Backend**: FastAPI 0.128.0, Python 3.10+, SQLAlchemy 2.0, PostgreSQL 16
- **Frontend**: React 19.0, Vite 6.0
- **Database**: PostgreSQL 16 (with Docker volume for persistence)
- **Containerization**: Docker & Docker Compose

## 🎯 Your Mission

Choose **one or more** of the following tasks to demonstrate your skills:

### Level 1: Enhancements (Pick 2-3)

1. **Add Product Search and Filtering**
   - Implement search functionality by product name
   - Add filters by price range
   - Add sorting options (price, name, stock)

2. **Improve Cart UX**
   - Add animations when adding/removing items
   - Show toast notifications for actions
   - Implement cart item quantity validation

3. **Add User Authentication**
   - Implement basic JWT authentication
   - Replace session-based cart with user-based cart
   - Add login/register pages

4. **Database Enhancements**
   - Add database migrations with Alembic
   - Implement database indexing for performance
   - Add database backup/restore functionality

5. **Add Product Categories**
   - Create category model and endpoints
   - Update frontend to filter by category
   - Add category navigation

### Level 2: Advanced Features (Pick 1-2)

1. **Payment Integration**
   - Integrate a payment gateway (Stripe test mode)
   - Add payment confirmation flow
   - Update order status based on payment

2. **Admin Dashboard**
   - Create admin authentication
   - Build product management interface (CRUD)
   - Add order management view
   - Include basic analytics (sales, popular products)

3. **Real-time Updates**
   - Implement WebSocket connections
   - Show real-time stock updates
   - Add live order status updates

4. **Testing Suite**
   - Write unit tests for backend (pytest)
   - Add integration tests for API endpoints
   - Implement frontend tests (Vitest/React Testing Library)
   - Achieve >70% code coverage

5. **Performance Optimization**
   - Implement Redis caching for products
   - Add pagination to product listing
   - Optimize images and lazy loading
   - Add API rate limiting

### Level 3: Architecture & DevOps (Optional)

1. **Microservices Architecture**
   - Split cart and orders into separate services
   - Implement service-to-service communication
   - Add API Gateway

2. **CI/CD Pipeline**
   - Set up GitHub Actions or GitLab CI
   - Add automated testing
   - Implement automated deployment

3. **Monitoring & Logging**
   - Add structured logging
   - Implement error tracking (Sentry)
   - Add performance monitoring

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 22+ (if running locally)
- Python 3.10+ (if running locally)

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd challenge
```

2. Start the application:
```bash
docker-compose up --build
```

This will start three services:
- **PostgreSQL database** on port 5432
- **Backend API** on port 8000
- **Frontend** on port 3000

The database will be automatically initialized with sample products on first run.

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - PostgreSQL: localhost:5432 (credentials in docker-compose.yml)

4. Stop the application:
```bash
docker-compose down
```

To remove the database volume (reset all data):
```bash
docker-compose down -v
```

### Running Locally (Development)

**Note**: For local development, you'll need PostgreSQL installed or use SQLite.

#### Option 1: Use Docker for Database Only

```bash
# Start only PostgreSQL
docker-compose up db

# In another terminal, run backend
cd backend
pip install -r requirements.txt
export DATABASE_URL="postgresql://ecommerce:ecommerce123@localhost:5432/ecommerce"
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, run frontend
cd frontend
npm install
npm run dev
```

#### Option 2: Use SQLite (No PostgreSQL Required)

```bash
# Backend
cd backend
pip install -r requirements.txt
export DATABASE_URL="sqlite:///./ecommerce.db"
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

### Key Endpoints

**Products**
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product by ID

**Cart**
- `GET /api/cart/{session_id}` - Get cart
- `POST /api/cart/{session_id}/items` - Add item to cart
- `PUT /api/cart/{session_id}/items/{product_id}` - Update cart item
- `DELETE /api/cart/{session_id}/items/{product_id}` - Remove item
- `DELETE /api/cart/{session_id}` - Clear cart

**Orders**
- `POST /api/orders` - Create order
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get order by ID

## 🏗️ Project Structure

```
challenge/
├── backend/
│   ├── main.py              # FastAPI application & API routes
│   ├── models.py            # SQLAlchemy database models
│   ├── database.py          # Database configuration & session
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── docker-compose.yml       # Multi-container orchestration
├── .gitignore
├── README.md               # This file
├── CHALLENGE.md            # Detailed challenge instructions
├── DATABASE.md             # Database schema documentation
└── QUICK_START.md          # Quick start guide & useful commands
```

## 📝 Submission Guidelines

1. **Code Quality**
   - Write clean, readable code
   - Follow Python PEP 8 and JavaScript/React best practices
   - Add comments for complex logic
   - Use meaningful variable and function names

2. **Documentation**
   - Update this README with your changes
   - Document new API endpoints
   - Add setup instructions for new features
   - Include environment variables in `.env.example`

3. **Git Workflow**
   - Create a new branch for your work
   - Make atomic commits with clear messages
   - Keep your commit history clean

4. **Testing**
   - Test all new features thoroughly
   - Ensure Docker setup works correctly
   - Verify the application works end-to-end

5. **Deliverables**
   - Source code with your implementations
   - Updated README with:
     - Features you implemented
     - Setup instructions
     - Any assumptions made
     - Known limitations
   - (Optional) Screen recording or screenshots

## 🎓 Evaluation Criteria

Your submission will be evaluated based on:

1. **Functionality** (40%)
   - Features work as expected
   - No critical bugs
   - Good error handling

2. **Code Quality** (30%)
   - Clean, readable code
   - Proper separation of concerns
   - Following best practices

3. **Architecture** (15%)
   - Good project structure
   - Scalable design decisions
   - Proper use of patterns

4. **Documentation** (10%)
   - Clear README
   - Code comments where needed
   - API documentation

5. **Testing** (5%)
   - Test coverage
   - Edge cases considered

## 💡 Tips

- Focus on quality over quantity
- Don't try to implement everything - choose features that showcase your strengths
- Make sure your Docker setup works before submission
- Consider edge cases and error handling
- Keep the UI/UX simple but polished

## ❓ Questions?

If you have questions about the challenge requirements, please document your assumptions in the README.

## 📄 License

This challenge is for evaluation purposes only.

---

**Good luck! We're excited to see what you build! 🚀**
