// stores/auth.ts
import { defineStore } from "pinia";

interface User {
  id?: number | string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

// Mock users for testing (set USE_MOCK_AUTH to true to enable)
const MOCK_USERS = [
  {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    id: 1,
    firstName: "Admin",
    lastName: "User",
  },
  {
    email: "superadmin@example.com",
    password: "super123",
    role: "superadmin",
    id: 2,
    firstName: "Super",
    lastName: "Admin",
  },
  {
    email: "lecturer@example.com",
    password: "lecturer123",
    role: "lecturer",
    id: 3,
    firstName: "John",
    lastName: "Smith",
  },
  {
    email: "student@example.com",
    password: "student123",
    role: "student",
    id: 4,
    firstName: "Jane",
    lastName: "Doe",
  },
];

// Set this to true to use mock authentication (no backend needed)
const USE_MOCK_AUTH = true;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    parseJwt(token: string) {
      try {
        const parts = token.split(".");
        if (parts[1]) {
          return JSON.parse(atob(parts[1]));
        }
        return null;
      } catch {
        return null;
      }
    },

    // Mock login function for testing
    async mockLogin(credentials: { email: string; password: string }) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = MOCK_USERS.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (!mockUser) {
        this.error = "Invalid email or password";
        return { success: false };
      }

      // Generate a fake JWT token
      const tokenPayload = {
        user_id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        first_name: mockUser.firstName,
        last_name: mockUser.lastName,
        exp: Date.now() + 86400000, // 24 hours
      };
      const fakeToken = `mock.${btoa(JSON.stringify(tokenPayload))}.signature`;

      const user = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        name: `${mockUser.firstName} ${mockUser.lastName}`,
      };

      // Persist
      this.token = fakeToken;
      this.user = user;
      this.isAuthenticated = true;

      try {
        localStorage.setItem("auth-token", fakeToken);
        localStorage.setItem("auth-user", JSON.stringify(user));
      } catch (e) {
        // ignore storage errors
      }

      return { success: true, role: user.role };
    },

    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      this.error = null;

      try {
        // Use mock authentication if enabled
        if (USE_MOCK_AUTH) {
          const result = await this.mockLogin(credentials);
          this.loading = false;
          return result;
        }

        // Real API authentication
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase;

        // Try admin first then user
        const endpoints = [
          `${apiBase.replace(/\/$/, "")}/admin/login`,
          `${apiBase.replace(/\/$/, "")}/user/login`,
        ];

        for (const endpoint of endpoints) {
          try {
            const response = await $fetch<any>(endpoint, {
              method: "POST",
              body: credentials,
              // don't throw on non-2xx so we can inspect response (Nuxt $fetch throws by default; keep try/catch)
            });

            // Normalize token extraction (backend may return in different shapes)
            const token =
              response?.data?.token ||
              response?.token ||
              response?.access_token;
            if (!token) {
              // If backend returned 200 but no token, treat as failure and try next endpoint
              this.error =
                response?.message || "Login failed: no token returned";
              continue;
            }

            const payload = this.parseJwt(token) || {};

            const user = {
              id:
                payload.user_id ??
                payload.sub ??
                response?.data?.user?.id ??
                null,
              email: payload.email ?? response?.data?.user?.email ?? null,
              role:
                payload.role ?? response?.data?.role ?? response?.role ?? null,
              firstName:
                payload.first_name ?? response?.data?.user?.first_name ?? null,
              lastName:
                payload.last_name ?? response?.data?.user?.last_name ?? null,
              name: `${
                payload.first_name ?? response?.data?.user?.first_name ?? ""
              } ${
                payload.last_name ?? response?.data?.user?.last_name ?? ""
              }`.trim(),
            };

            // Persist
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;

            try {
              localStorage.setItem("auth-token", token);
              localStorage.setItem("auth-user", JSON.stringify(user));
            } catch (e) {
              // ignore storage errors
            }

            this.loading = false;
            return { success: true, role: user.role };
          } catch (err: any) {
            // If the request failed (401, network, etc.), capture message and try next endpoint
            const status = err?.status || err?.response?.status;
            const backendMsg =
              err?.data?.message ||
              err?.response?.data?.message ||
              err?.message;
            // For 401 on admin, try user; but record last error to surface if both fail
            this.error = backendMsg || `Login failed (${status || "error"})`;
            // continue to next endpoint
          }
        }

        // If we reach here both endpoints failed
        this.loading = false;
        return { success: false };
      } catch (error: any) {
        this.error = error.message || "Login failed";
        this.loading = false;
        return { success: false };
      }
    },

    async checkAuth() {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("auth-user");
      if (!token || !userData) return false;

      this.token = token;
      this.user = JSON.parse(userData);
      this.isAuthenticated = true;
      return true;
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-user");
      navigateTo("/auth/login");
    },

    getAuthHeaders() {
      if (!this.token) return {};
      return { Authorization: `Bearer ${this.token}` };
    },
  },
});
