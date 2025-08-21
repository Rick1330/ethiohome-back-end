# Deployment Guide

This document provides a high-level guide for deploying the Ethio-Home application to a production environment.

**Note:** These are general guidelines. The exact steps may vary depending on your hosting provider and infrastructure.

## 1. Prerequisites

-   A production-ready MongoDB database (e.g., MongoDB Atlas).
-   A server or platform for hosting a Node.js application (e.g., AWS, Heroku, Vercel, DigitalOcean).
-   A platform for hosting a static React application (e.g., Vercel, Netlify, AWS S3/CloudFront).
-   Production credentials for all external services (Email, Chapa).

## 2. Backend Deployment

1.  **Environment Variables:**
    -   Set up all the environment variables from `config.env` on your hosting platform.
    -   Ensure `NODE_ENV` is set to `production`.
    -   Set `DATABASE` to your production MongoDB URI.
    -   Set `CORS_ORIGIN` to the URL of your deployed frontend application.

2.  **Build and Start:**
    -   On your server, pull the latest code from the `main` branch.
    -   Install dependencies: `npm install --production`
    -   Start the server using a process manager like PM2 to ensure it runs continuously:
        ```bash
        npm install pm2 -g
        pm2 start server.js --name "ethio-home-backend"
        ```
    -   Alternatively, use the `npm start` script, which is configured for production.

3.  **Reverse Proxy (Recommended):**
    -   It is highly recommended to run the Node.js server behind a reverse proxy like Nginx or Apache.
    -   The reverse proxy can handle HTTPS termination, load balancing, and serving static files.

## 3. Frontend Deployment

1.  **Environment Variables:**
    -   Set up the environment variables for your build process.
    -   Set `VITE_API_URL` to the public URL of your deployed backend API.
    -   Ensure `VITE_USE_MOCKS` is set to `false`.

2.  **Build the Application:**
    -   Run the build command:
        ```bash
        npm install --prefix ethio-home-frontend
        npm run build --prefix ethio-home-frontend
        ```
    -   This will create a `dist` directory in `ethio-home-frontend` containing the optimized, static production build.

3.  **Deploy Static Files:**
    -   Deploy the contents of the `ethio-home-frontend/dist` directory to your static hosting provider (Vercel, Netlify, S3, etc.).
    -   Ensure your hosting service is configured to handle client-side routing by redirecting all requests to `index.html`.

## 4. Final Checks

-   Verify that the deployed frontend can successfully communicate with the deployed backend.
-   Test all critical user flows in the live environment.
-   Set up monitoring and logging for the backend application to track errors and performance.
