# 🛍️ HeritageAlly — E-Commerce Platform

> Timeless Heritage, Modern Style — Discover Quality You Can Trust at Heritage Ally

![Live](https://img.shields.io/badge/Live-Online-brightgreen)
![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![Razorpay](https://img.shields.io/badge/Payment-Razorpay-blue)

🔗 **Live Demo:** https://heritageally-gahe.onrender.com

---

## 📌 About The Project

HeritageAlly is a full-featured E-Commerce web application built with the **MERN Stack**. Users can browse and purchase **Clothes, Electronics, Furniture, Gym Equipment** and more — with a seamless, secure and responsive shopping experience.

---

## ✨ Features

### 👤 User Side
- ✅ Signup & Login with JWT Authentication
- ✅ OTP Verification & Forgot Password via Email
- ✅ Browse products by Main Category & Subcategory
- ✅ Search, Filter & Sort products
- ✅ Add to Cart & Wishlist
- ✅ Razorpay Payment Gateway (Net Banking, UPI, Cards)
- ✅ Order confirmation email after successful purchase
- ✅ Customer Reviews & Testimonials
- ✅ FAQ Section
- ✅ Contact Us form
- ✅ Fully Responsive UI across all devices

### 🛠️ Admin Side
- ✅ Complete Admin Dashboard with sidebar navigation
- ✅ Manage Main Categories & Subcategories
- ✅ Manage Brands, Products & Features
- ✅ View & manage all Orders
- ✅ User Management
- ✅ Newsletter Management
- ✅ Settings & Contact submissions

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT Tokens |
| Payment | Razorpay |
| Email | Nodemailer (SMTP) |
| Deployment | Render |

---

## 📁 Project Structure

```
HeritageAlly/
│
├── frontend/         # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.js
│   └── package.json
│
├── backend/          # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/vishant8491/HeritageAlly.git
cd HeritageAlly
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Setup Environment Variables

Backend folder mein `.env` file banao:

```env
PORT=5000
# Database
DB_KEY=your_mongodb_connection_string

# Email Configuration
MAILSENDER=your_email@gmail.com
PASSWORD=your_email_app_password

# Site Information
SITE_NAME=HeritageAlly
SITE_EMAIL=your_site_email
SITE_PHONE=your_phone_number
SITE_ADDRESS=your_address
SITE_URL=your_site_url

# JWT Keys
JWT_OPEN_KEY=your_jwt_open_secret_key
JWT_USER_KEY=your_jwt_user_secret_key

# Cloudinary
PUBLIC_TOKEN=your_jwt_public_token

# Razorpay
RPKEYID=your_razorpay_key_id
RPSECRETKEY=your_razorpay_secret_key
```

### 5. Run the Application

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

### 6. Open in Browser
```
http://localhost:3000
```

---

## 💳 Payment Integration

Razorpay integrated for secure checkout supporting:
- 🏦 Net Banking
- 📱 UPI
- 💳 Credit / Debit Cards

---

## 📧 Email System

| Trigger | Email Sent |
|---------|-----------|
| Successful Order | Order confirmation email |
| New Signup | OTP verification email |
| Forgot Password | Password reset link email |

All emails sent via **Nodemailer SMTP**

---

## 🔐 Security Features

- JWT token based authentication
- Protected routes for users & admins
- Password hashing with bcrypt
- OTP expiry validation
- Role-based access control (User / Admin / Super Admin)
- Environment variables for all sensitive keys

---

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)

### Shop Page
![Shop](./screenshots/shop.png)

### Admin Dashboard
![Admin](./screenshots/admin.png)

### Orders Panel
![Orders](./screenshots/orders.png)

---

## 🚀 Deployment

Deployed on **Render** (free tier)


---

## 👨‍💻 Author

**Vishant Pal**

- 📧 Email: vishantpal62@gmail.com
- 💼 LinkedIn: [linkedin.com/in/vishant-pal](https://www.linkedin.com/in/vishant-pal-42a9a9293/)
- 🐙 GitHub: [github.com/vishant8491](https://github.com/vishant8491)

---

## 📄 License

This project is built for **educational and portfolio purposes**.

---

⭐ **If you liked this project, please give it a star!** ⭐
