<template>
  <!-- Floating toggle on mobile (like ChatGPT hamburger) -->

  <VBtn v-if="isMobile && !drawer" class="uas-fab" :style="fabStyle" icon size="large" :aria-label="'Open navigation'"
    @click="openDrawer()">
    <VIcon icon="mdi-menu" />
  </VBtn>
  <VNavigationDrawer v-model="drawer" app :permanent="!isMobile" :temporary="isMobile" :width="300" :rail="isRail"
    :rail-width="72" :location="side" class="uas-drawer"
    :class="side === 'right' ? 'uas-drawer--right' : 'uas-drawer--left'">
    <!-- Brand -->
    <div class="flex">
      <div class="uas-brand" role="button" tabindex="0" :aria-pressed="(!isMobile && collapsed) ? 'true' : 'false'"
        :aria-label="(!isMobile && collapsed) ? 'Expand sidebar' : 'Collapse sidebar'" @click="toggleDrawer"
        @keydown.enter="toggleDrawer" @keydown.space.prevent="toggleDrawer">
        <VAvatar size="36" class="uas-logo">
          <VIcon icon="mdi-hexagon-outline" />
        </VAvatar>

        <!-- Brand title only when expanded -->
        <div class="uas-brand-text" v-if="!isRail">
          <span class="uas-title">UAMS</span>
          <span class="uas-version">v.1</span>
        </div>
      </div>

    </div>





    <!-- Main menu -->
    <VList nav density="comfortable" class="pt-0" v-model:opened="opened">

      <!-- Dashboard -->
      <VListItem :to="'/dashboard'" nav :active="isActivePath('/dashboard')"
        :class="['uas-item', isActivePath('/dashboard') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Dashboard" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-view-dashboard-outline" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-view-dashboard-outline" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Dashboard</VListItemTitle>
      </VListItem>

      <!-- Roles -->
      <VListItem :to="'/role'" nav :active="isActivePath('/role')"
        :class="['uas-item', isActivePath('/role') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Roles" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-account-badge-outline" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-account-badge-outline" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Roles</VListItemTitle>
      </VListItem>

      <!-- Users (collapsible group) -->
      <!-- Users (collapsible group) -->
      <VListGroup value="users">
        <template #activator="{ props }">
          <VListItem v-bind="props" :active="isSectionActive('/user')"
            :class="['uas-item', isSectionActive('/user') && 'uas-item--active']">
            <template #prepend>
              <VTooltip v-if="isRail" text="Users" location="right">
                <template #activator="{ props: tip }">
                  <VIcon v-bind="tip" icon="mdi-account-outline" class="uas-item-icon" />
                </template>
              </VTooltip>
              <VIcon v-else icon="mdi-account-outline" class="uas-item-icon" />
            </template>

            <VListItemTitle v-if="!isRail" class="uas-item-title">Users</VListItemTitle>

            <!-- Chevron that rotates based on "opened" -->
            <template #append>
              <VIcon v-if="!isRail" icon="mdi-chevron-right" :class="isUsersOpen ? 'uas-chevron--open' : 'uas-chevron'"
                aria-hidden="true" />
            </template>
          </VListItem>
        </template>

        <!-- Sub items -->
        <VListItem v-for="r in userRoles" :key="r.to" :to="r.to" nav :active="isActivePath(r.to)"
          :class="['uas-item', isActivePath(r.to) && 'uas-item--active']" @click="onClickItem">
          <template #prepend>
            <VTooltip v-if="isRail" :text="r.title" location="right">
              <template #activator="{ props: tip }">
                <VIcon v-bind="tip" :icon="r.icon" class="uas-item-icon" />
              </template>
            </VTooltip>
            <VIcon v-else :icon="r.icon" class="uas-item-icon" />
          </template>

          <VListItemTitle v-if="!isRail" class="uas-item-title">
            {{ r.title }}
          </VListItemTitle>
        </VListItem>
      </VListGroup>


      <!-- Schedules -->
      <VListItem :to="'/schedule'" nav :active="isActivePath('/schedule')"
        :class="['uas-item', isActivePath('/schedule') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Schedules" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-calendar-outline" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-calendar-outline" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Schedules</VListItemTitle>
      </VListItem>

      <!-- Professors -->
      <VListItem :to="'/professor'" nav :active="isActivePath('/professor')"
        :class="['uas-item', isActivePath('/professor') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Professors" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-account-tie-outline" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-account-tie-outline" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Professors</VListItemTitle>
      </VListItem>

      <!-- Subjects -->
      <VListItem :to="'/subject'" nav :active="isActivePath('/subject')"
        :class="['uas-item', isActivePath('/subject') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Subjects" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-book-open-variant" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-book-open-variant" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Subjects</VListItemTitle>
      </VListItem>

      <!-- Classrooms -->
      <VListItem :to="'/classroom'" nav :active="isActivePath('/classroom')"
        :class="['uas-item', isActivePath('/classroom') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Classrooms" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-grid" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-grid" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Classrooms</VListItemTitle>
      </VListItem>

      <!-- Groups -->
      <VListItem :to="'/admin/groups'" nav :active="isActivePath('/admin/groups')"
        :class="['uas-item', isActivePath('/admin/groups') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Groups" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-account-group" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-account-group" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Groups</VListItemTitle>
      </VListItem>

      <!-- Request leave -->
      <VListItem :to="'/leave'" nav :active="isActivePath('/leave')"
        :class="['uas-item', isActivePath('/leave') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Request leave" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-account-arrow-left" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-account-arrow-left" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Request leave</VListItemTitle>
      </VListItem>

      <!-- Report -->
      <VListItem :to="'/report'" nav :active="isActivePath('/report')"
        :class="['uas-item', isActivePath('/report') && 'uas-item--active']" @click="onClickItem">
        <template #prepend>
          <VTooltip v-if="isRail" text="Report" location="right">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-chart-donut" class="uas-item-icon" />
            </template>
          </VTooltip>
          <VIcon v-else icon="mdi-chart-donut" class="uas-item-icon" />
        </template>
        <VListItemTitle v-if="!isRail" class="uas-item-title">Report</VListItemTitle>
      </VListItem>
    </VList>

    <template #append>
      <VDivider />
      <div class="uas-footer">
        <!-- Settings -->
        <VTooltip v-if="isRail" text="Settings" location="right">
          <template #activator="{ props }">
            <VBtn v-bind="props" icon variant="text" class="uas-footer-btn" :aria-label="'Open settings'">
              <VIcon icon="mdi-cog-outline" />
            </VBtn>
          </template>
        </VTooltip>
        <VBtn v-else icon variant="text" class="uas-footer-btn" :title="'Settings'" :aria-label="'Open settings'">
          <VIcon icon="mdi-cog-outline" />
        </VBtn>

        <!-- Collapse / Expand control (like ChatGPT chevron) -->
        <VTooltip v-if="isRail" :text="'Expand'" location="right">
          <template #activator="{ props }">
            <VBtn v-bind="props" icon variant="text" class="uas-footer-btn" :aria-label="'Expand sidebar'"
              @click="expandDrawer()">
              <VIcon :icon="side === 'left' ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'" />
            </VBtn>
          </template>
        </VTooltip>
        <VBtn v-else icon variant="text" class="uas-footer-btn" :title="'Collapse'" :aria-label="'Collapse sidebar'"
          @click="collapseDrawer()">
          <VIcon :icon="side === 'left' ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'" />
        </VBtn>
      </div>
    </template>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppHeaderMini from '~/components/ui/AppHeader.vue'

const route = useRoute()
const { mdAndDown } = useDisplay()

/* ---------- Actions ---------- */

const onClickItem = () => {
  if (isMobile.value) drawer.value = false
}


/* ---------- State ---------- */
const drawer = ref(true)                 // open/close
const collapsed = ref(false)             // desktop collapsed -> rail
const side = ref<'left' | 'right'>('left')
const openGroups = ref<{ users: boolean }>({ users: false })

/* ---------- Responsive ---------- */
const isMobile = computed(() => mdAndDown.value)
const isRail = computed(() => !isMobile.value && collapsed.value)

/* Normalize state when breakpoint changes */
watch(isMobile, (m) => {
  if (m) {
    drawer.value = false        // start closed on mobile
    collapsed.value = false     // no rail on mobile
  } else {
    drawer.value = true         // visible on desktop
  }
}, { immediate: true })

/* FAB position follows drawer side */
const fabStyle = computed(() =>
  side.value === 'left'
    ? { left: '16px', right: 'auto' }
    : { right: '16px', left: 'auto' }
)

/* ---------- Persistence ---------- */
const STORAGE_KEY = 'uas:sidebar'

onMounted(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { drawer: d, collapsed: c, side: s, openGroups: og } = JSON.parse(saved)
        if (typeof d === 'boolean') drawer.value = d
        if (typeof c === 'boolean') collapsed.value = c
        if (s === 'left' || s === 'right') side.value = s
        if (og && typeof og.users === 'boolean') openGroups.value.users = og.users
      } catch { }
    }
  }
  // Auto-open Users when already under /user/*
  if (route.path.startsWith('/user') && !opened.value.includes('users')) {
    opened.value.push('users')
  }
})

let persistTimer: number | undefined
watch([drawer, collapsed, side, openGroups], () => {
  if (typeof window === 'undefined') return
  clearTimeout(persistTimer)
  persistTimer = window.setTimeout(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        drawer: drawer.value,
        collapsed: collapsed.value,
        side: side.value,
        openGroups: openGroups.value,
      })
    )
  }, 100)
}, { deep: true })

/* ---------- Actions ---------- */
const openDrawer = () => { drawer.value = true; if (!isMobile.value) collapsed.value = false }
const collapseDrawer = () => { if (!isMobile.value) collapsed.value = true }
const expandDrawer = () => { if (!isMobile.value) collapsed.value = false; drawer.value = true }
const toggleDrawer = () => {
  if (isMobile.value) {
    drawer.value = !drawer.value
  } else {
    collapsed.value = !collapsed.value
    drawer.value = true
  }
}

const opened = ref<(string | number)[]>([])
// convenience for the chevron
const isUsersOpen = computed(() => opened.value.includes('users'))
/* Close drawer on route change (mobile) */
watch(() => route.fullPath, () => { if (isMobile.value) drawer.value = false })
/* Active helpers */
const isActivePath = (base: string) =>
  route.path === base || route.path.startsWith(base + '/')
const isSectionActive = (base: string) =>
  route.path === base || route.path.startsWith(base + '/')
/* ---------- Menu: Users sub-roles ---------- */
const userRoles = [
  { title: 'Super Admin', icon: 'mdi-shield-crown-outline', to: '/admin/superadmin' },
  { title: 'Admin', icon: 'mdi-shield-account-outline', to: '/admin/admin' },
  { title: 'Student', icon: 'mdi-school-outline', to: '/admin/student' },
  { title: 'Lecturer', icon: 'mdi-account-tie-outline', to: '/admin/lecturer' },
]
</script>

<style scoped>
/* Drawer baseline (theme-aware) */
.uas-drawer {
  background: rgb(var(--v-theme-surface));
}

/* Brand */
.uas-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  cursor: pointer;
}

.uas-logo {
  border-radius: 12px;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 10%, transparent);
  color: rgb(var(--v-theme-primary));
}

.uas-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.uas-title {
  font-size: 20px;
  font-weight: 700;
}

.uas-version {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant, 130, 130, 130));
}

/* Items */
.uas-item {
  margin: 10px 6px;
  border-radius: 5px;
  padding-left: 10px;
  min-height: 52px;
  transition: background .2s, color .2s;
  color: rgb(var(--v-theme-on-surface));
}

.uas-item :deep(.v-icon) {
  color: currentColor;
}

.uas-item-title {
  font-size: 16px;
  font-weight: 500;
}

.uas-item--active {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.uas-item:hover {
  background: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 12%, transparent);
  color: rgb(var(--v-theme-on-surface));
}

/* Footer strip like ChatGPT */
.uas-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
}

.uas-footer-btn {
  margin: 4px;
}

/* Chevron rotation for groups */
.uas-chevron,
.uas-chevron,
.uas-chevron--open {
  transition: transform .2s ease;
}

.uas-chevron--open {
  transform: rotate(90deg);
}



/* Floating action button on mobile */
.uas-fab {
  position: fixed;
  z-index: 9999;
  bottom: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, .25);
}

/* Right-side tweaks */
.uas-drawer--right .uas-item {
  padding-left: 16px;
  padding-right: 10px;
}

/* Hide scrollbar inside the navigation drawer */
/* Hide the drawer's scrollbar but keep scrolling */
:deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE/Edge */
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 0;
  height: 0;
  /* Chrome/Safari */
}

/* Prevent inner list from creating its own scrollbar during group expand */
:deep(.v-navigation-drawer__content .v-list) {
  overflow: visible;
  /* let the group expand without a nested scroller */
}
</style>
