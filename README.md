# 🛒 Simple E-Commerce App

A **full-stack e-commerce web application** built using **Spring Boot** (Java backend) and **HTML/CSS/JavaScript** (frontend). This project supports authentication, cart, order management, and admin dashboard.

---

## 🚀 Technologies Used

### 🧩 Backend
- **Spring Boot 3**
- **Spring Security + JWT (Access + Refresh Tokens)**
- **Hibernate / JPA**
- **MySQL Database**
- **Maven**

### 🎨 Frontend
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Bootstrap 5**
- **VS Code Live Server**

---

## 🗂️ Project Structure
```
Simple-Ecommerce-App/
├── backend/
│   └── ecomapi/
│       ├── controller/
│       ├── entity/
│       ├── service/
│       ├── dto/
│       ├── repository/
│       ├── exceptions/
│       ├── security/
│       ├── utils/
│       └── response/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── cart.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── index.js
│       ├── cart.js
│       ├── admin.js
│       └── utils.js

```

---

## 🔐 Authentication & Authorization

- **JWT-based login system** with role-based access control
- Supports **Access Token (15 min)** and **Refresh Token (2 days)**
- Tokens stored in **localStorage**
- Spring Security handles API protection

---

## 👨‍💼 User Roles

| Role     | Features                                           |
|----------|----------------------------------------------------|
| `CUSTOMER` | View, Search, Add to Cart, Place Orders            |
| `ADMIN`    | Add Categories, Add Products (via admin panel)     |

---

## 🧑‍💻 Features

### ✅ Public
- User Registration & Login
- Responsive UI with Bootstrap

### ✅ Authenticated Users
- Product Search and Pagination
- Add to Cart / Remove / Clear
- Place Order with real-time calculation

### ✅ Admin
- Add New Categories
- Add New Products (with category link)
- Access to protected admin dashboard

---

## 📬 API Endpoints (Sample)

| Method | Endpoint                          | Description             | Access     |
|--------|-----------------------------------|-------------------------|------------|
| POST   | `/auth/register`                  | Register a new user     | Public     |
| POST   | `/auth/login`                     | Login with JWT          | Public     |
| GET    | `/api/products?page=0&size=6`     | Get paginated products  | Authenticated |
| GET    | `/api/products/search?name=abc`   | Search products         | Authenticated |
| POST   | `/api/products/add`               | Add new product         | Admin      |
| POST   | `/api/categories/add`             | Add new category        | Admin      |
| GET    | `/api/categories/all`             | Get all categories      | Admin      |
| POST   | `/api/cart/{userId}/add-to-cart/{productId}?quantity=1` | Add to cart | Customer    |
| DELETE | `/api/cart/{userId}/clear-cart`   | Clear user's cart       | Customer    |
| POST   | `/api/orders/place/{userId}`      | Place an order          | Customer    |

---

## 🛠️ Running Locally

### ▶️ Backend (Spring Boot)

```
cd backend/ecomapi
./mvnw spring-boot:run
```
Runs at: http://localhost:8080

### 🌐 Frontend (HTML/JS)

```
cd frontend
```

Runs at: http://127.0.0.1:5501 or 5051 depending on Live Server port

--- 

### 📦 Environment Setup
---

- Java 21 installed
- MySQL running (default config in application.properties)
- Change Username and Password (in application.properties)
- CORS is enabled for frontend communication
- Use Postman or built-in UI for API testing

### 📌 Notes
---

- The project uses custom ApiResponse<T> wrappers for consistency.
- Pagination uses Spring Pageable support.
- Product-category linkage handled via @ManyToOne.

### Admin Panel Access 
---

- register user using PostMan ,in which set role as "ADMIN" from the enum(Role) provided
- now open the Login page enter credentials of Admin ,you will be directed to Admin Panel
- add products ,add categories for now (remaining frontend will do in next commit like delete ,update)

