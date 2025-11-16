<template>
    <div class="groups-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-account-group" size="32" color="primary" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Group Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Groups</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ groups.length }}</div>
                            <div class="stat-label">Total Groups</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{groups.filter(g => g.active).length}}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{groups.filter(g => !g.active).length}}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn import-btn" prepend-icon="mdi-download" variant="outlined"
                                v-bind="props">
                                Import
                                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item @click="handleImportCSV" class="menu-item">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-file-excel" color="success" />
                                </template>
                                <v-list-item-title>Import from CSV/Excel</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-upload" variant="outlined"
                                v-bind="props">
                                Export
                                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item @click="handleExportExcel" class="menu-item">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-file-excel" color="success" />
                                </template>
                                <v-list-item-title>Export to Excel</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="handleExportPDF" class="menu-item">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-file-pdf-box" color="error" />
                                </template>
                                <v-list-item-title>Export to PDF</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
                        Add Group
                    </v-btn>
                </div>
            </div>

        </div>

        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <!-- Table Header with Search and Filters -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-table" size="20" class="mr-2" />
                            Group Information
                        </h2>
                        <div class="table-subtitle">Manage and organize your groups</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search groups..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
                                class="search-input" clearable />
                        </div>

                        <v-select v-model="tableSortOrder" :items="tableSortOptions" label="Sort by" variant="outlined"
                            density="compact" hide-details class="sort-select" />

                        <v-btn icon="mdi-filter-variant" variant="outlined" class="filter-btn"
                            @click="showFilters = !showFilters" />
                    </div>
                </div>

                <!-- Quick Filters (collapsible) -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-panel">
                        <div class="filters-content">
                            <div class="filter-group">
                                <label class="filter-label">Status</label>
                                <v-chip-group v-model="statusFilter" selected-class="text-primary">
                                    <v-chip value="All" variant="outlined">All</v-chip>
                                    <v-chip value="1" variant="outlined" color="success">Active</v-chip>
                                    <v-chip value="0" variant="outlined" color="error">Inactive</v-chip>
                                </v-chip-group>
                            </div>
                        </div>
                    </div>
                </v-expand-transition>

                <!-- Modern Data Table -->
                <div class="modern-table-wrapper">
                    <v-table class="modern-table" fixed-header height="500">
                        <thead>
                            <tr class="modern-header-row">
                                <th class="modern-header-cell id-column center-align">
                                    <div class="header-content">ID</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Name</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Global ID</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Created</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(group, idx) in filteredGroups" :key="group.id" class="modern-table-row">
                                <td class="modern-table-cell id-column center-align">
                                    <span class="id-badge">{{ group.id }}</span>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="group-info">
                                        <span class="group-avatar">
                                            <v-icon size="22" color="#1d4ed8">mdi-account-group</v-icon>
                                        </span>
                                        <div class="group-details">
                                            <div class="group-name">{{ group.group_name }}</div>
                                            <div class="group-meta">{{ group.global_id }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <span class="global-id-badge">{{ group.global_id }}</span>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="group.active ? 'success' : 'error'" class="status-chip" size="small">
                                        {{ group.active ? 'Active' : 'Inactive' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="date-info">
                                        <div class="date-primary">{{ formatDate(group.created_at) }}</div>
                                        <div class="date-secondary">{{ formatTime(group.created_at) }}</div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="openEditDialog(group)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(group)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredGroups.length === 0" class="empty-state">
                        <v-icon icon="mdi-account-group-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No groups found</h3>
                        <p class="empty-subtitle">
                            {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first group to get started' }}
                        </p>
                        <v-btn v-if="!searchQuery" color="primary" variant="flat" @click="openCreateDialog"
                            class="mt-4">
                            <v-icon icon="mdi-plus" class="mr-1" />
                            Add First Group
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="550" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="isEdit ? 'mdi-pencil-circle' : 'mdi-plus-circle'"
                                :color="isEdit ? '#fde047' : 'primary'" size="28" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Group' : 'Create New Group' }}</h2>
                            <p class="dialog-subtitle">
                                {{ isEdit ? 'Modify group information' : 'Add a new group to the system' }}
                            </p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
                        <div class="form-group">
                            <label class="form-label">Global ID</label>
                            <v-text-field v-model="formData.global_id" placeholder="Enter global ID (e.g., G001)"
                                variant="outlined" density="comfortable" prepend-inner-icon="mdi-identifier"
                                hide-details="auto" :rules="globalIdRules" class="form-field" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Group Name</label>
                            <v-text-field v-model="formData.group_name" placeholder="Enter group name"
                                variant="outlined" density="comfortable" prepend-inner-icon="mdi-account-group"
                                hide-details="auto" :rules="groupNameRules" class="form-field" />
                        </div>

                        <div class="form-group">
                            <div class="switch-container">
                                <div class="switch-info">
                                    <label class="form-label">Status</label>
                                    <p class="switch-description">
                                        {{ formData.active ? 'Group is active and available' : 'Group is inactive and hidden' }}
                                    </p>
                                </div>
                                <v-switch v-model="formData.active" color="success" inset hide-details />
                            </div>
                        </div>
                    </v-form>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="closeDialog" class="action-btn cancel-btn">
                        <v-icon start>mdi-close</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="submitForm"
                        :disabled="!formValid" :loading="formLoading" class="action-btn submit-btn">
                        <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
                        {{ isEdit ? 'Update Group' : 'Create Group' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="420" persistent>
            <v-card class="delete-dialog" elevation="24">
                <!-- Delete Header -->
                <div class="delete-header">
                    <div class="delete-icon-container">
                        <v-icon icon="mdi-delete-alert" color="error" size="48" />
                    </div>
                    <h2 class="delete-title">Delete Group</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                You are about to permanently delete
                                <strong class="group-name">{{ selectedGroup?.group_name }}</strong>
                            </p>
                            <p class="warning-details">
                                All associated data will be removed and cannot be recovered.
                            </p>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Delete Actions -->
                <v-card-actions class="delete-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false"
                        class="action-btn cancel-btn">
                        <v-icon start>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading"
                        class="action-btn delete-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete Group
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    // middleware: ['auth', 'role-admin'] // Commented out for testing
})

import Navbar from '@/components/ui/Navbar.vue'
// Import mock data for testing
import mockGroups from '@/mock/groups.json'

// Import composables
const { exportToExcel, exportToPDF } = useExport()
const { importFromCSV, validateGroupData } = useImport()

// Reactive data
const groups = ref([...mockGroups])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('All')
const generationFilter = ref('All')
const yearFilter = ref('All')
const sortOrder = ref('A-Z')
const tableSortOrder = ref('A-Z')
const dialogOpen = ref(false)
const deleteDialog = ref(false)
const selectedGroup = ref(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const showFilters = ref(false)

// Form data
const formData = reactive({
    global_id: '',
    group_name: '',
    active: true
})

// Validation rules
const globalIdRules = [
    v => !!v || 'Global ID is required',
    v => (v && v.length >= 2) || 'Global ID must be at least 2 characters',
    v => /^[A-Z0-9]+$/.test(v) || 'Global ID must contain only uppercase letters and numbers'
]

const groupNameRules = [
    v => !!v || 'Group name is required',
    v => (v && v.length >= 2) || 'Group name must be at least 2 characters',
    v => (v && v.length <= 50) || 'Group name must be less than 50 characters'
]

// Filter options
const generationOptions = [
    'All', '1st', '2nd', '3rd', '4th', '5th'
]

const yearOptions = [
    'All', '2020', '2021', '2022', '2023', '2024', '2025'
]

const statusOptions = [
    { title: 'All', value: 'All' },
    { title: 'Active', value: 1 },
    { title: 'Inactive', value: 0 }
]

const sortOptions = [
    'A-Z', 'Z-A', 'Newest', 'Oldest'
]

const tableSortOptions = [
    'A-Z', 'Z-A'
]

// Computed filtered groups
const filteredGroups = computed(() => {
    let filtered = [...groups.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(group =>
            group.group_name?.toLowerCase().includes(query) ||
            group.global_id?.toLowerCase().includes(query)
        )
    }

    // Status filter
    if (statusFilter.value !== 'All' && statusFilter.value !== null) {
        filtered = filtered.filter(group => group.active === statusFilter.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortOrder.value) {
            case 'A-Z':
                return a.group_name?.localeCompare(b.group_name) || 0
            case 'Z-A':
                return b.group_name?.localeCompare(a.group_name) || 0
            case 'Newest':
                return new Date(b.created_at) - new Date(a.created_at)
            case 'Oldest':
                return new Date(a.created_at) - new Date(b.created_at)
            default:
                return 0
        }
    })

    return filtered
})

// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        })
    } catch (error) {
        return 'Invalid Date'
    }
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        return ''
    }
}

// Dialog methods
const openCreateDialog = () => {
    selectedGroup.value = null
    isEdit.value = false
    // Reset form data
    formData.global_id = ''
    formData.group_name = ''
    formData.active = true
    dialogOpen.value = true
}

const openEditDialog = (group) => {
    selectedGroup.value = group
    isEdit.value = true
    // Populate form data
    formData.global_id = group.global_id
    formData.group_name = group.group_name
    formData.active = group.active === 1
    dialogOpen.value = true
}

const closeDialog = () => {
    dialogOpen.value = false
    selectedGroup.value = null
    isEdit.value = false
    // Reset form
    formData.global_id = ''
    formData.group_name = ''
    formData.active = true
}

// Form submission
const submitForm = async () => {
    if (!formValid.value) return

    formLoading.value = true

    try {
        const groupData = {
            global_id: formData.global_id,
            group_name: formData.group_name,
            active: formData.active ? 1 : 0
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (isEdit.value && selectedGroup.value) {
            // Update existing group
            const index = groups.value.findIndex(g => g.id === selectedGroup.value.id)
            if (index !== -1) {
                groups.value[index] = {
                    ...groups.value[index],
                    ...groupData,
                    updated_at: new Date().toISOString()
                }
            }
        } else {
            // Create new group
            const newGroup = {
                id: Math.max(...groups.value.map(g => g.id)) + 1,
                ...groupData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            groups.value.push(newGroup)
        }

        closeDialog()
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        formLoading.value = false
    }
}

// CRUD operations
const handleFormSubmit = (groupData) => {
    // This function is no longer needed as we handle it in submitForm
    closeDialog()
}

const confirmDelete = (group) => {
    selectedGroup.value = group
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedGroup.value) return

    deleteLoading.value = true

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const index = groups.value.findIndex(g => g.id === selectedGroup.value.id)
        if (index !== -1) {
            groups.value.splice(index, 1)
        }

        deleteDialog.value = false
        selectedGroup.value = null
    } catch (error) {
        console.error('Error deleting group:', error)
    } finally {
        deleteLoading.value = false
    }
}

// Import/Export functions
const handleImportCSV = async () => {
    try {
        const importedData = await importFromCSV()
        const validation = validateGroupData(importedData)

        if (!validation.isValid) {
            alert('Import failed:\n' + validation.errors.join('\n'))
            return
        }

        // Add imported data to groups
        importedData.forEach(item => {
            const newGroup = {
                id: Math.max(...groups.value.map(g => g.id)) + 1,
                global_id: item.global_id,
                group_name: item.group_name,
                active: item.active === 'Active' || item.active === '1' || item.active === 1 ? 1 : 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            groups.value.push(newGroup)
        })

        alert(`Successfully imported ${importedData.length} groups!`)
    } catch (error) {
        alert('Import failed: ' + error.message)
    }
}

const handleExportExcel = () => {
    try {
        const exportData = filteredGroups.value.map(group => ({
            ID: group.id,
            'Global ID': group.global_id,
            'Group Name': group.group_name,
            Status: group.active ? 'Active' : 'Inactive',
            Created: formatDate(group.created_at)
        }))

        exportToExcel(exportData, 'groups')
        alert('Groups exported to Excel successfully!')
    } catch (error) {
        alert('Export failed: ' + error.message)
    }
}

const handleExportPDF = () => {
    try {
        const exportData = filteredGroups.value.map(group => ({
            id: group.id,
            global_id: group.global_id,
            group_name: group.group_name,
            active: group.active,
            created_at: formatDate(group.created_at)
        }))

        exportToPDF(exportData, 'groups')
        alert('Groups exported to PDF successfully!')
    } catch (error) {
        alert('Export failed: ' + error.message)
    }
}
</script>

<style scoped>
.groups-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    padding: 0;
}

/* Modern Header Styles */
.modern-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-content {
    flex: 1;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
    letter-spacing: -0.025em;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 4px;
}

.breadcrumb-item {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.breadcrumb-item.active {
    color: #3b82f6;
}

.breadcrumb-separator {
    opacity: 0.5;
}

.stats-cards {
    display: flex;
    gap: 16px;
}

.stat-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    min-width: 100px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.modern-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 20px;
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
}

.modern-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.add-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
    border: none !important;
    color: white !important;
}

.modern-menu {
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
}

.menu-item {
    padding: 12px 16px;
    border-radius: 8px;
    margin: 4px;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background: #f8fafc;
}

/* Modern Table Section */
.modern-table-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
}

.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
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
    margin: 0;
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
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sort-select {
    min-width: 140px;
}

.sort-select :deep(.v-field) {
    border-radius: 12px;
}

.filter-btn {
    height: 40px;
    width: 40px;
    border-radius: 12px;
}

.filters-panel {
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
}

.filters-content {
    display: flex;
    gap: 24px;
    align-items: center;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Modern Table Styles */
.modern-table-wrapper {
    position: relative;
    overflow: hidden;
}

.modern-table {
    width: 100%;
}

.modern-header-row {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.modern-header-cell {
    padding: 20px 16px;
    border: none;
    position: relative;
    text-align: left !important;
}

.modern-header-cell.center-align {
    text-align: left !important;
}

.modern-header-cell.id-column {
    width: 80px;
    text-align: left !important;
}

.header-content {
    display: flex;
    align-items: center;
    color: #45474b !important;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 4px;
}

.modern-table-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
}

.modern-table-row:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: scale(1.001);
}

.modern-table-cell {
    padding: 16px;
    border: none;
    vertical-align: middle;
    text-align: left !important;
}

.modern-table-cell.center-align {
    text-align: left !important;
}

.modern-table-cell.id-column {
    width: 80px;
    text-align: left !important;
}

.id-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #3730a3;
    font-weight: 600;
    font-size: 12px;
    border-radius: 8px;
}

.group-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.group-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
    border-radius: 10px;
}

.group-details {
    flex: 1;
}

.group-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.group-meta {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.global-id-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #475569;
    font-weight: 500;
                                display: block;
                                color: #1e293b !important;
                                font-weight: 600;
                                font-size: 15px;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                                padding: 0;
    border-radius: 8px !important;
}

.date-info {
    text-align: left;
}

.date-primary {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.date-secondary {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.action-group {
    display: flex;
    gap: 4px;
    justify-content: flex-start;
}

.action-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 64px 32px;
    color: #64748b;
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #475569;
    margin: 16px 0 8px 0;
}

.empty-subtitle {
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .header-container {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
    }

    .action-section {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 16px 20px;
    }

    .modern-table-section {
        padding: 16px 20px;
    }

    .title-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .stats-cards {
        justify-content: center;
        flex-wrap: wrap;
    }

    .toolbar-right {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .search-container {
        min-width: auto;
    }

    .table-toolbar {
        flex-direction: column;
        gap: 16px;
    }

    .modern-table-wrapper {
        overflow-x: auto;
    }

    .modern-table {
        min-width: 800px;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .action-buttons {
        justify-content: center;
    }

    .filters-row {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-select {
        max-width: none;
    }

    .table-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .search-field,
    .order-select {
        min-width: auto;
    }
}

/* Modern Dialog Styles */
.modern-dialog {
    border-radius: 16px !important;
    overflow: hidden;
}

.dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 20px;
    background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
}

.header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
    flex: 1;
}

.dialog-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 4px 0;
    line-height: 1.2;
}

.dialog-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.3;
}

.close-btn {
    opacity: 0.7;
    transition: all 0.2s ease;
}

.close-btn:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.04);
}

.dialog-content {
    padding: 24px !important;
}

.form-group {
    margin-bottom: 20px;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.form-field {
    margin-bottom: 0 !important;
}

.form-field :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.form-field :deep(.v-field:hover) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.form-field :deep(.v-field--focused) {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.switch-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.switch-info {
    flex: 1;
}

.switch-description {
    font-size: 13px;
    color: #64748b;
    margin: 4px 0 0 0;
    line-height: 1.4;
}

.dialog-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
}

.action-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 24px;
    transition: all 0.2s ease;
}

.cancel-btn {
    min-width: 100px;
}

.submit-btn {
    min-width: 140px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
}

/* Delete Dialog Styles */
.delete-dialog {
    border-radius: 16px !important;
    overflow: hidden;
}

.delete-header {
    text-align: center;
    padding: 32px 24px 24px;
    background: linear-gradient(135deg, #fef7f7 0%, #fdf2f2 100%);
}

.delete-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    margin: 0 auto 16px;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}

.delete-title {
    font-size: 22px;
    font-weight: 600;
    color: #dc2626;
    margin: 0 0 4px 0;
}

.delete-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.delete-content {
    padding: 24px !important;
}

.warning-box {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #fef3cd;
    border: 1px solid #fde047;
    border-radius: 12px;
}

.warning-icon {
    flex-shrink: 0;
    margin-top: 2px;
}

.warning-text {
    flex: 1;
}

.warning-message {
    font-size: 14px;
    color: #92400e;
    margin: 0 0 4px 0;
    line-height: 1.4;
}

.group-name {
    color: #dc2626;
    font-weight: 600;
}

.warning-details {
    font-size: 13px;
    color: #a16207;
    margin: 0;
    line-height: 1.4;
}

.delete-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
}

.delete-btn {
    min-width: 130px;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.delete-btn:hover {
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
    transform: translateY(-1px);
}

/* Animation for dialogs */
.modern-dialog,
.delete-dialog {
    animation: dialogSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes dialogSlideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>