<template>
    <div class="classes-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-google-classroom" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Class Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Classes</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ allClasses.length }}</div>
                            <div class="stat-label">Total Classes</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ activeClassesCount }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ totalStudents }}</div>
                            <div class="stat-label">Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ avgAttendance }}%</div>
                            <div class="stat-label">Avg Attendance</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-download" variant="outlined" 
                                color="primary" v-bind="props" elevation="0">
                                Export
                                <v-icon icon="mdi-chevron-down" end />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item @click="handleExportExcel" class="menu-item">
                                <v-icon icon="mdi-file-excel" class="mr-2" color="green" />
                                Export to Excel
                            </v-list-item>
                            <v-list-item @click="handleExportPDF" class="menu-item">
                                <v-icon icon="mdi-file-pdf-box" class="mr-2" color="red" />
                                Export to PDF
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openAddDialog" elevation="0">
                        Add Class
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
                            <v-icon icon="mdi-format-list-bulleted" size="20" class="mr-2" />
                            Classes
                        </h2>
                        <div class="table-subtitle">Manage and monitor all classes</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search by name, code, or lecturer..." 
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" 
                                hide-details class="search-input" />
                        </div>

                        <v-select v-model="filterYear" :items="yearOptions" label="Year" variant="outlined" 
                            density="comfortable" class="filter-select" />

                        <v-select v-model="filterStatus" :items="statusOptions" label="Status" variant="outlined" 
                            density="comfortable" class="filter-select" />

                        <v-select v-model="tableSortOrder" :items="tableSortOptions" label="Sort by" variant="outlined" 
                            density="comfortable" class="sort-select" />

                        <v-btn icon="mdi-filter-variant" variant="outlined" class="filter-btn" 
                            @click="showFilters = !showFilters" :color="showFilters ? 'primary' : 'grey'" />
                    </div>
                </div>

                <!-- Quick Filters (collapsible) -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-panel">
                        <div class="filters-content">
                            <div class="filter-group">
                                <div class="filter-label">Class Type</div>
                                <v-select v-model="filterClassType" :items="classTypeOptions" variant="outlined" 
                                    density="comfortable" class="filter-input" />
                            </div>
                            <div class="filter-group">
                                <div class="filter-label">Generation</div>
                                <v-select v-model="filterGeneration" :items="generationOptions" variant="outlined" 
                                    density="comfortable" class="filter-input" />
                            </div>
                            <div class="filter-group">
                                <div class="filter-label">Department</div>
                                <v-select v-model="filterDepartment" :items="departmentOptions" variant="outlined" 
                                    density="comfortable" class="filter-input" />
                            </div>
                        </div>
                    </div>
                </v-expand-transition>

                <!-- Modern Data Table -->
                <div class="modern-table-wrapper">
                    <v-table class="modern-table">
                        <thead>
                            <tr class="modern-header-row">
                                <th class="modern-header-cell id-column">
                                    <div class="header-content">ID</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Subject</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Lecturer</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Type</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Year/Term</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Students</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="class_item in paginatedClasses" :key="class_item.id" class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ class_item.id }}</div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="class-info">
                                        <div class="class-avatar">
                                            <v-icon icon="mdi-book-open-variant" />
                                        </div>
                                        <div class="class-details">
                                            <div class="class-name">{{ class_item.subject }}</div>
                                            <div class="class-code">{{ class_item.code }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="lecturer-info">
                                        <div class="lecturer-name">{{ class_item.lecturerName }}</div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip :color="getClassTypeColor(class_item.classType)" size="small" variant="tonal">
                                        {{ class_item.classType }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="year-term-info">
                                        <div class="year-term">Y{{ class_item.year }}/T{{ class_item.term }}</div>
                                        <div class="generation">Gen {{ class_item.generation }}</div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip size="small" variant="tonal" color="blue">
                                        {{ class_item.students }} students
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="class_item.status === 'active' ? 'success' : 'grey'" size="small" variant="flat">
                                        <v-icon start size="14">{{ class_item.status === 'active' ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                                        {{ class_item.status }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="viewClass(class_item)">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="editClass(class_item)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="deleteClass(class_item)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredClasses.length === 0" class="empty-state">
                        <v-icon icon="mdi-google-classroom" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No classes found</h3>
                        <p class="empty-subtitle">
                            {{ searchQuery ? 'Try adjusting your search criteria or filters.' : 'No classes have been created yet.' }}
                        </p>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div v-if="filteredClasses.length > 0" class="pagination-section">
                        <v-btn 
                            variant="outlined" 
                            :disabled="currentPage === 1"
                            @click="goToPrevPage"
                            class="pagination-btn"
                        >
                            Previous
                        </v-btn>
                        
                        <div class="pagination-info">
                            <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
                        </div>
                        
                        <v-btn 
                            variant="outlined" 
                            :disabled="currentPage >= totalPages"
                            @click="goToNextPage"
                            class="pagination-btn"
                        >
                            Next
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="700" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="editMode ? 'mdi-pencil' : 'mdi-plus'" color="#fde047" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ editMode ? 'Edit Class' : 'Add New Class' }}</h2>
                            <p class="dialog-subtitle">{{ editMode ? 'Update class information' : 'Create a new class' }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <ClassForm :initial-data="editMode ? selectedClass : null" :is-edit-mode="editMode"
                        @save="handleSave" @cancel="closeDialog" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- View Details Dialog -->
        <v-dialog v-model="viewDialog" max-width="800" persistent>
            <v-card class="modern-dialog" elevation="24" v-if="selectedClass">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-google-classroom" color="primary" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Class Details</h2>
                            <p class="dialog-subtitle">{{ selectedClass.subject }} - {{ selectedClass.code }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="viewDialog = false" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <div class="class-details">
                        <!-- Basic Information -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-information" size="16" />
                                Basic Information
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Subject</div>
                                    <div class="detail-value">{{ selectedClass.subject }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Code</div>
                                    <div class="detail-value">{{ selectedClass.code }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Lecturer</div>
                                    <div class="detail-value">{{ selectedClass.lecturerName }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Department</div>
                                    <div class="detail-value">{{ selectedClass.department }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Class Type</div>
                                    <div class="detail-value">{{ selectedClass.classType }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Generation</div>
                                    <div class="detail-value">Generation {{ selectedClass.generation }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Schedule Information -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-calendar-clock" size="16" />
                                Schedule Information
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Schedule</div>
                                    <div class="detail-value">{{ selectedClass.schedule || 'Not set' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Room</div>
                                    <div class="detail-value">{{ selectedClass.room || 'Not assigned' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Students</div>
                                    <div class="detail-value">{{ selectedClass.students }} students</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">{{ selectedClass.status }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="viewDialog = false" class="action-btn">
                        <v-icon start>mdi-close</v-icon>
                        Close
                    </v-btn>
                    <v-btn color="primary" variant="flat" @click="editClass(selectedClass)" class="action-btn">
                        <v-icon start>mdi-pencil</v-icon>
                        Edit Class
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="500" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-delete-alert" color="error" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Confirm Delete</h2>
                            <p class="dialog-subtitle">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <p>Are you sure you want to delete <strong>{{ selectedClass?.subject }}</strong>?</p>
                    <p class="text-caption text-grey">This will permanently remove the class and all associated data.</p>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false" class="action-btn">
                        <v-icon start>mdi-close</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn color="error" variant="flat" @click="confirmDelete" class="action-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useClassStore } from '~/stores/useClassStore'
import ClassForm from '~/components/admin/ClassForm.vue'

definePageMeta({
    layout: 'admin',
    // middleware: ['auth', 'role-admin']
})

const classStore = useClassStore()

// State
const dialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const selectedClass = ref(null)

// Filters
const searchQuery = ref('')
const filterYear = ref('All')
const filterTerm = ref('All')
const filterClassType = ref('All')
const filterStatus = ref('All')
const filterGeneration = ref('All')
const filterDepartment = ref('All')
const tableSortOrder = ref('Newest')
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Options
const yearOptions = ['All', '1', '2', '3', '4']
const termOptions = ['All', '1', '2']
const classTypeOptions = ['All', 'Theory Class', 'Lab Class', 'Seminar', 'Workshop', 'Capstone Project']
const statusOptions = ['All', 'active', 'inactive']
const generationOptions = ['All', '9', '10', '11', '12']
const departmentOptions = ['All', 'Computer Science', 'Information Technology']
const tableSortOptions = ['Newest', 'Oldest', 'A-Z', 'Z-A']

// Table Headers
const headers = [
    { title: 'Subject', key: 'subject', sortable: true },
    { title: 'Lecturer', key: 'lecturerName', sortable: true },
    { title: 'Class Type', key: 'classType', sortable: true },
    { title: 'Year/Term', key: 'year', sortable: true },
    { title: 'Group', key: 'group', sortable: true },
    { title: 'Schedule', key: 'schedule', sortable: false },
    { title: 'Students', key: 'students', sortable: true },
    { title: 'Attendance', key: 'attendance', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

// Computed
const allClasses = computed(() => classStore.classes)

const filteredClasses = computed(() => {
    let result = allClasses.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c =>
            c.subject.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.lecturerName.toLowerCase().includes(query)
        )
    }

    // Year filter
    if (filterYear.value !== 'All') {
        result = result.filter(c => c.year === parseInt(filterYear.value))
    }

    // Term filter
    if (filterTerm.value !== 'All') {
        result = result.filter(c => c.term === parseInt(filterTerm.value))
    }

    // Class Type filter
    if (filterClassType.value !== 'All') {
        result = result.filter(c => c.classType === filterClassType.value)
    }

    // Status filter
    if (filterStatus.value !== 'All') {
        result = result.filter(c => c.status === filterStatus.value)
    }

    // Generation filter
    if (filterGeneration.value !== 'All') {
        result = result.filter(c => c.generation === filterGeneration.value)
    }

    // Department filter
    if (filterDepartment.value !== 'All') {
        result = result.filter(c => c.department === filterDepartment.value)
    }

    return result
})

const activeClassesCount = computed(() =>
    allClasses.value.filter(c => c.status === 'active').length
)

const totalStudents = computed(() =>
    allClasses.value.reduce((sum, c) => sum + c.students, 0)
)

const avgAttendance = computed(() => {
    if (allClasses.value.length === 0) return 0
    const total = allClasses.value.reduce((sum, c) => sum + c.attendance, 0)
    return Math.round(total / allClasses.value.length)
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredClasses.value.length / itemsPerPage.value))

const paginatedClasses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredClasses.value.slice(start, end)
})

// Methods
const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success'
    if (attendance >= 75) return 'primary'
    if (attendance >= 60) return 'warning'
    return 'error'
}

const getClassTypeColor = (classType) => {
    const colors = {
        'Theory Class': 'blue',
        'Lab Class': 'green',
        'Seminar': 'purple',
        'Workshop': 'orange',
        'Capstone Project': 'red'
    }
    return colors[classType] || 'grey'
}

const openAddDialog = () => {
    editMode.value = false
    selectedClass.value = null
    dialog.value = true
}

const editClass = (classItem) => {
    editMode.value = true
    selectedClass.value = { ...classItem }
    dialog.value = true
}

const viewClass = (classItem) => {
    selectedClass.value = classItem
    viewDialog.value = true
}

const deleteClass = (classItem) => {
    selectedClass.value = classItem
    deleteDialog.value = true
}

const closeDialog = () => {
    dialog.value = false
    editMode.value = false
    selectedClass.value = null
}

const handleSave = async (formData) => {
    try {
        if (editMode.value && selectedClass.value) {
            await classStore.updateClass(selectedClass.value.id, formData)
        } else {
            await classStore.createClass(formData)
        }
        closeDialog()
    } catch (error) {
        console.error('Error saving class:', error)
        alert('Failed to save class. Please try again.')
    }
}

const confirmDelete = async () => {
    try {
        await classStore.deleteClass(selectedClass.value.id)
        deleteDialog.value = false
        selectedClass.value = null
    } catch (error) {
        console.error('Error deleting class:', error)
        alert('Failed to delete class. Please try again.')
    }
}

const resetFilters = () => {
    searchQuery.value = ''
    filterSemester.value = 'All'
    filterStatus.value = 'All'
    filterGeneration.value = 'All'
    filterDepartment.value = 'All'
}

const refreshData = async () => {
    await classStore.fetchClasses()
}

// Export functions
const handleExportExcel = () => {
    console.log('Exporting to Excel...')
}

const handleExportPDF = () => {
    console.log('Exporting to PDF...')
}

// Pagination methods
const goToPrevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

// Watch for filter changes and reset pagination
watch([searchQuery, filterYear, filterTerm, filterClassType, filterStatus, filterGeneration, filterDepartment, tableSortOrder], () => {
    currentPage.value = 1
})

// Initialize
onMounted(async () => {
    await classStore.fetchClasses()
})
</script>

<style scoped>
.classes-page {
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
    gap: 8px;
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
    flex-wrap: nowrap;
}

.search-container {
    min-width: 250px;
    flex-shrink: 0;
}

.search-input :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-select {
    min-width: 120px;
    flex-shrink: 0;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
}

.sort-select {
    min-width: 120px;
    flex-shrink: 0;
}

.sort-select :deep(.v-field) {
    border-radius: 12px;
}

.filter-btn {
    height: 40px;
    width: 40px;
    border-radius: 12px;
    flex-shrink: 0;
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

.filter-input {
    min-width: 150px;
}

/* Modern Table Styles */
.modern-table-wrapper {
    position: relative;
    overflow: hidden;
}

.modern-table {
    width: 100%;
}

.modern-header-cell {
    padding: 20px 16px;
    border: none;
    position: relative;
    text-align: left !important;
}

.modern-header-cell.center-align {
    text-align: center !important;
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
    text-align: center !important;
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

.class-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.class-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
    border-radius: 10px;
    font-weight: 600;
    font-size: 16px;
}

.class-details {
    flex: 1;
}

.class-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.class-code {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.lecturer-info {
    text-align: left;
}

.lecturer-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.year-term-info {
    text-align: left;
}

.year-term {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.generation {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.action-group {
    display: flex;
    gap: 4px;
    justify-content: center;
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

/* Pagination */
.pagination-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid #f1f5f9;
    margin-top: 0;
}

.pagination-btn {
    min-width: 100px;
    height: 40px;
    border-radius: 8px;
    font-weight: 500;
    text-transform: none;
}

.pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination-info {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination-text {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
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
    max-height: 500px;
    overflow-y: auto;
}

.class-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.detail-section {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-item.full-width {
    grid-column: 1 / -1;
}

.detail-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.detail-value {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
}

.dialog-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
}

.dialog-actions .action-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 32px;
    transition: all 0.2s ease;
    min-width: 120px;
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
        min-width: 1000px;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-item.full-width {
        grid-column: 1;
    }
}

/* Animation for dialogs */
.modern-dialog {
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