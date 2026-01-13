# DreamFundr 🚀  
*A full-stack crowdfunding platform with secure payments and webhook-based verification.*

---

## 📌 Overview

**DreamFundr** is a crowdfunding web application that allows users to create fundraising campaigns and accept donations using a secure payment workflow.

The project is designed to simulate **real-world crowdfunding platforms**, with a strong focus on:
- Secure authentication
- Payment verification using **webhooks**
- Failure-safe backend design
- Clean separation of concerns

Rather than being UI-focused, DreamFundr emphasizes **backend correctness and system reliability**.

---

## 🎯 Key Features

### 👤 User Features
- Secure user authentication (JWT-based)
- Create and manage fundraising campaigns
- Browse campaigns and track donation progress
- Donate to campaigns using online payments

### 💳 Payment Handling (Razorpay)
- Order creation through backend
- Secure payment verification
- **Webhook-based confirmation** for payment status
- Protection against duplicate or tampered transactions
- Sandbox-mode payments for safe testing

> Live mode is intentionally disabled, but the implementation follows the same architecture required for production systems.

---

## 🧠 System Design Highlights

- **Stateless authentication** using JWT
- **Webhook-driven payment verification** (source-of-truth model)
- Backend-first trust model (client never marks payments as successful)
- Separation of payment lifecycle from UI state

---

## 🧩 Tech Stack

### Frontend
- React
- Next.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL (Prisma)
- JWT Authentication
- Rate-Limiter

### Payments
- Razorpay (Sandbox Mode)
- Razorpay Webhooks

---

## 🧪 Future Improvements

- Campaign moderation & verification
- Admin dashboard
- Refund handling workflows
- Redis caching for popular campaigns
- Dockerized deployment
- CI/CD pipeline

---

## 🧠 What I Learned

- Implementing webhook-based payment verification
- Designing backend systems that do not trust the client
- Handling asynchronous external events safely
- Structuring scalable Express.js applications
- Understanding real-world payment system constraints

---

## 📄 Disclaimer

This project is built for **educational and demonstration purposes**.  
Payments are processed in sandbox mode only and no real money is involved.

---

## 👨‍💻 Author

Built by **Piyush Sharma**  
Software Engineering Student | Full-Stack Developer

---

⭐ If you find this project useful or interesting, feel free to star the repository!

