<template>
    <div class="class-analytics-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-chart-box" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Class Attendance Analytics</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Lecturer</span>
                                <v-icon size="16" class="breadcrumb-divider">mdi-chevron-right</v-icon>
                                <span class="breadcrumb-item active">{{ classInfo?.name || 'Analytics' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ classInfo?.total_students || 0 }}</div>
                            <div class="stat-label">Total Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ studentsPresent }}</div>
                            <div class="stat-label">Present</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ studentsLate }}</div>
                            <div class="stat-label">Late</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ studentsAbsent }}</div>
                            <div class="stat-label">Absent</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-download" variant="outlined" v-bind="props">
                                Export
                                <v-icon size="16">mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item class="menu-item" @click="exportData('pdf')">
                                <v-list-item-title>Export as PDF</v-list-item-title>
                            </v-list-item>
                            <v-list-item class="menu-item" @click="exportData('excel')">
                                <v-list-item-title>Export as Excel</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn 
                        class="modern-btn refresh-btn" 
                        prepend-icon="mdi-refresh" 
                        variant="flat" 
                        color="primary"
                        @click="refreshData" 
                        :loading="loading" 
                        elevation="2"
                    >
                        Refresh Data
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="modern-table-section">

            <!-- Students Table -->
            <div class="table-container">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in filteredStudents" :key="student.id" class="table-row">
                            <td class="student-cell">
                                <div class="student-info">
                                    <v-avatar size="32" class="student-avatar" :color="getAvatarColor(student.name)">
                                        {{ getInitials(student.name) }}
                                    </v-avatar>
                                    <div class="student-details">
                                        <div class="student-name">{{ student.name }}</div>
                                        <div class="student-id">Student ID: {{ student.student_id }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="date-cell">{{ formatTableDate(student.scan_time || '2024-01-25') }}</td>
                            <td class="date-cell">{{ formatTableDate(student.scan_time || '2024-01-26') }}</td>
                            <td class="type-cell">
                                <span class="type-badge" :class="getTypeClass(student.status)">
                                    {{ getAttendanceType(student.status) }}
                                </span>
                            </td>
                            <td class="status-cell">
                                <v-chip 
                                    :color="getStatusChipColor(student.status)"
                                    variant="flat"
                                    size="small"
                                    class="status-chip"
                                >
                                    {{ student.status }}
                                </v-chip>
                            </td>
                            <td class="actions-cell">
                                <div class="action-buttons">
                                    <v-btn
                                        icon
                                        variant="text"
                                        size="small"
                                        @click="approveAttendance(student)"
                                        :disabled="student.status === 'Present'"
                                        class="action-btn-sm approve-btn"
                                    >
                                        <v-icon size="18">mdi-check</v-icon>
                                        <v-tooltip activator="parent">Mark Present</v-tooltip>
                                    </v-btn>
                                    <v-btn
                                        icon
                                        variant="text"
                                        size="small"
                                        @click="rejectAttendance(student)"
                                        :disabled="student.status === 'Absent'"
                                        class="action-btn-sm reject-btn"
                                    >
                                        <v-icon size="18">mdi-close</v-icon>
                                        <v-tooltip activator="parent">Mark Absent</v-tooltip>
                                    </v-btn>
                                    <v-btn
                                        icon
                                        variant="text"
                                        size="small"
                                        @click="viewStudent(student)"
                                        class="action-btn-sm view-btn"
                                    >
                                        <v-icon size="18">mdi-eye</v-icon>
                                        <v-tooltip activator="parent">View Details</v-tooltip>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-section">
                <div class="pagination-info">
                    <span class="pagination-label">Items per page:</span>
                    <v-select
                        v-model="itemsPerPage"
                        :items="[5, 10, 15, 20]"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="items-per-page-select"
                    />
                    <span class="pagination-status">{{ paginationText }}</span>
                </div>
                <div class="pagination-controls">
                    <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click="goToFirstPage"
                        :disabled="currentPage === 1"
                        class="pagination-btn"
                    >
                        <v-icon>mdi-page-first</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click="goToPrevPage"
                        :disabled="currentPage === 1"
                        class="pagination-btn"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click="goToNextPage"
                        :disabled="currentPage >= totalPages"
                        class="pagination-btn"
                    >
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click="goToLastPage"
                        :disabled="currentPage >= totalPages"
                        class="pagination-btn"
                    >
                        <v-icon>mdi-page-last</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Error Snackbar -->
        <v-snackbar
            v-model="showError"
            :timeout="5000"
            color="error"
            location="top"
        >
            {{ errorMessage }}
            <template v-slot:actions>
                <v-btn variant="text" @click="showError = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Define layout
definePageMeta({
    layout: 'lecturer'
})

const router = useRouter()
const route = useRoute()

// Get class ID from route params
const classId = computed(() => route.params.id)

// Component state
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Mock data - replace with actual API calls
const classInfo = ref({
    id: 1,
    name: 'Introduction to Programming',
    code: 'CS101',
    total_students: 25,
    attendance_rate: 92
})

const studentsList = ref([
    {
        id: 1,
        student_id: 'S001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: null,
        status: 'Present',
        scan_time: '2024-11-23 08:30:00',
        location: 'Room A101'
    },
    {
        id: 2,
        student_id: 'S002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: null,
        status: 'Present',
        scan_time: '2024-11-23 08:25:00',
        location: 'Room A101'
    },
    {
        id: 3,
        student_id: 'S003',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        avatar: null,
        status: 'Absent',
        scan_time: null,
        location: null
    },
    {
        id: 4,
        student_id: 'S004',
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        avatar: null,
        status: 'Late',
        scan_time: '2024-11-23 09:15:00',
        location: 'Room A101'
    },
    {
        id: 5,
        student_id: 'S005',
        name: 'Charlie Wilson',
        email: 'charlie.wilson@example.com',
        avatar: null,
        status: 'Absent',
        scan_time: null,
        location: null
    },
    {
        id: 6,
        student_id: 'S006',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        avatar: null,
        status: 'Present',
        scan_time: '2024-11-23 08:20:00',
        location: 'Room A101'
    }
])

// Computed properties
const studentsPresent = computed(() => 
    studentsList.value.filter(s => s.status === 'Present').length
)

const studentsLate = computed(() => 
    studentsList.value.filter(s => s.status === 'Late').length
)

const studentsAbsent = computed(() => 
    studentsList.value.filter(s => s.status === 'Absent').length
)

const filteredStudents = computed(() => {
    let filtered = studentsList.value

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(student => 
            student.name.toLowerCase().includes(query) ||
            student.student_id.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query)
        )
    }

    return filtered
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage.value))

const paginationText = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(currentPage.value * itemsPerPage.value, filteredStudents.value.length)
    const total = filteredStudents.value.length
    return `${start}-${end} of ${total}`
})

// Methods
const formatTableDate = (datetime: string) => {
    return new Date(datetime).toISOString().split('T')[0] // Returns YYYY-MM-DD format
}

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getAvatarColor = (name: string) => {
    const colors = ['primary', 'secondary', 'accent', 'info', 'warning', 'error', 'success']
    const index = name.length % colors.length
    return colors[index]
}

const getAttendanceType = (status: string) => {
    switch (status) {
        case 'Present': return 'Regular Attendance'
        case 'Late': return 'Late Arrival'
        case 'Absent': return 'Absent'
        default: return 'Unknown'
    }
}

const getTypeClass = (status: string) => {
    switch (status) {
        case 'Present': return 'type-present'
        case 'Late': return 'type-late'
        case 'Absent': return 'type-absent'
        default: return 'type-default'
    }
}

const getStatusChipColor = (status: string) => {
    switch (status) {
        case 'Present': return 'success'
        case 'Late': return 'warning'
        case 'Absent': return 'error'
        default: return 'grey'
    }
}

const approveAttendance = (student: any) => {
    student.status = 'Present'
    student.scan_time = new Date().toISOString()
    console.log('Approved attendance for:', student.name)
}

const rejectAttendance = (student: any) => {
    student.status = 'Absent'
    student.scan_time = null
    console.log('Rejected attendance for:', student.name)
}

const viewStudent = (student: any) => {
    console.log('View student details:', student.name)
    showErrorMessage('Student details view coming soon!')
}

const refreshData = async () => {
    try {
        loading.value = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Refreshing analytics data...')
    } catch (err) {
        console.error('Error refreshing data:', err)
        showErrorMessage('Failed to refresh data')
    } finally {
        loading.value = false
    }
}

const exportData = async (format: string) => {
    try {
        console.log(`Exporting attendance analytics as ${format}...`)
        showErrorMessage(`${format.toUpperCase()} export coming soon!`)
    } catch (err) {
        console.error('Error exporting data:', err)
        showErrorMessage('Failed to export data')
    }
}

// Pagination methods
const goToFirstPage = () => { currentPage.value = 1 }
const goToPrevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goToNextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToLastPage = () => { currentPage.value = totalPages.value }

const showErrorMessage = (message: string) => {
    errorMessage.value = message
    showError.value = true
}

// Initialize data
onMounted(async () => {
    console.log('Loading analytics for class ID:', classId.value)
    await refreshData()
})

// Set page title
useHead({
    title: `Class Analytics - ${classInfo.value?.name || 'Loading...'}`
})
</script>

<style scoped>
.class-analytics-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    padding: 0;
}

/* Modern Header Styles */
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

.breadcrumb-divider {
    color: #cbd5e1;
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

.refresh-btn {
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

/* Modern Table Section */
.modern-table-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
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

.search-field {
    min-width: 280px;
}

.search-field :deep(.v-field) {
    border-radius: 8px;
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

/* Table Styles */
.table-container {
    padding: 0 32px;
}

.students-table {
    width: 100%;
    border-collapse: collapse;
}

.students-table thead {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.students-table th {
    padding: 16px 12px;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
}

.students-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.2s ease;
}

.students-table tbody tr:hover {
    background-color: #f8fafc;
}

.students-table td {
    padding: 16px 12px;
    vertical-align: middle;
    color: #374151;
}

/* Student Cell */
.student-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.student-avatar {
    flex-shrink: 0;
}

.student-details {
    flex: 1;
}

.student-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 2px;
}

.student-id {
    font-size: 0.8rem;
    color: #64748b;
}

/* Date Cell */
.date-cell {
    font-family: monospace;
    font-size: 0.9rem;
    color: #374151;
}

/* Type Cell */
.type-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
}

.type-badge.type-present {
    background: #dcfce7;
    color: #166534;
}

.type-badge.type-late {
    background: #fef3c7;
    color: #92400e;
}

.type-badge.type-absent {
    background: #fee2e2;
    color: #991b1b;
}

/* Status Cell */
.status-chip {
    font-weight: 600;
    min-width: 80px;
}

/* Actions Cell */
.action-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
}

.action-btn-sm {
    width: 32px;
    height: 32px;
}

.approve-btn:hover {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.reject-btn:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.view-btn:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
}

/* Pagination */
.pagination-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px 24px;
    border-top: 1px solid #f1f5f9;
    margin-top: 16px;
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.pagination-label {
    font-size: 0.9rem;
    color: #64748b;
    white-space: nowrap;
}

.items-per-page-select {
    min-width: 80px;
}

.pagination-status {
    font-size: 0.9rem;
    color: #374151;
    white-space: nowrap;
}

.pagination-controls {
    display: flex;
    gap: 4px;
}

.pagination-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #e2e8f0;
    background: white;
}

.pagination-btn:hover:not(:disabled) {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

    .action-section {
        align-self: stretch;
        justify-content: center;
    }

    .table-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .toolbar-right {
        justify-content: stretch;
    }

    .search-field {
        min-width: auto;
        width: 100%;
    }

    .modern-table-section {
        padding: 20px 16px;
    }

    .table-container {
        padding: 0 16px;
        overflow-x: auto;
    }

    .students-table {
        min-width: 600px;
    }

    .pagination-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .pagination-info {
        justify-content: space-between;
    }

    .pagination-controls {
        justify-content: center;
    }
}

/* Animation for page load */
.class-analytics-page {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>