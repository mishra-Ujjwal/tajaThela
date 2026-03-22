<div align="center">

# 🛒 Taja Thela

### Bringing Street Vendors Online — One Thela at a Time

*A full-stack marketplace platform connecting local street vendors with customers, powered by real-time order tracking and seamless delivery management.*

</div>

---

## 📖 About

**Taja Thela** is a digital marketplace built to empower local street vendors by giving them an online presence. The platform bridges the gap between vendors, customers, and delivery partners through a unified, role-based system — making fresh, local goods more accessible than ever.

---

## 👥 Roles & Panels

The platform is built around three core roles, each with a dedicated panel:

| Role | Description |
|------|-------------|
| 🧑‍🌾 **Vendor** | List products, manage inventory, and process incoming orders |
| 🛒 **Customer** | Browse vendors, add items to cart, place orders, and track deliveries |
| 🚚 **Delivery Partner** | Accept or reject delivery assignments and update delivery status |

---

## ✨ Features

### 🧑‍🌾 Vendor Panel
- Add, edit, and delete product listings
- Manage stock levels and inventory in real time
- View and process incoming customer orders

### 🛒 Customer Panel
- Browse products filtered by vendor
- Add items to a shopping cart
- Place orders and track their status end-to-end

### 🚚 Delivery Panel
- View a list of assigned deliveries
- Accept or reject delivery requests
- Update delivery status as orders progress

### 🔐 Authentication & Authorization
- Secure signup and login for all roles
- JWT-based session management
- Role-based access control — each user only sees what they need

### 📦 Order Lifecycle
Orders move through a clear, trackable pipeline:

```
Pending  →  Processing  →  Out for Delivery  →  Delivered
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, Tailwind CSS / Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth** | JSON Web Tokens (JWT) |
| **HTTP Client** | Axios |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/taja-thela.git
cd taja-thela
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**4. Start the development server**
```bash
npm run dev
```

The app will be running at `http://localhost:5000` (or the port you configured).

---

## 📁 Project Structure

```
taja-thela/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Role-specific pages (Vendor, Customer, Delivery)
│   │   └── context/        # Auth & cart context
├── server/                 # Node.js + Express backend
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   └── middleware/         # Auth & role guards
├── .env                    # Environment variables (not committed)
└── package.json
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/products` | Fetch all products |
| `POST` | `/api/products` | Add a new product (Vendor) |
| `POST` | `/api/orders` | Place an order (Customer) |
| `PATCH` | `/api/orders/:id` | Update order status |
| `GET` | `/api/deliveries` | Fetch deliveries (Delivery Partner) |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure to follow the existing code style and include relevant tests where applicable.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ to support local vendors

⭐ Star this repo if you find it useful!

</div>
