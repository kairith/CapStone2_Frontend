<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="text-h5 pa-6 bg-primary text-white">
        <v-icon class="mr-2">mdi-eye</v-icon>
        Role Details
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <strong>Role Name:</strong>
            <div class="mb-2">{{ role?.name }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <strong>Level:</strong>
            <div class="mb-2">{{ role?.level }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <strong>Type:</strong>
            <div class="mb-2">{{ role?.type }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <strong>Status:</strong>
            <v-chip :color="role?.is_active ? 'success' : 'error'" size="small" class="ml-1">
              {{ role?.is_active ? 'Active' : 'Inactive' }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <strong>Description:</strong>
            <div class="mb-2">{{ role?.description }}</div>
          </v-col>
          <v-col cols="12">
            <strong>Permissions:</strong>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <v-chip
                v-for="permission in role?.permissions || []"
                :key="permission"
                size="small"
                color="primary"
                variant="outlined"
              >
                {{ permission }}
              </v-chip>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <strong>User Count:</strong>
            <div class="mb-2">{{ role?.user_count || 0 }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <strong>Created At:</strong>
            <div class="mb-2">{{ role?.created_at }}</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  role: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'close'])
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

:deep(.v-checkbox .v-label) {
  font-size: 0.875rem;
}

:deep(.v-card-title) {
  border-radius: 8px 8px 0 0;
}
</style>