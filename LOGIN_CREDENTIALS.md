# Test Login Credentials

This document contains mock login credentials for testing the application without a backend.

## How to Use

The application is currently configured to use **mock authentication** for testing purposes. You can toggle this in `app/stores/auth.ts` by changing the `USE_MOCK_AUTH` constant.

## Available Test Accounts

### Admin Account

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** Admin
- **Dashboard:** `/admin/dashboard`

### Super Admin Account

- **Email:** `superadmin@example.com`
- **Password:** `super123`
- **Role:** Super Admin
- **Dashboard:** `/admin/dashboard`

### Lecturer Account

- **Email:** `lecturer@example.com`
- **Password:** `lecturer123`
- **Role:** Lecturer
- **Name:** John Smith
- **Dashboard:** `/lecturer/dashboard`

### Student Account

- **Email:** `student@example.com`
- **Password:** `student123`
- **Role:** Student
- **Name:** Jane Doe
- **Dashboard:** `/student/dashboard`

## Switching to Real Backend

To use real backend authentication:

1. Open `app/stores/auth.ts`
2. Find the line: `const USE_MOCK_AUTH = true`
3. Change it to: `const USE_MOCK_AUTH = false`
4. Make sure your backend API is running at the configured URL (check `.env` file)

## Security Note

⚠️ **Important:** These are test credentials only. Never use these in production! Always change `USE_MOCK_AUTH` to `false` and use real authentication before deploying to production.
