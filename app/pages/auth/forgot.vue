<template>
  <div class="forgot-container">
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="forgot-card pa-8" elevation="8">
            <div class="text-center mb-8">
              <div class="forgot-icon mb-4">
                <v-icon size="64" color="primary">mdi-lock-reset</v-icon>
              </div>
              <h2 class="text-h4 font-weight-bold mb-2">Forgot Password?</h2>
              <p class="text-body-1 text-medium-emphasis">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <!-- Success State -->
            <div v-if="emailSent" class="text-center">
              <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
              <h3 class="text-h5 mb-4">Check your email</h3>
              <p class="text-body-1 text-medium-emphasis mb-6">
                We've sent a password reset link to <strong>{{ submittedEmail }}</strong>
              </p>
              <v-btn
                color="primary"
                variant="outlined"
                block
                class="mb-4"
                @click="resetForm"
              >
                Send another email
              </v-btn>
            </div>

            <!-- Email Form -->
            <v-form v-else ref="forgotForm" @submit.prevent="handleForgotPassword">
              <v-text-field
                v-model="email"
                label="Email Address"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                class="mb-6"
                :rules="emailRules"
                :error-messages="errors.email"
                required
                autofocus
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="mb-6"
                :loading="isLoading"
                :disabled="!isFormValid"
              >
                Send Reset Link
              </v-btn>

              <!-- Error Alert -->
              <v-alert
                v-if="forgotError"
                type="error"
                variant="tonal"
                class="mb-6"
                :text="forgotError"
              />
            </v-form>

            <!-- Back to Login -->
            <div class="text-center">
              <NuxtLink to="/auth/login" class="text-primary text-decoration-none d-flex align-center justify-center">
                <v-icon size="16" class="mr-1">mdi-arrow-left</v-icon>
                Back to login
              </NuxtLink>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// Meta tags
useHead({
  title: 'Forgot Password - UAS System',
  meta: [
    { name: 'description', content: 'Reset your UAS System password' }
  ]
})

// Define layout
definePageMeta({
  layout: false
})

// Reactive data
const email = ref('')
const isLoading = ref(false)
const forgotError = ref('')
const emailSent = ref(false)
const submittedEmail = ref('')

const errors = reactive({
  email: []
})

// Refs
const forgotForm = ref(null)

// Computed
const isFormValid = computed(() => {
  return email.value && 
         emailRules.every(rule => rule(email.value) === true)
})

// Validation rules
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

// Methods
const handleForgotPassword = async () => {
  const { valid } = await forgotForm.value.validate()
  
  if (!valid) {
    return
  }

  isLoading.value = true
  forgotError.value = ''
  
  try {
    const { forgotPassword } = useAuth()
    
    await forgotPassword(email.value)
    
    // Show success state
    submittedEmail.value = email.value
    emailSent.value = true
    
  } catch (error) {
    console.error('Forgot password error:', error)
    forgotError.value = error.message || 'Failed to send reset email. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  emailSent.value = false
  submittedEmail.value = ''
  email.value = ''
  forgotError.value = ''
}

// Clear errors when user types
watch(() => email.value, () => {
  errors.email = []
  forgotError.value = ''
})
</script>

<style scoped>
.forgot-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  padding: 2rem 0;
}

.forgot-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  margin: 0 auto;
}

.forgot-icon {
  display: inline-block;
  padding: 1rem;
  background: rgba(24, 103, 192, 0.1);
  border-radius: 50%;
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

/* Responsive adjustments */
@media (max-width: 600px) {
  .forgot-container {
    padding: 1rem 0;
  }
  
  .forgot-card {
    margin: 0 1rem;
  }
}
</style>