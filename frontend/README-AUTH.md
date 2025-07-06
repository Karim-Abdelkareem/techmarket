# Authentication Features

## Overview
This document describes the authentication system implemented in the TechMarket frontend application.

## Features

### 1. User Registration (Signup)
- **Route**: `/signup`
- **Component**: `SignupPage.jsx`
- **Features**:
  - Full name, email, and password fields
  - Password confirmation
  - Form validation (email format, password length, password match)
  - Automatic role assignment as "user"
  - Success/error messaging
  - Loading states
  - Automatic redirect to login after successful registration

### 2. User Login
- **Route**: `/login`
- **Component**: `LoginPage.jsx`
- **Features**:
  - Email and password authentication
  - Remember me checkbox
  - Forgot password link (placeholder)
  - Social login options (Google, Facebook - placeholder)
  - Loading states
  - Error handling
  - Automatic redirect to home page after successful login

### 3. Navigation Updates
- **Component**: `Navbar.jsx`
- **Features**:
  - Shows "Sign In" and "Sign Up" buttons when user is not authenticated
  - Shows user avatar (first letter of name) and logout button when authenticated
  - Responsive design (hides text on mobile, shows icons)

## API Integration

### Signup API
```javascript
// POST /api/auth/register
{
  name: string,
  email: string,
  password: string,
  role: "user" // Automatically set
}
```

### Login API
```javascript
// POST /api/auth/login
{
  email: string,
  password: string
}
```

## Styling
Both authentication pages use a consistent dark theme that matches the app's design:
- Dark background (`bg-dark`)
- Gray form containers with borders
- Blue accent colors for buttons and links
- Proper focus states and hover effects
- Responsive design for mobile and desktop

## Security Features
- Password hashing (handled by backend)
- JWT token storage in localStorage
- Form validation on both client and server side
- Automatic token inclusion in API requests (via axios interceptors)

## User Experience
- Clear error messages
- Loading indicators during API calls
- Smooth transitions and animations
- Intuitive navigation between login and signup
- Consistent branding and design language

## File Structure
```
frontend/src/
├── pages/
│   ├── LoginPage.jsx      # Login form
│   └── SignupPage.jsx     # Registration form
├── services/
│   └── api.js            # API functions (login, signup, logout)
├── components/
│   └── Navbar.jsx        # Updated navigation
└── App.jsx               # Updated routing
```

## Usage
1. Users can access signup at `/signup`
2. Users can access login at `/login`
3. After successful authentication, users are redirected to the home page
4. The navbar automatically updates to show user information and logout option
5. Protected routes redirect to login if user is not authenticated 