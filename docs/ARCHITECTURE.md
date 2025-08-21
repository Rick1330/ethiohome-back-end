# Architecture Overview

This document provides a high-level overview of the technical architecture of the Ethio-Home project.

## Monorepo Structure

The project is organized as a monorepo, containing two primary packages:

-   **`ethio-home-backend/`**: A Node.js application built with the Express framework. It serves as the REST API for the platform.
-   **`ethio-home-frontend/`**: A modern single-page application (SPA) built with React and Vite.

This structure allows for shared tooling and easier management of the related frontend and backend projects.

## Backend Architecture

-   **Framework:** [Express.js](https://expressjs.com/)
-   **Language:** JavaScript (Node.js)
-   **Database:** [MongoDB](https://www.mongodb.com/) with the [Mongoose](https://mongoosejs.com/) ODM for data modeling and validation.
-   **Authentication:** JSON Web Tokens (JWT) are used for authentication. Tokens are sent to the client via `httpOnly` cookies for security.
-   **API Design:** The backend exposes a RESTful API with endpoints for all major resources (users, properties, interests, reviews, etc.).
-   **Key Libraries:**
    -   `dotenv`: For managing environment variables.
    -   `bcryptjs`: for hashing passwords.
    -   `jsonwebtoken`: For creating and verifying JWTs.
    -   `multer`: For handling `multipart/form-data`, specifically for image uploads.
    -   `nodemailer`: For sending emails (e.g., email verification, password resets).
    -   `pug`: As the template engine for rendering server-side pages (like the email verification page).
    -   `helmet`, `cors`, `express-rate-limit`: For securing the API.
-   **Testing:** The backend uses [Jest](https://jestjs.io/) for unit testing. The tests are written to mock the database layer, allowing for fast and isolated testing of the business logic in the controllers.

## Frontend Architecture

-   **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/) as the build tool.
-   **Language:** TypeScript and JSX.
-   **State Management:**
    -   [React Context](https://react.dev/learn/passing-data-deeply-with-context) is used for global state, particularly for authentication (`AuthContext`).
    -   [TanStack Query (React Query)](https://tanstack.com/query/latest) is used for server state management, handling data fetching, caching, and synchronization with the backend API.
-   **Routing:** [React Router](https://reactrouter.com/) is used for client-side routing. This includes protected routes for authentication and role-based access control.
-   **Component Library:** The UI is built with [shadcn/ui](https://ui.shadcn.com/), which is a collection of reusable components built on top of Radix UI Primitives and styled with Tailwind CSS.
-   **API Communication:** [Axios](https://axios-http.com/) is used as the HTTP client for making API requests to the backend. A shared API client is configured to include credentials (cookies) with every request.
-   **Mocking:** [Mock Service Worker (MSW)](https://mswjs.io/) is integrated to provide a mock API for development and testing. This allows the frontend to be developed and run without a live backend, which is particularly useful in environments with network restrictions. The mock server can be toggled on or off using the `VITE_USE_MOCKS` environment variable.
-   **Localization:** [i18next](https://www.i18next.com/) and `react-i18next` are used for internationalization (i18n), supporting both English and Amharic.
