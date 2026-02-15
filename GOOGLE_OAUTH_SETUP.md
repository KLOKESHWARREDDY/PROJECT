# Google OAuth 2.0 Setup Guide

## Step 1: Install Required Packages

### Backend (in server folder):
```bash
cd server
npm install google-auth-library
```

### Frontend (in my-app folder):
```bash
cd my-app
npm install @react-oauth/google
```

---

## Step 2: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** > **OAuth consent screen**
4. Configure:
   - User Type: **External**
   - App Name: Your app name
   - Support email: Your Gmail
   - Developer contact: Your email
5. Click **Save and Continue**
6. Skip scopes, click **Save and Continue**
7. Add your email as test user, click **Save and Continue**
8. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
9. Application type: **Web application**
10. Add authorized JavaScript origins:
    - `http://localhost:3000`
11. Add authorized redirect URIs:
    - `http://localhost:3000`
12. Click **Create**
13. Copy the **Client ID**

---

## Step 3: Environment Variables

### Backend (.env file in server folder):
```
# Google OAuth Client ID (from Step 2)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Your existing variables (keep these)
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env file in my-app folder):
```
# Google OAuth Client ID (same as backend)
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## Step 4: How It Works

### Backend Flow:
1. User clicks "Login with Google" button
2. Google shows popup for user to sign in
3. Google returns a credential token
4. Frontend sends token to backend `/api/auth/google`
5. Backend verifies token using `google-auth-library`
6. Backend checks if user exists in MongoDB
7. If new user: creates account with default role "student"
8. Backend returns JWT token
9. User is logged in

### Frontend Changes:
- Added GoogleLogin button from `@react-oauth/google`
- Button appears above the regular login form
- Shows "OR" divider between Google and email login

---

## Step 5: Run the App

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd my-app
npm start
```

---

## Troubleshooting

### Error: "Invalid Google token"
- Check that GOOGLE_CLIENT_ID is correct in both .env files
- Make sure the origin matches in Google Cloud Console

### Error: "Google login failed"
- Check browser console for detailed error
- Verify your Google Cloud Console OAuth is properly configured

### User role issue
- Google sign-in creates users as "student" by default
- To allow teachers, they need to be manually updated in database or use regular signup first
