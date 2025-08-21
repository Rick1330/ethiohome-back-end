# Manual QA Checklist

This document provides a checklist for manually testing the application.
**Note:** These steps should be performed by running the frontend application in development mode, which uses a mock API (MSW).

### Environment Setup

1.  [ ] **Backend:** `cd ethio-home-backend` and run `npm install`.
2.  [ ] **Frontend:** `cd ethio-home-frontend` and run `npm install`.
3.  [ ] **Run Frontend:** In the `ethio-home-frontend` directory, run `npm run dev`.
4.  [ ] Open the provided `localhost` URL in your browser.

---

### Authentication Flows

-   [ ] **Signup:**
    -   Navigate to the `/signup` page.
    -   Attempt to sign up with a new email.
    -   **Expected:** A success message is shown. (No email is actually sent in the mock environment).
-   [ ] **Login:**
    -   Navigate to the `/login` page.
    -   Log in with the email `buyer@test.com` and any password.
    -   **Expected:** Successful login and redirection to a user dashboard.
    -   Log out.
    -   Log in with the email `admin@test.com` and any password.
    -   **Expected:** Successful login and redirection to the Admin Panel.
    -   Log out.
    -   Attempt to log in with an unregistered email (e.g., `fail@test.com`).
    -   **Expected:** An "Incorrect email or password" error message is displayed.
-   [ ] **Logout:**
    -   Log in as any user.
    -   Click the "Logout" button.
    -   **Expected:** User is logged out and redirected to the home page.

### Role-Based Access

-   [ ] **Admin Access:**
    -   Log in as `admin@test.com`.
    -   Verify that you can access the `/admin` page.
    -   Verify that the admin sidebar is visible with all admin links (Dashboard, Users, Properties, Analytics).
-   [ ] **Seller Access:**
    -   Log in as `seller@test.com`.
    -   Verify that you are redirected to a seller-specific dashboard.
    -   Verify that you can access the `/properties/create` page.
-   [ ] **Buyer Access:**
    -   Log in as `buyer@test.com`.
    -   Attempt to navigate directly to `/properties/create`.
    -   **Expected:** You are redirected away from the page, as buyers cannot create properties.
    -   Attempt to navigate directly to `/admin`.
    -   **Expected:** You are redirected away from the admin panel.

### Property & Search

-   [ ] **View Properties:**
    -   Navigate to the `/properties` page.
    -   **Expected:** A list of mock properties is displayed.
-   [ ] **Filtering:**
    -   Use the search bar to filter by city (e.g., "Addis Ababa").
    -   **Expected:** The list updates to show only properties in that city.
    -   Open the "Advanced Filters" and filter by property type (e.g., "apartment").
    -   **Expected:** The list updates accordingly.
    -   Clear all filters.
    -   **Expected:** The full list of properties is restored.
-   [ ] **Create Property:**
    -   Log in as `seller@test.com`.
    -   Navigate to `/properties/create`.
    -   Fill out all required fields in the form.
    -   Select at least one image using the file upload control.
    -   Submit the form.
    -   **Expected:** A success toast notification appears, and you are redirected to your dashboard.

### Interest Flow

-   [ ] **Submit Interest:**
    -   Log in as `buyer@test.com`.
    -   Navigate to a property details page.
    -   Click the "Express Interest" button (or navigate to the interest form page).
    -   Fill out and submit the interest form.
    -   **Expected:** A success message is displayed on the page.

### Localization

-   [ ] **Language Switching:**
    -   On any page, locate the language switcher in the header.
    -   Switch the language from English to Amharic.
    -   **Expected:** All text on the page (headers, buttons, form labels, etc.) updates to Amharic.
    -   Switch back to English.
    -   **Expected:** All text reverts to English.
