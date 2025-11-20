<!-- components/ui/AppHeader.vue -->
<template>
  <VAppBar app flat height="64">
    <div class="d-flex align-center">
      <span v-if="version" class="ml-2 text-medium-emphasis"> {{ version }} </span>
    </div>

    <VSpacer />

    <VBtn
      v-if="!isMobile"
      variant="text"
      icon
      :title="collapsed ? 'Expand' : 'Collapse'"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="$emit(collapsed ? 'expand' : 'collapse')"
    >
      <VIcon :icon="collapsed ? 'mdi-panel-left-expand' : 'mdi-panel-left-contract'" />
    </VBtn>
  </VAppBar>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  version?: string
  isMobile?: boolean
  collapsed?: boolean
}>()
defineEmits(['expand','collapse'])
</script>


<style scoped>
/* ✨ Customize the header container */
.header-custom {
  width: 100%;           /* full width or fixed like 300px */
  height: 74px;          /* customize height here */
  min-height: 64px;
  max-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

/* ✨ Optional: customize the logo size */
.header-logo {
  width: 48px;           /* adjust logo size */
  height: 48px;
}

/* Adjust text spacing if needed */
.uas-brand-text {
  line-height: 1.1;
}
</style>
