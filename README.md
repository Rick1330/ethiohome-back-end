# EthioHome Monorepo

This repository contains the source code for the EthioHome real estate platform, structured as a monorepo. It includes both the frontend and backend applications.

## Project Structure

- `ethio-home-frontend/`: The React-based frontend application.
- `ethio-home-backend/`: The Node.js/Express-based backend API.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- MongoDB instance (for backend data storage)

### Backend Setup

1.  Navigate to the backend directory:
    `cd ethio-home-backend`
2.  Install dependencies:
    `npm install` or `pnpm install`
3.  Create a `.env` file based on `.env.example` and configure your environment variables (e.g., MongoDB URI, JWT secret).
4.  Start the backend server:
    `npm start` or `pnpm start`

### Frontend Setup

1.  Navigate to the frontend directory:
    `cd ethio-home-frontend`
2.  Install dependencies:
    `npm install` or `pnpm install`
3.  Create a `.env` file based on `.env.example` and configure your environment variables (e.g., backend API URL).
4.  Start the frontend development server:
    `npm run dev` or `pnpm dev`

## Features

This platform includes the following key features:

- **User Authentication & Authorization:** Secure login, registration, and role-based access control.
- **Property Management:** CRUD operations for properties, including listing, editing, and deleting.
- **Interest & Review Management:** Functionality for users to express interest in properties and leave reviews.
- **Payment Integration:** Integration with Chapa payment gateway.
- **Notifications & Messaging:** In-app notification system and direct messaging between users.
- **Role-Based Dashboards:** Dedicated dashboards for Sellers, Agents, and Employees.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

[Specify your license here, e.g., MIT License]
