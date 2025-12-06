<template>
  <div class="login-container">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Left side - Branding/Image -->
        <v-col cols="12" md="6" class="login-brand-section">
          <div class="brand-content">
            <img
              src="~/assets/images/login/graduation-logo.jpg"
              alt="University Logo"
              class="full-screen-image"
            />
          </div>
        </v-col>

        <!-- Right side - Login Form -->
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
                <!-- Email Field -->
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

                <!-- Password Field -->
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

                <!-- Remember Me & Forgot Password -->
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
import { ref, reactive, computed, watch, onMounted } from "vue"

// Page meta
useHead({
  title: "Login - University Attendance System",
  meta: [{ name: "description", content: "Admin login for UAS System" }],
})

definePageMeta({
  layout: false,
})

// Get runtime config
const config = useRuntimeConfig()
const apiEndpoint = computed(() => `${config.public.apiBase}/admin/login`)
const isDevelopment = computed(() => process.env.NODE_ENV === 'development')

// Use auth composable
const { login: authLogin } = useAuth()

// Form data
const loginData = reactive({
  email: "",
  password: "",
  rememberMe: true,
  // loginType will be auto-detected from response role
})

const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref("")
const loginForm = ref<any>(null)

// Validation rules
const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Please enter a valid email",
]

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
]

const currentYear = computed(() => new Date().getFullYear())

// Main Login Function
const handleLogin = async () => {
  console.clear()
  
  const { valid } = await loginForm.value?.validate()
  if (!valid) {
    console.warn('⚠️ Form validation failed')
    return
  }

  isLoading.value = true
  loginError.value = ""

  try {
    console.log('🔐 Initiating login process...')
    console.log('📧 Email:', loginData.email)
    console.log('💾 Remember me:', loginData.rememberMe)
    
    await authLogin(loginData)
    console.log('✅ Login and redirect successful!')
  } catch (error: any) {
    console.error('❌ Login error:', error)

    if (error.data?.message) {
      loginError.value = error.data.message
    } else if (error.message) {
      loginError.value = error.message
    } else {
      loginError.value = "Invalid email or password. Please try again."
    }

    console.error('Error displayed to user:', loginError.value)
  } finally {
    isLoading.value = false
  }
}

// Clear error when typing
watch([() => loginData.email, () => loginData.password], () => {
  loginError.value = ""
})

// Log on mount
onMounted(() => {
  console.group('📱 Login Page Mounted')
  console.log('API Base URL:', config.public.apiBase)
  console.log('API Timeout:', config.public.apiTimeout, 'ms')
  console.log('Environment:', isDevelopment.value ? 'Development' : 'Production')
  console.log('⏰ Ready for login at:', new Date().toLocaleTimeString())
  console.groupEnd()
})
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