<!-- components/ui/AppHeader.vue -->
<template>
  <VAppBar app flat height="64" class="header-custom">
    <div class="header-left">
      <VBtn icon variant="text" class="menu-btn" @click="$emit('toggle-drawer')">
        <VIcon icon="mdi-menu" />
      </VBtn>
      <!-- <span class="brand-title">Admin Panel</span> -->
    </div>
    <div class="header-spacer" style="flex:1"></div>
    <div class="header-right">
      <VBtn icon variant="text" class="notif-btn header-icon">
        <VIcon icon="mdi-bell-outline" />
      </VBtn>
      <VBtn icon variant="text" class="lang-btn header-icon">
        <VIcon icon="mdi-earth" class="earth-btn"/>
        <VIcon icon="mdi-chevron-down" size="16" />
      </VBtn>
      <VMenu>
        <template #activator="{ props }">
          <VBtn v-bind="props" class="user-btn header-icon">
            <VAvatar color="primary" size="32" class="avatar-circle">
              <span class="text-white">A</span>
            </VAvatar>
            <span class="username">ADM</span>
            <VIcon icon="mdi-chevron-down" size="16" />
          </VBtn>
        </template>
        <VList>
          <VListItem title="Profile" />
          <VListItem title="Logout" />
        </VList>
      </VMenu>
    </div>
  </VAppBar>
</template>


<script setup lang="ts">
defineEmits(['toggle-drawer'])
</script>


<style scoped>
/* Modern admin-style header */
.header-custom {
  width: 100%;
  height: 64px;
  min-height: 64px;
  max-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 10;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.02em;
  margin-left: 8px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.menu-btn {
  margin-right: 8px;
}
.header-icon {
  transition: background 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  padding: 4px;
}
.header-icon:hover {
  background: #f5f7fa !important;
  box-shadow: 0 2px 8px rgba(59,130,246,0.08);
}
.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 8px 0 0;
}
.avatar-circle {
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(59,130,246,0.12);
}
.username {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  margin-left: 2px;
  letter-spacing: 0.01em;
}
.lang-btn {
  display: flex;
  align-items: center;
  gap: 2px;
}
.notif-btn {
  color: #64748b;
}
.earth-btn {
  color: #64748b;
}
</style>

