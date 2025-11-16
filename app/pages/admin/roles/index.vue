<template>
  <div class="roles-modern-page">
    <!-- Modern Header -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-shield-account" size="32" color="primary" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Role Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Roles</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ roles?.length ?? 0 }}</div>
              <div class="stat-label">Total Roles</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{roles?.filter(r => r.is_active)?.length ?? 0}}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{roles?.filter(r => !r.is_active)?.length ?? 0}}</div>
              <div class="stat-label">Inactive</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{roles?.filter(r => r.level === 'Admin')?.length ?? 0}}</div>
              <div class="stat-label">Admin</div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn import-btn" prepend-icon="mdi-download" variant="outlined" v-bind="props">
                Import
                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
              </v-btn>
            </template>
            <v-list class="modern-menu">
              <v-list-item class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-excel" color="success" />
                </template>
                <v-list-item-title>Import from CSV/Excel</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn export-btn" prepend-icon="mdi-upload" variant="outlined" v-bind="props">
                Export
                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
              </v-btn>
            </template>
            <v-list class="modern-menu">
              <v-list-item class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-excel" color="success" />
                </template>
                <v-list-item-title>Export to Excel</v-list-item-title>
              </v-list-item>
              <v-list-item class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-pdf-box" color="error" />
                </template>
                <v-list-item-title>Export to PDF</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-chip color="info" size="large" variant="tonal" prepend-icon="mdi-eye">
            View Only Mode
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Modern Table Section -->
    <div class="modern-table-section">
      <div class="table-container">
        <!-- Table Header -->
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="table-title">
              <v-icon icon="mdi-table" size="20" class="mr-2" />
              Role Information
            </h2>
            <div class="table-subtitle">Manage and organize user roles</div>
          </div>
          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field v-model="searchQuery" placeholder="Search roles..." prepend-inner-icon="mdi-magnify"
                variant="outlined" density="comfortable" hide-details clearable class="search-input" />
            </div>
          </div>
        </div>

        <v-card elevation="2" class="modern-table-card">
          <v-data-table :headers="headers" :items="filteredRoles" :loading="loading"
            class="modern-data-table elevation-0" item-key="id" show-select v-model="selectedItems">
            <!-- Custom slot for role name with icon -->
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" class="mr-3" :color="getRoleColor(item.level)">
                  <v-icon color="white" size="18">{{ getRoleIcon(item.level) }}</v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-grey">{{ item.description }}</div>
                </div>
              </div>
            </template>

            <!-- Status chip -->
            <template v-slot:item.is_active="{ item }">
              <v-chip :color="item.is_active ? 'success' : 'error'" size="small" variant="flat">
                {{ item.is_active ? 'Active' : 'Inactive' }}
              </v-chip>
            </template>

            <!-- Level chip -->
            <template v-slot:item.level="{ item }">
              <v-chip :color="getRoleColor(item.level)" size="small" variant="outlined">
                {{ item.level }}
              </v-chip>
            </template>

            <!-- Type chip -->
            <template v-slot:item.type="{ item }">
              <v-chip color="info" size="small" variant="tonal">
                {{ item.type }}
              </v-chip>
            </template>

            <!-- Permissions -->
            <template v-slot:item.permissions="{ item }">
              <div class="d-flex flex-wrap gap-1">
                <v-chip v-for="permission in item.permissions.slice(0, 3)" :key="permission" size="x-small"
                  variant="outlined" color="grey">
                  {{ permission.split('.')[0] }}
                </v-chip>
                <v-chip v-if="item.permissions.length > 3" size="x-small" variant="outlined" color="grey">
                  +{{ item.permissions.length - 3 }}
                </v-chip>
              </div>
            </template>

            <!-- User count -->
            <template v-slot:item.user_count="{ item }">
              <div class="d-flex align-center">
                <v-icon size="16" class="mr-1" color="grey">mdi-account</v-icon>
                <span>{{ item.user_count || 0 }}</span>
              </div>
            </template>

            <!-- Actions: Only view button -->
            <template v-slot:item.actions="{ item }">
              <v-btn icon="mdi-eye" variant="text" size="small" @click="viewRole(item)">
              </v-btn>
            </template>

            <!-- Empty state -->
            <template v-slot:no-data>
              <div class="modern-empty-state text-center py-8">
                <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-account-group-outline</v-icon>
                <h3 class="text-h6 text-grey mb-2">No roles found</h3>
                <p class="text-body-2 text-grey">No roles available to display.</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>

      <!-- Role Form Dialog (view only) -->
      <RoleForm v-model="dialog" :role="selectedRole" mode="view" @close="closeDialog" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  //   middleware: ['auth', 'role-admin']
})

const roleStore = useRoleStore()
const { roles, loading, roleStats } = storeToRefs(roleStore)

// Reactive data
const dialog = ref(false)
const selectedRole = ref(null)
const selectedItems = ref([])
const searchQuery = ref('')

// Computed filtered roles
const filteredRoles = computed(() => {
  if (!roles.value) return []

  let filtered = [...roles.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(role =>
      role.name?.toLowerCase().includes(query) ||
      role.level?.toLowerCase().includes(query) ||
      role.type?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const createRole = () => {
  // Role creation functionality disabled - view only mode
  alert('Role management is in view-only mode. Contact system administrator for role modifications.')
}

const viewRole = (role) => {
  selectedRole.value = role
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  selectedRole.value = null
}

const headers = [
  { title: 'Role Name', key: 'name', sortable: true },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Level', key: 'level', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Permissions', key: 'permissions', sortable: false },
  { title: 'Users', key: 'user_count', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
]

const getRoleColor = (level) => {
  const colors = {
    Admin: 'error',
    Staff: 'warning',
    User: 'info',
    Student: 'success'
  }
  return colors[level] || 'grey'
}

const getRoleIcon = (level) => {
  const icons = {
    Admin: 'mdi-shield-crown',
    Staff: 'mdi-account-tie',
    User: 'mdi-account',
    Student: 'mdi-school'
  }
  return icons[level] || 'mdi-account'
}

onMounted(async () => {
  // Use mock data for front-end only development
  const mockRoles = await import('@/mock/roles.json')
  roleStore.roles.value = mockRoles.default
})
</script>

<style scoped>
/* Modern Roles Page Styles - Unified with Schedules Page */
.roles-modern-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modern-header {
  background: white;
  padding: 32px 0;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.title-section {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.title-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}

.title-content h1.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  font-size: 14px;
  color: #64748b;
}

.breadcrumb-item.active {
  color: #1976d2;
  font-weight: 500;
}

.stats-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: center;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modern-btn {
  border-radius: 10px;
  font-weight: 500;
  letter-spacing: 0.25px;
  text-transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-btn {
  background: linear-gradient(135deg, #1976d2, #2196f3) !important;
  color: white !important;
}

.modern-menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.toolbar-left {
  flex: 1;
}

.table-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
}

.table-subtitle {
  font-size: 14px;
  color: #64748b;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-container {
  min-width: 300px;
}

.search-input :deep(.v-field) {
  border-radius: 8px;
}

.modern-table-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.modern-table-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.modern-data-table {
  border-radius: 16px;
  font-size: 1rem;
  background: white;
}

.modern-empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .title-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stats-cards {
    justify-content: center;
  }
}
</style>