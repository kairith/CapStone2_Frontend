<template>
  <VNavigationDrawer
    v-model="drawer"
    app
    width="300"
    class="uas-drawer"
  >
    <!-- Brand -->
    <div class="uas-brand">
      <VAvatar size="36" class="uas-logo">
        <VIcon icon="mdi-hexagon-outline" />
      </VAvatar>
      <div class="uas-brand-text">
        <span class="uas-title">UAS</span>
        <span class="uas-version">v.01</span>
      </div>
    </div>

    <VDivider class="mb-2" />

    <!-- Menu -->
    <VList nav density="comfortable" class="pt-0">
      <VListItem
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        link
        nav
        :active="isActive(item)"
        :class="[
          'uas-item',
          item.variant === 'muted' && 'uas-item--muted',
          isActive(item) && 'uas-item--active'
        ]"
        @click="onClickItem"
      >
        <template #prepend>
          <VIcon :icon="item.icon" class="uas-item-icon" />
        </template>

        <VListItemTitle class="uas-item-title">{{ item.title }}</VListItemTitle>

        <template #append>
          <VIcon icon="mdi-chevron-right" class="uas-chevron" />
        </template>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(true)
const route = useRoute()

// match your screenshot order + paths (change 'to' to your real routes)
const items = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard',  variant: 'muted' },
  { title: 'Roles',            icon: 'mdi-account-badge-outline',  to: '/roles' },
  { title: 'Users',            icon: 'mdi-account-outline',        to: '/users' },
  { title: 'Schedules',        icon: 'mdi-calendar-outline',       to: '/schedules' },
  { title: 'Professors',       icon: 'mdi-account-tie-outline',    to: '/professors' },
  { title: 'Subjects',         icon: 'mdi-book-open-variant',      to: '/subjects' },
  { title: 'Classrooms',       icon: 'mdi-grid',                   to: '/classrooms' },
  { title: 'Request leave',    icon: 'mdi-account-arrow-left',     to: '/leave' },
  { title: 'Report',           icon: 'mdi-chart-donut',            to: '/reports' },
]

// active state like in the image (Users highlighted)
const isActive = (item) => route.path.startsWith(item.to)
const onClickItem = () => { /* auto-close on mobile if you want */ }
</script>

<style scoped>
/* Drawer base */
.uas-drawer {
  background: #fff;
}

/* Brand */
.uas-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 12px 20px;
}
.uas-logo {
  border-radius: 12px;
  background: #eef2f8;
  color: #0d2142;
}
.uas-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.uas-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.uas-version {
  font-size: 12px;
  color: #9aa5b1;
}

/* Items */
.uas-item {
  margin: 10px 12px;
  border-radius: 16px;
  padding-left: 10px;
  min-height: 52px;
}
.uas-item-title {
  font-size: 16px;
  font-weight: 500;
}
.uas-item-icon {
  opacity: 0.9;
}

/* Grey pill (first row) */
.uas-item--muted {
  background: #e9edf2; /* soft grey like screenshot */
  color: #2b3a55;
}

/* Active navy pill (e.g., Users) */
.uas-item--active {
  background: #0d2142;     /* dark navy */
  color: #ffffff !important;
}
.uas-item--active :deep(.v-icon) {
  color: #ffffff !important;
}

/* Green chevron on the right */
.uas-chevron {
  color: #7acb2e;          /* soft green */
}

/* Make inactive items’ chevron still green (like screenshot) */
.uas-item :deep(.v-list-item__append .v-icon) {
  color: #7acb2e;
}
</style>
