# API Documentation

This document provides a summary of the main API endpoints available in the Ethio-Home backend.

**Base URL:** `/api/v1`

---

## Authentication (`/users`)

-   `POST /signup`: Register a new user.
-   `POST /login`: Log in a user and receive a JWT.
-   `GET /logout`: Log out a user and clear the JWT cookie.
-   `POST /forgotPassword`: Initiate the password reset process.
-   `PATCH /resetPassword/:token`: Reset the password with a valid token.
-   `PATCH /updateMyPassword`: Update the password for the currently logged-in user.
-   `GET /me`: Get the profile of the currently logged-in user.
-   `PATCH /updateMe`: Update the profile of the currently logged-in user.

---

## Properties (`/properties`)

-   `GET /`: Get a list of all properties. Supports filtering and sorting via query parameters.
    -   **Query Params:** `city`, `propertyType`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `isVerified`, `sort`, etc.
-   `POST /`: Create a new property (requires auth, seller/agent/admin role). Expects `multipart/form-data`.
-   `GET /:id`: Get details for a single property.
-   `PATCH /:id`: Update a property (requires auth, owner/admin role). Expects `multipart/form-data`.
-   `DELETE /:id`: Delete a property (requires auth, owner/admin role).
-   `PUT /:id`: Verify a property (requires auth, admin/employee role).
-   `GET /property-stats`: Get aggregate statistics about properties (requires auth, admin/employee role).

---

## Interests (`/properties/:propertyId/interest`)

-   `POST /buyer`: Submit an interest form for a specific property (requires auth).
-   `GET /`: Get all interest forms for a specific property (requires auth, owner/admin role).

---

## Reviews (`/properties/:propertyId/reviews`)

-   `POST /`: Create a new review for a property (requires auth).
-   `GET /`: Get all reviews for a property.

---

## Users (Admin) (`/users`)

-   `GET /`: Get a list of all users (admin only).
-   `POST /`: Create a new user (admin only).
-   `GET /:id`: Get details for a single user (admin only).
-   `PATCH /:id`: Update a user (admin only).
-   `DELETE /:id`: Delete a user (admin only).

---

## Payments (`/selling`)

-   `POST /process-payment`: Initiate a payment process with Chapa (requires auth).
-   `GET /verify-payment/:txRef`: Verify a payment after the user returns from the payment gateway.
