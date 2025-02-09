# CashFlow - Personal Finance Tracker

A modern, intuitive personal finance management application built with React and Node.js.

## Features

- Track income and expenses with categorization
- View transactions by day, month, or all time
- Real-time balance calculations
- Edit or delete transaction records
- Flexible date selection for transaction entries
- Clean, responsive interface

## Tech Stack

- Frontend: React, TailwindCSS, date-fns
- Backend: Node.js, Express, MongoDB
- Development: Vite, ESLint

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables:
   - Create `.env` in server directory with MongoDB connection string
   - Create `.env` in client directory with API URL

4. Start the development servers:
   ```bash
   # In server directory
   npm run dev

   # In client directory
   npm run dev
   ```

## License

MIT 