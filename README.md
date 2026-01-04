# Habit-Flow

**Habit-Flow** is a comprehensive productivity and habit-tracking application designed to help you build better habits, achieve your goals, and stay organized.

## Features

- **Habit Tracking**: Track daily habits with streak monitoring to build consistency.
- **Goal Management**: Set and track Monthly, Yearly, and Seasonal goals with actionable checklists.
- **Todo List**: Manage your daily tasks efficiently.
- **Journaling**: Record your thoughts and reflections with a built-in journal.
- **Gamification**: Earn badges and view user statistics to stay motivated.
- **Authentication**: Secure user accounts and data privacy.

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

Follow these instructions to get a copy of the project running on your local machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB installed locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hailolaa/Habit-Flow.git
   cd Habit-Flow
   ```

2. **Backend Setup**
   
   Navigate to the backend directory:
   ```bash
   cd backend
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**

   Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## License

This project is licensed under the ISC License.
