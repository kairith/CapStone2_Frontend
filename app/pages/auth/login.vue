<template>
  <div class="login-container">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Left Side Image -->
        <v-col cols="12" md="6" class="login-brand-section">
          <div class="brand-content">
            <img
              src="~/assets/images/login/graduation-logo.jpg"
              alt="University Logo"
              class="full-screen-image"
            />
          </div>
        </v-col>

        <!-- Right Side Form -->
        <v-col cols="12" md="6" class="login-form-section">
          <div class="form-container d-flex flex-column justify-center align-center pa-8">
            <v-card class="login-card pa-8" elevation="0" width="100%" max-width="400">
              <div class="text-center mb-8">
                <h2 class="text-h4 font-weight-bold mb-2">
                  University Attendance System
                </h2>
                <p class="text-body-1 text-medium-emphasis">
                  Sign in to access your account
                </p>
              </div>

              <v-form ref="loginForm" @submit.prevent="handleLogin">
                <!-- Email -->
                <v-text-field
                  v-model="loginData.email"
                  label="Email Address"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="emailRules"
                  required
                />

                <!-- Password -->
                <v-text-field
                  v-model="loginData.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="passwordRules"
                  @click:append-inner="showPassword = !showPassword"
                  required
                />

                <!-- Remember + Forgot -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <v-checkbox
                    v-model="loginData.rememberMe"
                    label="Remember me"
                    density="compact"
                    hide-details
                  />
                  <NuxtLink to="/auth/forgot" class="text-primary text-decoration-none">
                    Forgot password?
                  </NuxtLink>
                </div>

                <!-- Login Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  class="mb-6 text-capitalize"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Signing in...' : 'Sign In' }}
                </v-btn>

                <!-- Error Alert -->
                <v-alert
                  v-if="loginError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="loginError = ''"
                >
                  {{ loginError }}
                </v-alert>

                <!-- Register Link -->
                <div class="text-center">
                  <span class="text-medium-emphasis">Don't have an account?</span>
                  <NuxtLink to="/auth/register" class="text-primary text-decoration-none ml-1">
                    Sign up here
                  </NuxtLink>
                </div>
              </v-form>
            </v-card>

            <!-- Footer -->
            <div class="login-footer text-center mt-8">
              <p class="text-caption text-medium-emphasis">
                © {{ currentYear }} UAS System. All rights reserved.
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { useAuthStore } from "~/stores/auth"

// Disable layout
definePageMeta({ layout: false })

const auth = useAuthStore()

// Form state
const loginData = reactive({
  email: "",
  password: "",
  rememberMe: true,
})
const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref("")
const loginForm = ref<any>(null)

const currentYear = computed(() => new Date().getFullYear())

// Validation
const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Please enter a valid email",
]
const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
]

// Login function
const handleLogin = async () => {
  const { valid } = await loginForm.value?.validate()
  if (!valid) return

  loginError.value = ""
  isLoading.value = true

  try {
    const res = await auth.login({
      email: loginData.email,
      password: loginData.password,
    })

    if (!res.success) {
      loginError.value = auth.error || "Invalid email or password"
      return
    }

    // Redirect based on role
    const redirectMap: Record<string, string> = {
      admin: "/admin/dashboard",
      superadmin: "/admin/dashboard",
      lecturer: "/lecturer/dashboard",
      student: "/student/dashboard",
    }

    return navigateTo(redirectMap[res.role || "student"])
  } catch (err: any) {
    loginError.value = err?.message || "Login failed. Please try again."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #f8fafc;
}

.login-brand-section {
  background: #0f172a;
  height: 100vh;
  overflow: hidden;
}

.brand-content {
  width: 100%;
  height: 100%;
}

.full-screen-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.login-form-section {
  background: #ffffff;
}

.form-container {
  min-height: 100vh;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.login-footer {
  padding-bottom: 2rem;
}

.debug-info {
  font-family: 'Courier New', monospace;
  border-left: 3px solid #1976d2;
}

/* Responsive */
@media (max-width: 960px) {
  .login-brand-section {
    height: 300px;
  }
  .form-container {
    min-height: calc(100vh - 300px);
  }
}
</style>