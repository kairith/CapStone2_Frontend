<template>
  <div class="login-container">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Left side - Branding/Image -->
        <v-col cols="12" md="6" class="login-brand-section">
          <div class="brand-content d-flex flex-column justify-center align-center pa-8">
            <div class="brand-logo mb-6">
              <v-icon size="80" color="white">mdi-school</v-icon>
            </div>
            <h1 class="brand-title text-h3 font-weight-bold text-white text-center mb-4">
              UAS System
            </h1>
            <p class="brand-subtitle text-h6 text-white text-center opacity-90">
              University Attendance System
            </p>
            <p class="brand-description text-body-1 text-white text-center mt-4 opacity-75 max-width-400">
              Streamline attendance management for students, lecturers, and administrators with our comprehensive digital solution.
            </p>
          </div>
        </v-col>

        <!-- Right side - Login Form -->
        <v-col cols="12" md="6" class="login-form-section">
          <div class="form-container d-flex flex-column justify-center align-center pa-8">
            <v-card class="login-card pa-8" elevation="0" width="100%" max-width="400">
              <div class="text-center mb-8">
                <h2 class="text-h4 font-weight-bold mb-2">Welcome Back</h2>
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
                  :error-messages="errors.email"
                  required
                />

                <!-- Password Field -->
                <v-text-field
                  v-model="loginData.password"
                  :label="'Password'"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="passwordRules"
                  :error-messages="errors.password"
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
                  class="mb-6"
                  :loading="isLoading"
                  :disabled="!isFormValid"
                >
                  Sign In
                </v-btn>

                <!-- Error Alert -->
                <v-alert
                  v-if="loginError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  :text="loginError"
                />

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

<script setup>
import { ref, computed, reactive } from 'vue'

// Meta tags for SEO
useHead({
  title: 'Login - UAS System',
  meta: [
    { name: 'description', content: 'Login to access your UAS System account' }
  ]
})

// Define layout
definePageMeta({
  layout: false, // No layout for auth pages
  middleware: ['auth'] // Add auth middleware if needed
})

// Reactive data
const loginData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref('')
const errors = reactive({
  email: [],
  password: []
})

// Refs
const loginForm = ref(null)

// Computed
const currentYear = computed(() => new Date().getFullYear())

const isFormValid = computed(() => {
  return loginData.email && 
         loginData.password && 
         emailRules.every(rule => rule(loginData.email) === true) &&
         passwordRules.every(rule => rule(loginData.password) === true)
})

// Validation rules
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 6) || 'Password must be at least 6 characters'
]

// Methods
const handleLogin = async () => {
  // Validate form
  const { valid } = await loginForm.value.validate()
  
  if (!valid) {
    return
  }

  isLoading.value = true
  loginError.value = ''
  
  try {
    // TODO: Replace with your actual authentication logic
    // const authStore = useAuthStore()
    // await authStore.login(loginData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect based on user role
    // For now, redirect to dashboard
    await navigateTo('/admin/dashboard')
    
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Clear errors when user types
watch(() => loginData.email, () => {
  errors.email = []
  loginError.value = ''
})

watch(() => loginData.password, () => {
  errors.password = []
  loginError.value = ''
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-brand-section {
  background: linear-gradient(135deg, rgba(24, 103, 192, 0.9) 0%, rgba(92, 187, 246, 0.9) 100%),
              url('/images/university-bg.jpg') center/cover;
  background-blend-mode: overlay;
}

.login-form-section {
  background: #ffffff;
}

.brand-content {
  max-width: 500px;
  margin: 0 auto;
}

.brand-title {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.max-width-400 {
  max-width: 400px;
}

.form-container {
  min-height: 100vh;
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-footer {
  margin-top: auto;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .login-brand-section {
    min-height: 300px;
  }
  
  .form-container {
    min-height: auto;
  }
  
  .brand-content {
    padding: 2rem !important;
  }
}

/* Custom input styling */
:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 2px;
}

:deep(.v-field--variant-outlined.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
}

/* Button hover effects */
.v-btn {
  text-transform: none !important;
  font-weight: 600;
}

/* Link styling */
a {
  transition: all 0.2s ease-in-out;
}

a:hover {
  text-decoration: underline !important;
}
</style>