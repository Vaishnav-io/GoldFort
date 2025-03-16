# Gold Fort - Jewelry E-Commerce Platform

Gold Fort is a modern, full-stack e-commerce platform for jewelry shopping, featuring a sleek UI with smooth animations, comprehensive product management, and secure checkout.

![Gold Fort Banner](https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1200&h=400&fit=crop)

## 🌟 Features

- **Animated UI** with Framer Motion for engaging user experience
- **Responsive Design** that works on mobile, tablet, and desktop
- **User Authentication** with email verification
- **Product Filtering** by category, price, etc.
- **Shopping Cart** with guest and user persistence
- **Wishlist** functionality
- **Checkout Process** with PayPal integration
- **Order Management** for users and admins
- **Product Reviews and Ratings**

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Hook Form** - Form handling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **PayPal SDK** - Payment processing

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaishnav-io/Gold Fort.git
   cd Gold Fort
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Create environment variables**
   ```bash
   # In server directory, create a .env file
   cp .env.example .env
   # Edit the .env file with your MongoDB URI, JWT secret, and SMTP settings
   ```

4. **Run the development servers**
   ```bash
   # Start the backend (from the server directory)
   npm run dev

   # Start the frontend (from the client directory)
   npm run dev
   ```

## 🌐 Usage

Once both servers are running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## ✨ Application Structure

```
Gold Fort/
├── client/                  # Frontend application
│   ├── public/              # Static files
│   └── src/                 # React source files
│       ├── assets/          # Images, fonts, etc.
│       ├── components/      # Reusable components
│       ├── features/        # Redux slices
│       ├── pages/           # Page components
│       ├── App.jsx          # Main component
│       └── ...
├── server/                  # Backend application
│   ├── config/              # Configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── server.js            # Entry point
└── README.md                # This file
```

## 🔐 Authentication

The application uses JWT for authentication and includes:
- User registration with email verification
- Login/logout functionality
- Password reset with OTP
- Role-based access control

## 🛒 Shopping Experience

- Browse products with filtering and search
- View detailed product information and reviews
- Add items to cart or wishlist
- Checkout with shipping information
- Payment processing with PayPal

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Unsplash](https://unsplash.com/) for the product images

---

Made with ❤️ by [Vaishnav]