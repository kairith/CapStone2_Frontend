<template>
  <div class="profile-page">
    <!-- Main Container -->
    <div class="profile-container">
      <v-row no-gutters class="profile-row">

        <!-- Left Sidebar -->
        <v-col cols="12" md="3" class="pr-md-4 profile-sidebar">
          <v-card class="sidebar-card" elevation="0">

            <!-- User Profile Card -->
            <div class="user-profile-card">
              <v-avatar size="120" color="primary" class="user-main-avatar">
                <span class="avatar-text">{{ userInitials }}</span>
              </v-avatar>
              <div class="user-main-info">
                <div class="user-main-name">{{ user.name }}</div>
                <div class="user-main-email">{{ user.email }}</div>
                <v-chip color="primary" variant="flat" size="small" class="user-role-chip">
                  {{ user.role }}
                </v-chip>
              </div>
            </div>

            <v-divider class="my-4" />

            <!-- Navigation Menu -->
            <v-list nav density="compact" class="sidebar-nav">
              <v-list-item 
                :active="activeSection === 'profile'" 
                class="nav-item"
                @click="activeSection = 'profile'"
              >
                <template #prepend>
                  <v-icon :color="activeSection === 'profile' ? 'primary' : 'grey-darken-1'" size="20">mdi-account-circle</v-icon>
                </template>
                <v-list-item-title>Profile Information</v-list-item-title>
              </v-list-item>

              <v-list-item 
                :active="activeSection === 'password'" 
                class="nav-item"
                @click="activeSection = 'password'"
              >
                <template #prepend>
                  <v-icon :color="activeSection === 'password' ? 'primary' : 'grey-darken-1'" size="20">mdi-lock-outline</v-icon>
                </template>
                <v-list-item-title>Password</v-list-item-title>
              </v-list-item>
            </v-list>

          </v-card>
        </v-col>

        <!-- Main Content Area -->
        <v-col cols="12" md="9">
          <!-- Profile Information Section -->
          <v-card v-if="activeSection === 'profile'" class="profile-info-card" elevation="1">
            <div class="card-header">
              <div class="header-content">
                <h2 class="section-title">Profile Information</h2>
                <p class="section-subtitle">
                  Update your account's profile information and email address.
                </p>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="profile-details">
              <div class="user-info-card">
                <v-avatar size="80" color="primary" class="user-avatar">
                  <span class="avatar-text-main">{{ userInitials }}</span>
                </v-avatar>
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-role">{{ user.role }}</div>
                </div>
              </div>

              <v-row class="profile-fields">
                <v-col cols="12" md="6">
                  <div class="field-group">
                    <label class="field-label">Name</label>
                    <v-text-field :model-value="user.name" variant="outlined" readonly density="comfortable"
                      hide-details class="profile-field" />
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="field-group">
                    <label class="field-label">Email</label>
                    <v-text-field :model-value="user.email" variant="outlined" readonly density="comfortable"
                      hide-details class="profile-field" />
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Password Section -->
          <v-card v-if="activeSection === 'password'" class="profile-info-card" elevation="1">
            <div class="card-header">
              <div class="header-content">
                <h2 class="section-title">Change Password</h2>
                <p class="section-subtitle">
                  Update your password to keep your account secure.
                </p>
              </div>
              <v-btn color="primary" variant="outlined" prepend-icon="mdi-content-save" class="edit-btn">
                Save Changes
              </v-btn>
            </div>

            <v-divider class="my-4" />

            <div class="profile-details">
              <v-form class="password-form">
                <v-row class="profile-fields">
                  <v-col cols="12">
                    <div class="field-group">
                      <label class="field-label">Current Password</label>
                      <v-text-field
                        v-model="passwordForm.currentPassword"
                        variant="outlined"
                        density="comfortable"
                        type="password"
                        placeholder="Enter your current password"
                        class="profile-field"
                        hide-details
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="field-group">
                      <label class="field-label">New Password</label>
                      <v-text-field
                        v-model="passwordForm.newPassword"
                        variant="outlined"
                        density="comfortable"
                        type="password"
                        placeholder="Enter new password"
                        class="profile-field"
                        hide-details
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="field-group">
                      <label class="field-label">Confirm New Password</label>
                      <v-text-field
                        v-model="passwordForm.confirmPassword"
                        variant="outlined"
                        density="comfortable"
                        type="password"
                        placeholder="Confirm new password"
                        class="profile-field"
                        hide-details
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-card>
        </v-col>

      </v-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

// Reactive state
const activeSection = ref('profile')

const user = ref({
  name: 'admin',
  email: 'admin@gmail.com',
  role: 'Admin'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userInitials = computed(() => {
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})
</script>

<style scoped>
/* Global font application */
* {
  font-family: 'Source Sans Pro', sans-serif;
}

.profile-page {
  background: #f5f5f5;
  min-height: 100vh;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: 'Source Sans Pro', sans-serif;
}

.profile-row {
  margin: 0 !important;
  /* FIX: Remove gap that broke layout */
}

/* Sidebar */
.profile-sidebar {
  width: 100% !important;
  /* FIX: Prevent forcing wrap */
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.user-profile-card {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  color: white;
  margin: -24px -24px 24px -24px;
}

.user-main-avatar {
  margin-bottom: 16px;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.avatar-text {
  font-size: 48px;
  font-weight: 700;
  color: white;
}

.user-main-name {
  font-size: 30px;
  font-weight: 600;
  font-family: 'Source Sans Pro', sans-serif;
}

.user-main-email {
  font-size: 16px;
  opacity: 0.9;
  font-family: 'Source Sans Pro', sans-serif;
}

/* Navigation and other text elements */
.sidebar-nav {
  font-family: 'Source Sans Pro', sans-serif;
}

.nav-item {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
}

.user-role-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
}

.field-label {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  display: block;
}

.user-name {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.user-role {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  color: #6b7280;
}

/* Form inputs */
.profile-field :deep(.v-field) {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
}

.edit-btn {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
}

/* Button text */
:deep(.v-btn) {
  font-family: 'Source Sans Pro', sans-serif !important;
  font-size: 16px;
}

/* List item titles */
:deep(.v-list-item-title) {
  font-family: 'Source Sans Pro', sans-serif !important;
  font-size: 16px;
}

/* Main content */
.profile-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.section-title {
  font-size: 30px;
  font-weight: 600;
  font-family: 'Source Sans Pro', sans-serif;
}

.section-subtitle {
  font-size: 16px;
  color: #6b7280;
  font-family: 'Source Sans Pro', sans-serif;
}

.edit-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 32px;
}

.user-avatar {
  border: 2px solid #e5e7eb;
}

.avatar-text-main {
  font-size: 32px;
  font-weight: 600;
  color: white;
}

.field-group {
  margin-bottom: 16px;
}

.password-form {
  width: 100%;
}

/* Responsive fixes */
@media (max-width: 960px) {
  .profile-info-card {
    padding: 24px 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
  }

  .user-info-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
