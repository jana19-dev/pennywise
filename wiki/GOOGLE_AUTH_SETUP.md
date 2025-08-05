# Google OAuth Setup for Pennywise

## Overview
This document explains how to set up Google OAuth authentication for the Pennywise application using the `jose` package for JWT token management.

## Google Cloud Console Setup

1. **Create a Google Cloud Project** (if you don't have one):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/api/auth/callback` (for development)
     - `https://yourdomain.com/api/auth/callback` (for production)

4. **Get Client ID and Secret**:
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file

## Environment Variables

Update your `.env` file with the following variables:

```env
# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_for_security
```

## Authentication Flow

1. **User visits protected route** → Redirected to `/login`
2. **User clicks "Sign in with Google"** → Redirected to Google OAuth
3. **Google OAuth callback** → User data retrieved and JWT created
4. **Session cookie set** → User redirected to dashboard
5. **Protected routes** → JWT verified on each request

## Key Components

### Authentication Utilities (`/src/lib/server/auth.ts`)
- JWT token creation and verification
- Session cookie management
- User session interface

### API Routes
- `/api/auth/login` - Redirects to Google OAuth
- `/api/auth/callback` - Handles OAuth callback
- `/api/auth/logout` - Clears session cookie

### Route Protection (`/src/hooks.server.ts`)
- Validates JWT on each request
- Protects all routes except `/login` and auth routes
- Adds user to `event.locals` for route access

### Pages
- `/login` - Login page with Google sign-in button
- `/` - Protected dashboard showing user info

## Security Features

- **HttpOnly cookies** - Prevents XSS attacks
- **JWT with HMAC signature** - Tamper-proof tokens
- **Secure cookies in production** - HTTPS only
- **7-day token expiration** - Automatic logout
- **Route-level protection** - All routes protected by default

## Testing the Flow

1. Start the development server: `pnpm run dev`
2. Visit `http://localhost:5173`
3. You should be redirected to `/login`
4. Click "Sign in with Google"
5. Complete Google OAuth flow
6. Return to protected dashboard

## Production Deployment

1. Add production redirect URI to Google Cloud Console
2. Set `NODE_ENV=production` for secure cookies
3. Use a strong, random `JWT_SECRET`

## Troubleshooting

- **"OAuth error"** - Check Google Cloud Console setup
- **"JWT verification failed"** - Check `JWT_SECRET` configuration
- **Redirect loop** - Verify redirect URIs match exactly
- **Session not persisting** - Check cookie settings and HTTPS in production
