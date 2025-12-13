# Online Vehicle Rental System

A full-stack MERN application that allows users to browse, book, and review vehicles for rent. The system includes authentication, payment integration (Razorpay), and rental history tracking.

---

## Tech Stack

| Layer          | Technologies                             |
| -------------- | ---------------------------------------- |
| Frontend       | React, Tailwind CSS, Axios, React Router |
| Backend        | Node.js, Express.js, MongoDB, Mongoose   |
| Authentication | JWT (JSON Web Token)                     |
| Payment        | Razorpay                                 |
| Deployment     | Netlify / Render / MongoDB Atlas         |

---

## Project Structure

```
vehicle-rental-system/
├── backend/          # Express + MongoDB API
├── frontend/         # React + Tailwind app
└── README.md         # Project setup guide
```

---

## ⚙️ Installation Guide

### 1️. Clone the Repository

```bash
git clone https://github.com/Sugan-g/vehicle-rental-system.git
cd vehicle-rental-system
```

### 2️.Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file inside `/backend`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your email
EMAIL_PASS=your password
```

#### Start Backend

```bash
npm run dev
```

Server will start at 👉 **http://localhost:5000**

---

### 3.Setup Frontend

```bash
cd ../frontend
npm install
```

#### Create `.env` file inside `/frontend`

```
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend

```bash
npm run dev
```

Frontend runs at 👉 **http://localhost:5173**

---

### 4️.(Optional) Run Both Servers Together

If you want to run both backend & frontend with one command, install `concurrently` and update root `package.json` like this:

```bash
npm install concurrently
```

Now you can start both with:

```bash
npm start
```

---

## Backend Overview

### Tech Used

- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Razorpay Integration

http://localhost:5000/api/auth/register
POST
{
"name": "xyz",
"email": "xyz@example.com",
"password": "bob123",
"role": "user"
}
http://localhost:5000/api/auth/login
GET
{
"email": "xyz@example.com",
"password": "bob123"
}
http://localhost:5000/api/vehicles
POST
Headers:
Authorization: Bearer <JWT_TOKEN>

{
"make": "Honda",
"model": "City",
"year": 2022,
"pricePerDay": 1800,
"location": "Chennai",
"type": "Sedan",
"images": [
"http://localhost:5000/images/honda-city-front.jpg",

]
}
CREATE BOOKINGS
http://localhost:5000/api/bookings
POST
Authorization: Bearer <JWT_TOKEN>
{
"vehicle": "672d14e7b54f5d001f21c6a7",
"startDate": "2025-11-02",
"endDate": "2025-11-05",
"totalAmount": 5400
}
🧾 Get My Bookings
GET
http://localhost:5000/api/bookings/my
Headers:
Authorization: Bearer <JWT_TOKEN>

Response:
[
{
"_id": "672d15b7b54f5d001f21c6ac",
"vehicle": {
"make": "Honda",
"model": "City"
},
"status": "booked",
"startDate": "2025-11-02T00:00:00.000Z",
"endDate": "2025-11-05T00:00:00.000Z",
"totalAmount": 5400
}
]
Cancel Booking
PUT http://localhost:5000/api/bookings/:id/cancel

REVIEW ROUTES
Add Review
POST http://localhost:5000/api/bookings/reviews
Headers:
Authorization: Bearer <JWT_TOKEN>
{
"vehicle": "672d14e7b54f5d001f21c6a7",
"rating": 4,
"comment": "Comfortable ride and smooth booking experience!"
}

Get Reviews for a Vehicle

GET http://localhost:5000/api/reviews/:vehicleId
Response:
[
{
"_id": "672d1644b54f5d001f21c6b2",
"rating": 4,
"comment": "Comfortable ride and smooth booking experience!",
"user": {
"name": "John Doe"
},
"createdAt": "2025-10-30T10:05:00.000Z"
}
]

## Frontend Overview

### Tech Used

- React 18
- Tailwind CSS
- Axios
- React Router DOM
- Context API / JWT Auth

## Backend TestTool

Register-POST-http://localhost:5000/api/auth/register -- Postman
Login-POST-http://localhost:5000/api/auth/login -- Postman

User Roles & Access Levels

This application supports two user roles with clearly defined responsibilities.

🔹 User

Can register and log in

Browse available vehicles

Book vehicles for selected dates

Make payments using Razorpay

View Active Rentals (paid and pending bookings)

View Rental History (paid or cancelled bookings)

Edit or cancel their own bookings

Add reviews for vehicles after booking

🔹 Admin

Has full access to the system

Can manage vehicles (add, update, delete)

Can view all user bookings

Can manage users and monitor booking activity

Does not create bookings (booking is user-driven)

⚠️ Note: Only users are allowed to book vehicles. Admin access is limited to management and monitoring purposes.

🚗 Rental Flow & Booking Status Logic

The rental system follows a simple and clear booking lifecycle:

🟢 Active Rentals

A booking appears under Active Rentals when:

The booking is created and payment is pending, or

The booking is paid and has not been cancelled

Users can:

Edit booking dates

Cancel the booking

Complete payment if pending

📜 Rental History

A booking moves to Rental History when:

The booking is cancelled, or

The booking payment is successfully completed

This separation ensures a clean distinction between ongoing and past rentals.

💳 Payment Handling

Payments are handled using Razorpay

Payment details are stored in a separate Payment collection

Each payment is linked to a booking using bookingId

Booking history is determined using:

booking.status === "cancelled" OR

payment.status === "paid"

✅ Role-Based Design Clarification

The system is designed with role-based access control

Booking functionality is intentionally restricted to users

Admin users focus on system administration and data management

This design ensures clarity, security, and real-world usability
