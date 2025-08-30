# 🛒 Quikart - Full-Stack E-commerce Application

A robust e-commerce platform with a **Spring Boot** backend and **React + Vite** frontend. Features include role-based authentication, product management, shopping cart, order processing, payment integration, and India-specific enhancements.

---

## 🌟 Features

- **Role-based Authentication** (Customer & Admin)
- **JWT Security** for API protection
- **Product Catalog** with search, filters, and pagination
- **Shopping Cart** with quantity and stock management
- **Checkout** with Indian address format and Razorpay integration
- **Order Management** with PDF invoice/download
- **Admin Dashboard** with analytics, product/category management, and inventory alerts
- **Image Upload** (multiple images per product)
- **18% GST Calculation** and INR currency formatting
- **Mobile-first Responsive UI**

---

## 🏗️ Project Structure

### Backend (`backend/ecomapi/`)
- `controller/` - REST API endpoints
- `service/` - Business logic
- `repository/` - Data access
- `entity/` - JPA entities
- `dto/` - Data transfer objects
- `security/` - JWT & authentication
- `config/` - Configuration
- `exceptions/` - Custom exceptions
- `utils/` - Utility classes

### Frontend (`frontend/`)
- `components/` - Reusable UI
- `pages/` - Page components
- `services/` - API layer
- `context/` - React Context (Auth, Cart)
- `hooks/` - Custom hooks
- `utils/` - Utility functions
- `styles/` - CSS/styling

---

## 🚀 Technology Stack

**Backend:**  
Java 21, Spring Boot 3.5.3, Spring Security, Spring Data JPA, MySQL, JWT (JJWT), iText7, Lombok, Maven

**Frontend:**  
React 18, Vite, Tailwind CSS, React Router, React Query, React Hook Form, Axios, Lucide React, React Hot Toast



## 🌟 Features Overview

### 👤 **User Management**
- **Role-based Authentication** (Customer & Admin)
- **JWT Token-based Security**
- **Registration & Login** with validation
- **Automatic Role-based Redirects**

### 🛍️ **Customer Features**
- **Product Catalog** with search, filters, and pagination
- **Shopping Cart** with quantity management
- **Checkout Process** with Indian address format
- **Order Management** with PDF downloads
- **Razorpay Payment Integration** (Ready)

### 👨‍💼 **Admin Features**
- **Admin Dashboard** with analytics and alerts
- **Product Management** (CRUD operations)
- **Image Upload & Management** (Multiple images per product)
- **Category Management**
- **Inventory Monitoring** with low stock alerts
- **Order Management**

### 🇮🇳 **India-Specific Features**
- **INR Currency** formatting
- **Indian Address Format** (PIN codes, states)
- **18% GST** calculation
- **Indian States & Cities** dropdown
- **Mobile Number** validation
- **Popular Indian Brands** in filters


## 🏗️ Architecture

### **Backend (Spring Boot)**
```
backend/ecomapi/
├── src/main/java/com/ecommerce/ecomapi/
│   ├── controller/          # REST API endpoints
│   ├── service/            # Business logic layer
│   ├── repository/         # Data access layer
│   ├── entity/            # JPA entities
│   ├── dto/               # Data transfer objects
│   ├── security/          # JWT & authentication
│   ├── config/            # Configuration classes
│   ├── exceptions/        # Custom exceptions
│   └── utils/             # Utility classes
└── src/main/resources/
    └── application.properties
```

### **Frontend (React + Vite)**
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── context/          # React Context (Auth, Cart)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── styles/           # CSS and styling
├── public/               # Static assets
└── package.json
```



## 📊 Database Schema

### **Core Entities**

#### **Users Table**
```sql
- id (Primary Key)
- name
- email (Unique)
- password (Encrypted)
- role (CUSTOMER/ADMIN)
```

#### **Products Table**
```sql
- id (Primary Key)
- name
- description
- price
- stock_quantity
- brand
- model
- sku
- specifications
- weight
- dimensions
- is_active
- created_at
- updated_at
- category_id (Foreign Key)
```

#### **Product Images Table**
```sql
- id (Primary Key)
- product_id (Foreign Key)
- file_name
- original_file_name
- image_url
- is_primary
- display_order
- file_size
- content_type
- uploaded_at
```

#### **Categories Table**
```sql
- id (Primary Key)
- name
```

#### **Cart & Cart Items**
```sql
Cart:
- id (Primary Key)
- user_id (Foreign Key)
- total_amount

Cart Items:
- id (Primary Key)
- cart_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- total_price
```

#### **Orders & Order Items**
```sql
Orders:
- id (Primary Key)
- user_id (Foreign Key)
- total_amount
- order_status
- ordered_at

Order Items:
- id (Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- price
```

## 🔐 API Endpoints

### **Authentication Endpoints**
```
POST /auth/register          # User registration
POST /auth/login            # User login
```

### **Product Endpoints**
```
GET    /api/products/all                    # Get all products
GET    /api/products/page                   # Paginated products
GET    /api/products/product/{id}           # Get product by ID
GET    /api/products/search                 # Search products
GET    /api/products/category/{categoryId}  # Products by category
GET    /api/products/filter                 # Filter products
POST   /api/products/add                    # Add product (Admin)
PUT    /api/products/product/{id}/update    # Update product (Admin)
DELETE /api/products/product/{id}/delete    # Delete product (Admin)
```

### **Image Management Endpoints**
```
POST   /api/images/products/{id}/upload           # Upload single image
POST   /api/images/products/{id}/upload-multiple  # Upload multiple images
GET    /api/images/products/{id}                  # Get product images
GET    /api/images/products/{id}/primary          # Get primary image
GET    /api/images/products/{id}/{fileName}       # Serve image file
DELETE /api/images/{imageId}                      # Delete image
PUT    /api/images/products/{id}/primary/{imageId} # Set primary image
```

### **Cart Endpoints**
```
GET    /api/cart/cart-details/{userId}           # Get user cart
POST   /api/cart/{userId}/add-to-cart/{productId} # Add to cart
DELETE /api/cart/remove-item/{itemId}            # Remove cart item
DELETE /api/cart/{userId}/clear-cart             # Clear cart
```

### **Order Endpoints**
```
POST /api/orders/place-order              # Place order
GET  /api/orders/order/{orderId}          # Get order details
GET  /api/orders/user/{userId}/orders     # Get user orders
GET  /api/orders/{orderId}/download-pdf   # Download order PDF
GET  /api/orders/{orderId}/download-invoice # Download invoice PDF
```

### **Category Endpoints**
```
GET    /api/categories/all                    # Get all categories
POST   /api/categories/add                    # Add category (Admin)
GET    /api/categories/category/{id}/category # Get category by ID
DELETE /api/categories/category/{id}/delete   # Delete category (Admin)
```

## 🎨 Frontend Features

### **Customer Interface**

#### **Product Catalog**
- **Search & Filters** - Name, brand, category, price range
- **Pagination** - Efficient product browsing
- **Product Cards** - Amazon-style with images and CTAs
- **Responsive Grid** - 1-4 columns based on screen size

#### **Shopping Cart**
- **Cart Drawer** - Quick view from header
- **Full Cart Page** - Detailed cart management
- **Quantity Controls** - Increase/decrease with validation
- **Price Calculation** - Subtotal, GST, shipping, total
- **Stock Validation** - Prevent overselling

#### **Checkout Process**
- **Indian Address Form** - PIN codes, states, mobile validation
- **Order Summary** - Item details and pricing breakdown
- **Payment Methods** - Razorpay and Cash on Delivery
- **Order Confirmation** - Success page with download options

### **Admin Interface**

#### **Dashboard**
- **Analytics Cards** - Products, categories, inventory value
- **Low Stock Alerts** - Real-time notifications (≤10 units)
- **Quick Actions** - Add product, manage categories
- **Recent Activity** - Latest products and updates

#### **Product Management**
- **Product List** - Searchable table with filters
- **Add Product** - Comprehensive form with image upload
- **Edit Product** - Update all product attributes
- **View Product** - Detailed product information
- **Image Management** - Upload, delete, set primary images
- **Stock Monitoring** - Visual stock status indicators

#### **Category Management**
- **Category List** - All categories with management options
- **Add/Edit Categories** - Modal-based operations
- **Search Categories** - Quick category lookup

#### **Notifications**
- **Stock Alerts** - Critical (≤5), Warning (6-10), Low (≤10)
- **Filter Notifications** - View by severity level
- **Quick Actions** - Direct links to update stock

## 🛠️ Setup & Installation

### **Prerequisites**
- **Java 21+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Maven 3.6+**

### **Backend Setup**

1. **Clone the repository**
```bash
git clone <repository-url>
cd Quikart/backend/ecomapi
```

2. **Configure Database**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecomdb
spring.datasource.username=root
spring.datasource.password=root
```

3. **Run the application**
```bash
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### **Frontend Setup**

1. **Navigate to frontend directory**
```bash
cd ../../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## 🔧 Configuration

### **Backend Configuration**

#### **Database Configuration**
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecomdb
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### **File Upload Configuration**
```properties
# File Upload
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=25MB
app.file.upload-dir=uploads
app.base-url=http://localhost:8080
```

#### **CORS Configuration**
```java
// Configured for Vite development server
allowedOrigins: http://localhost:5173, http://127.0.0.1:5173
```

### **Frontend Configuration**

#### **API Base URL**
```javascript
// services/api.js
baseURL: 'http://localhost:8080'
```

#### **Vite Configuration**
```javascript
// vite.config.js
server: {
  port: 5173,
  host: true,
  cors: true
}
```

## 🎯 User Flows

### **Customer Journey**
1. **Registration/Login** → Role-based redirect
2. **Browse Products** → Search, filter, paginate
3. **Product Details** → View images, specifications
4. **Add to Cart** → Quantity selection, stock validation
5. **Cart Management** → Update quantities, remove items
6. **Checkout** → Indian address form, payment method
7. **Order Confirmation** → PDF download, order tracking

### **Admin Journey**
1. **Admin Login** → Dashboard with analytics
2. **Product Management** → Add, edit, view, delete products
3. **Image Management** → Upload, organize product images
4. **Inventory Monitoring** → Stock alerts and notifications
5. **Category Management** → Organize product categories
6. **Order Management** → View and process customer orders

## 📱 Responsive Design

### **Mobile-First Approach**
- **Responsive Grid** - Adapts to screen size
- **Touch-Friendly** - Large buttons and easy navigation
- **Mobile Navigation** - Collapsible sidebar and menus
- **Optimized Images** - Proper sizing and loading

### **Breakpoints**
- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2-3 columns)
- **Desktop**: > 1024px (4 columns)

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Tokens** - Secure token-based authentication
- **Role-based Access** - Customer vs Admin permissions
- **Protected Routes** - Frontend route protection
- **Password Encryption** - BCrypt hashing
- **CORS Configuration** - Cross-origin request handling

### **Data Validation**
- **Frontend Validation** - React Hook Form validation
- **Backend Validation** - Spring Boot validation annotations
- **File Upload Security** - Type and size validation
- **SQL Injection Prevention** - JPA parameterized queries



## 🔮 Future Enhancements

### **Planned Features**
- **Product Reviews & Ratings**
- **Wishlist Functionality**
- **Advanced Analytics Dashboard**
- **Email Notifications**
- **Product Variants** (Size, Color)
- **Inventory Tracking** (Purchase orders)
- **Bulk Operations** (Import/Export)
- **Multi-language Support**
- **Real-time Chat Support**
- **Advanced Search** (Elasticsearch)

### **Payment Integration**
- **Razorpay Integration** - Complete payment flow
- **Payment Status Tracking**
- **Refund Management**
- **Payment Analytics**

### **Performance Optimizations**
- **Image Optimization** - WebP format, lazy loading
- **Caching Strategy** - Redis integration
- **Database Optimization** - Indexing, query optimization
- **CDN Integration** - Static asset delivery



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development** - Spring Boot, MySQL, Security
- **Frontend Development** - React, Tailwind CSS, State Management
- **UI/UX Design** - Responsive design, User experience




## **Built with ❤️ using Spring Boot & React**
