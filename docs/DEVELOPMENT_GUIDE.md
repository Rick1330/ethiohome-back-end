# Development Guide

This guide provides instructions for setting up and working on the Ethio-Home project.

## 1. Project Overview

The Ethio-Home project is a full-stack real estate platform built with a Node.js backend and a React frontend. For a detailed technical overview, please see the [Architecture Documentation](./ARCHITECTURE.md).

## 2. Environment Setup

### Prerequisites
- Node.js v18+
- npm (or a compatible package manager like pnpm or yarn)

### Installation
1.  **Clone the repository.**
2.  **Install backend dependencies:**
    ```bash
    npm install --prefix ethio-home-backend
    ```
3.  **Install frontend dependencies:**
    ```bash
    npm install --prefix ethio-home-frontend
    ```

### Environment Configuration
The project uses `.env` files for configuration. You will need to set up two separate environment files.

#### Backend Configuration
1.  Navigate to the `ethio-home-backend` directory.
2.  Copy the example environment file:
    ```bash
    cp .env.example config.env
    ```
    *Note: The backend is hardcoded to use `config.env`.*
3.  Fill in the required values in `config.env`, such as your `DATABASE` URI and email service credentials.

#### Frontend Configuration
1.  Navigate to the `ethio-home-frontend` directory.
2.  Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
3.  The default settings in `.env.local` are configured to run the frontend against a mock API.

## 3. Running the Application

### Mock Mode (Frontend Only)
This is the default mode and is ideal for working on the UI without a live backend.

1.  Make sure `VITE_USE_MOCKS=true` in `ethio-home-frontend/.env.local`.
2.  Start the frontend development server:
    ```bash
    npm run dev --prefix ethio-home-frontend
    ```
3.  The application will be available at `http://localhost:5173`.

### Integrated Mode (Frontend + Backend)
This mode connects the frontend to the live backend server.

1.  **Start the backend server:**
    ```bash
    npm run start:stable --prefix ethio-home-backend
    ```
2.  **Configure the frontend for live API:**
    -   In `ethio-home-frontend/.env.local`, set `VITE_USE_MOCKS=false`.
    -   Ensure `VITE_API_URL` points to your running backend (default is `http://localhost:5000/api/v1`).
3.  **Start the frontend server:**
    ```bash
    npm run dev --prefix ethio-home-frontend
    ```

## 4. Code Style & Conventions

-   **Backend (JavaScript):** The project follows the [StandardJS](https://standardjs.com/) style guide.
-   **Frontend (TypeScript):** The project uses Prettier for automatic code formatting. Please run the linter to check your changes:
    ```bash
    npm run lint --prefix ethio-home-frontend
    ```
-   **Commit Messages:** Please follow the conventional commit format (e.g., `feat: add new property form`, `fix: correct login validation`).

## 5. Testing Strategy

### Backend
-   The backend uses **Jest** for unit testing.
-   The tests are located in `ethio-home-backend/__tests__`.
-   The test suite is configured to **mock the database layer**. This means the tests run quickly and do not require a database connection.
-   To run the tests:
    ```bash
    npm test --prefix ethio-home-backend
    ```

### Frontend
-   (Future Work) End-to-end tests for the frontend will be implemented using Playwright or Cypress. This will require the ability to run the application in Integrated Mode.
