<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'role-lecturer']
})

// Redirect to dashboard
navigateTo('/lecturer/dashboard')
</script>
