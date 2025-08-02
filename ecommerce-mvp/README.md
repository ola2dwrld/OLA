# ECommerce MVP - Modern Online Store

A full-stack eCommerce platform built with Next.js, Node.js, MongoDB, and modern web technologies. Features secure authentication, payment processing, and a responsive design optimized for the Nigerian market.

## 🚀 Features

### ✅ MVP Features (Completed)
- **User Authentication**: Email/phone login and registration with JWT
- **Product Catalog**: Browse products with categories, search, and filtering
- **Shopping Cart**: Add/remove items with persistent storage
- **Secure Checkout**: Integrated payment processing with Paystack/Flutterwave
- **Order Management**: Order history and tracking for users
- **Admin Dashboard**: Product and order management for administrators
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Fast Performance**: Optimized with Next.js and modern React patterns

### 🔄 Planned Features (Phase 2)
- Product reviews and ratings
- Advanced order tracking
- Email notifications
- Analytics dashboard
- Multi-vendor support
- Inventory management

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Payment & Services
- **Paystack** - Payment processing for Nigeria
- **Flutterwave** - Alternative payment gateway

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-mvp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and update with your values:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
MONGODB_URI=mongodb://localhost:27017/ecommerce-mvp
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development

# Payment Gateway Keys
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### 4. Database Setup
Make sure MongoDB is running locally or update the `MONGODB_URI` to point to your MongoDB instance.

### 5. Start Development Servers

#### Option 1: Start both servers together
```bash
npm run dev:full
```

#### Option 2: Start servers separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
ecommerce-mvp/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & validation
│   └── server.js           # Express server
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── products/       # Product pages
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   ├── orders/         # Order management
│   │   └── admin/          # Admin dashboard
│   ├── components/         # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── products/       # Product components
│   │   ├── cart/           # Cart components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── lib/                # Utilities and configuration
│   │   ├── features/       # Redux slices
│   │   ├── hooks.ts        # Custom hooks
│   │   └── store.ts        # Redux store
│   └── utils/              # Helper functions
├── public/                 # Static assets
│   └── uploads/            # User uploaded files
├── .env.local             # Environment variables
├── .env.example           # Environment template
└── README.md              # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (Admin)

### Users
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)

## 🛒 User Flow

1. **Browse Products**: Users can view products by category, search, and filter
2. **User Registration**: Create account with email and phone
3. **Add to Cart**: Add products to shopping cart (persisted in localStorage)
4. **Checkout**: Enter delivery address and choose payment method
5. **Payment**: Secure payment processing with Paystack/Flutterwave
6. **Order Confirmation**: Receive order confirmation and tracking info
7. **Order History**: View past orders and their status

## 👨‍💼 Admin Features

- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: View and update order statuses
- **User Management**: View registered users and manage roles
- **Dashboard**: Overview of sales and orders

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Zod schema validation on frontend and backend
- **CORS Protection**: Configured for secure cross-origin requests
- **File Upload Security**: Validated file types and size limits

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway/Heroku)
1. Create new web service
2. Connect your repository
3. Set environment variables
4. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Configure network access and database users

## 📱 Mobile Optimization

- Responsive design works on all device sizes
- Mobile-first approach with Tailwind CSS
- Touch-friendly interface elements
- Optimized images and fast loading

## 🔧 Development Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run server       # Start backend server only
npm run dev:full     # Start both frontend and backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@ecommerce.com
- Phone: +234 800 123 4567

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Paystack for Nigerian payment processing
- All contributors and testers

---

**Built with ❤️ for the Nigerian eCommerce market**
