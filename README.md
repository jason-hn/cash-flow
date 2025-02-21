# CashFlow - Track, Budget, Thrive

A modern personal finance tracker that helps users manage transactions, track budgets, and visualize spending patterns through interactive charts.

## Features

### Transaction Management
- Real-time balance calculations and transaction tracking
- Categorize income and expenses
- View transactions by day, month, or custom date ranges
- Edit or delete transaction records
- CSV export for financial reporting

### Analytics & Reporting
- Interactive expense analysis charts
- Monthly trends visualization
- Spending by category breakdown
- Custom date range filtering

### Budget Management
- Set and track budget goals
- Progress tracking and notifications
- Flexible budget categories
- Monthly reset and rollover options

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- React Query for data fetching
- React Router for navigation

### Backend
- JWT for authentication
- Node.js & Express
- MongoDB for data storage
- RESTful API architecture

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/jason-hn/cashflow.git
   cd cashflow
   ```

2. Install dependencies
   ```bash
   # Install frontend dependencies
   cd client && npm install

   # Install backend dependencies
   cd ../server && npm install
   ```

3. Set up environment variables:
   ```bash
   # In /server/.env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000

   # In /client/.env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development servers
   ```bash
   # Start backend (from /server)
   npm run dev

   # Start frontend (from /client)
   npm run dev
   ```

5. Visit `http://localhost:5173` in your browser

## Project Structure

```
cashflow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API integration
│   │   ├── store/         # State management
│   │   └── utils/         # Helper functions
│   └── public/            # Static assets
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   └── middleware/    # Custom middleware
    └── config/            # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [MongoDB](https://www.mongodb.com/) 
