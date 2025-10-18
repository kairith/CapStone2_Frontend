<template>
  <div class="register-container">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Left side - Registration Form -->
        <v-col cols="12" md="6" class="register-form-section">
          <div class="form-container d-flex flex-column justify-center align-center pa-8">
            <v-card class="register-card pa-8" elevation="0" width="100%" max-width="500">
              <div class="text-center mb-8">
                <h2 class="text-h4 font-weight-bold mb-2">Create Account</h2>
                <p class="text-body-1 text-medium-emphasis">
                  Join the UAS System today
                </p>
              </div>

              <v-form ref="registerForm" @submit.prevent="handleRegister">
                <!-- Name Fields -->
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="registerData.firstName"
                      label="First Name"
                      prepend-inner-icon="mdi-account"
                      variant="outlined"
                      density="comfortable"
                      :rules="nameRules"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="registerData.lastName"
                      label="Last Name"
                      variant="outlined"
                      density="comfortable"
                      :rules="nameRules"
                      required
                    />
                  </v-col>
                </v-row>

                <!-- Email Field -->
                <v-text-field
                  v-model="registerData.email"
                  label="Email Address"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="emailRules"
                  required
                />

                <!-- Student ID Field -->
                <v-text-field
                  v-model="registerData.studentId"
                  label="Student ID"
                  prepend-inner-icon="mdi-card-account-details"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="studentIdRules"
                  required
                />

                <!-- Role Selection -->
                <v-select
                  v-model="registerData.role"
                  label="Role"
                  :items="roleOptions"
                  prepend-inner-icon="mdi-account-group"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="roleRules"
                  required
                />

                <!-- Password Fields -->
                <v-text-field
                  v-model="registerData.password"
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

                <v-text-field
                  v-model="registerData.confirmPassword"
                  label="Confirm Password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="confirmPasswordRules"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  required
                />

                <!-- Terms Agreement -->
                <v-checkbox
                  v-model="registerData.agreeToTerms"
                  density="compact"
                  class="mb-4"
                  :rules="termsRules"
                >
                  <template #label>
                    <span class="text-body-2">
                      I agree to the 
                      <a href="#" class="text-primary text-decoration-none">Terms of Service</a>
                      and 
                      <a href="#" class="text-primary text-decoration-none">Privacy Policy</a>
                    </span>
                  </template>
                </v-checkbox>

                <!-- Register Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  class="mb-6"
                  :loading="isLoading"
                  :disabled="!isFormValid"
                >
                  Create Account
                </v-btn>

                <!-- Error Alert -->
                <v-alert
                  v-if="registerError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  :text="registerError"
                />

                <!-- Login Link -->
                <div class="text-center">
                  <span class="text-medium-emphasis">Already have an account?</span>
                  <NuxtLink to="/auth/login" class="text-primary text-decoration-none ml-1">
                    Sign in here
                  </NuxtLink>
                </div>
              </v-form>
            </v-card>
          </div>
        </v-col>

        <!-- Right side - Branding -->
        <v-col cols="12" md="6" class="register-brand-section">
          <div class="brand-content d-flex flex-column justify-center align-center pa-8">
            <div class="brand-logo mb-6">
              <v-icon size="80" color="white">mdi-account-plus</v-icon>
            </div>
            <h1 class="brand-title text-h3 font-weight-bold text-white text-center mb-4">
              Join UAS System
            </h1>
            <p class="brand-subtitle text-h6 text-white text-center opacity-90 mb-6">
              Start Your Journey
            </p>
            <div class="features-list">
              <div class="feature-item d-flex align-center mb-4">
                <v-icon color="white" class="mr-3">mdi-check-circle</v-icon>
                <span class="text-white">Track your attendance</span>
              </div>
              <div class="feature-item d-flex align-center mb-4">
                <v-icon color="white" class="mr-3">mdi-check-circle</v-icon>
                <span class="text-white">Access course materials</span>
              </div>
              <div class="feature-item d-flex align-center mb-4">
                <v-icon color="white" class="mr-3">mdi-check-circle</v-icon>
                <span class="text-white">Submit leave requests</span>
              </div>
              <div class="feature-item d-flex align-center">
                <v-icon color="white" class="mr-3">mdi-check-circle</v-icon>
                <span class="text-white">Real-time notifications</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// Meta tags
useHead({
  title: 'Register - UAS System',
  meta: [
    { name: 'description', content: 'Create your UAS System account' }
  ]
})

// Define layout
definePageMeta({
  layout: false
})

// Reactive data
const registerData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  studentId: '',
  role: 'student',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const registerError = ref('')

// Refs
const registerForm = ref(null)

// Role options
const roleOptions = [
  { title: 'Student', value: 'student' },
  { title: 'Lecturer', value: 'lecturer' }
]

// Computed
const isFormValid = computed(() => {
  return registerData.firstName && 
         registerData.lastName && 
         registerData.email && 
         registerData.studentId &&
         registerData.role &&
         registerData.password && 
         registerData.confirmPassword &&
         registerData.agreeToTerms &&
         registerData.password === registerData.confirmPassword
})

// Validation rules
const nameRules = [
  (v) => !!v || 'Name is required',
  (v) => (v && v.length >= 2) || 'Name must be at least 2 characters'
]

const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const studentIdRules = [
  (v) => !!v || 'Student ID is required',
  (v) => (v && v.length >= 6) || 'Student ID must be at least 6 characters'
]

const roleRules = [
  (v) => !!v || 'Role is required'
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
  (v) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v) || 'Password must contain uppercase, lowercase and number'
]

const confirmPasswordRules = [
  (v) => !!v || 'Confirm password is required',
  (v) => v === registerData.password || 'Passwords do not match'
]

const termsRules = [
  (v) => v === true || 'You must agree to the terms and conditions'
]

// Methods
const handleRegister = async () => {
  const { valid } = await registerForm.value.validate()
  
  if (!valid) {
    return
  }

  isLoading.value = true
  registerError.value = ''
  
  try {
    // TODO: Replace with your actual registration logic
    const { register } = useAuth()
    
    const userData = {
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      studentId: registerData.studentId,
      role: registerData.role,
      password: registerData.password
    }
    
    await register(userData)
    
    // Show success message and redirect
    await navigateTo('/auth/login?registered=true')
    
  } catch (error) {
    console.error('Registration error:', error)
    registerError.value = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Clear errors when user types
watch(() => registerData.email, () => {
  registerError.value = ''
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-form-section {
  background: #ffffff;
}

.register-brand-section {
  background: linear-gradient(135deg, rgba(92, 187, 246, 0.9) 0%, rgba(24, 103, 192, 0.9) 100%),
              url('/images/university-bg.jpg') center/cover;
  background-blend-mode: overlay;
}

.form-container {
  min-height: 100vh;
}

.register-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.features-list {
  max-width: 300px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .register-brand-section {
    min-height: 300px;
  }
  
  .form-container {
    min-height: auto;
  }
  
  .brand-content {
    padding: 2rem !important;
  }
}
</style>