<template>
  <div>
    <h1>Welcome to the Application</h1>
    <p>Click below to navigate:</p>
    <v-btn color="primary" @click="$router.push('/admin/users/user-management')">
      Go to User Management
    </v-btn>
    <v-btn color="secondary" class="ml-2" @click="$router.push('/admin/dashboard')">
      Go to Admin Dashboard
    </v-btn>

  
    <v-btn color="secondary" class="ml-2" @click="$router.push('/auth/login')">
      Go to Login
    </v-btn>

    <v-btn color="success" class="ml-2" @click="$router.push('/lecturer/dashboard')">
      Go to Lecturer Dashboard
    </v-btn>

    <v-btn color="success" class="ml-2" @click="$router.push('/lecturer/class')">
      Go to Lecturer Classes
    </v-btn>

    <v-btn color="classes" class="ml-2" @click="$router.push('/admin/classes')">
      create classes by admin
    </v-btn>
  </div>
</template>

<script setup>
// Home page with navigation options
</script>

<style scoped>
div {
  padding: 20px;
}
</style>