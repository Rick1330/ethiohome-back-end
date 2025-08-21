# Ethio-Home Full-Stack Real Estate Platform

This repository contains the source code for the Ethio-Home project, including both the frontend and backend applications. The project is structured as a monorepo.

-   `ethio-home-frontend/`: The React/Vite-based frontend application.
-   `ethio-home-backend/`: The Node.js/Express-based backend API.

## Development Modes

This project can be run in two modes:

1.  **Mocked Mode (Default for Sandbox/CI):** The frontend runs against a mock API server powered by Mock Service Worker (MSW). This is useful for UI development without a live backend.
2.  **Integrated Mode:** The frontend connects to the live backend server, which in turn connects to a real MongoDB database and other services.

---

## Getting Started (Integrated Mode)

This is the standard setup for local development with a full backend.

### 1. Prerequisites

-   Node.js (v18 or higher)
-   npm
-   Access to a MongoDB instance (e.g., a local instance or a free MongoDB Atlas cluster).

### 2. Configure Environment

Create a `config.env` file inside the `ethio-home-backend` directory by copying the example file:

```bash
cp ethio-home-backend/.env.example ethio-home-backend/config.env
```

Create a `.env.local` file inside the `ethio-home-frontend` directory:
```bash
cp ethio-home-frontend/.env.example ethio-home-frontend/.env.local
```

**Fill in the necessary credentials** in both files:
-   In `ethio-home-backend/config.env`, provide your `DATABASE` URI and other secrets (Mailtrap, Chapa, etc.).
-   In `ethio-home-frontend/.env.local`, set `VITE_USE_MOCKS=false` to connect to the live backend.

### 3. Install Dependencies

Install dependencies for both projects from the root directory:

```bash
npm install --prefix ethio-home-backend
npm install --prefix ethio-home-frontend
```

### 4. Run the Application

You will need two separate terminals to run both the backend and frontend servers.

**Terminal 1: Start the Backend**

```bash
cd ethio-home-backend
npm run start:dev
```
The backend server will start on `http://localhost:5000`.

**Terminal 2: Start the Frontend**

```bash
cd ethio-home-frontend
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

---

## Running in Mocked Mode (Frontend Only)

If you only want to work on the frontend UI without a live backend, you can use the built-in mock server.

1.  Follow steps 2 and 3 above to set up the frontend.
2.  Ensure that `VITE_USE_MOCKS` is set to `true` in `ethio-home-frontend/.env.local`.
3.  Start the frontend server:
    ```bash
    cd ethio-home-frontend
    npm run dev
    ```
    The frontend will now use the mock API handlers defined in `src/mocks/handlers.js`.

---

## Running Backend Tests

The backend includes a suite of unit tests that run against a mocked data layer. They do not require a database connection.

To run the tests:

```bash
npm test --prefix ethio-home-backend
```
