<template>
    <div class="subjects-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-book-open-variant" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Subject Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Subjects</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ subjects.length }}</div>
                            <div class="stat-label">Total Subjects</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ activeSubjectsCount }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ inactiveSubjectsCount }}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-upload" variant="outlined" v-bind="props">
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

                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn import-btn" prepend-icon="mdi-download" variant="outlined" v-bind="props">
                                Import
                                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item @click="handleImportCSV" class="menu-item">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-file-delimited" color="info" />
                                </template>
                                <v-list-item-title>Import from CSV</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat"
                        @click="openCreateDialog">
                        Add Subject
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
                            <v-icon icon="mdi-book-open-variant" size="20" class="mr-2" />
                            Subject Information
                        </h2>
                        <div class="table-subtitle">Manage and organize academic subjects and courses</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="search" placeholder="Search subjects..." prepend-inner-icon="mdi-magnify"
                                variant="outlined" density="compact" hide-details class="search-input" clearable />
                        </div>

                        <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined"
                            density="compact" hide-details class="filter-select" />

                        <v-btn icon="mdi-filter-variant" variant="outlined" class="filter-btn"
                            @click="showFilters = !showFilters" />
                    </div>
                </div>

                <!-- Quick Filters (collapsible) -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-panel">
                        <div class="filters-content">
                            <div class="filter-group">
                                <label class="filter-label">Department</label>
                                <v-select v-model="departmentFilter" :items="departmentOptions" variant="outlined" density="compact"
                                    hide-details class="filter-select" />
                            </div>
                            <div class="filter-group">
                                <label class="filter-label">Sort By</label>
                                <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="compact"
                                    hide-details class="filter-select" />
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
                                    <div class="header-content">#</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Global ID</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Subject Code</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Subject Name</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Credit Hours</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Department</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Created At</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(subject, index) in paginatedSubjects" :key="subject.id" class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="code-badge">{{ subject.global_id }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="code-badge">{{ subject.subject_code }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="subject-info">
                                        <div class="subject-details">
                                            <div class="subject-name">{{ subject.subject_name }}</div>
                                            <div class="subject-description">{{ subject.description }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip color="info" variant="tonal" size="small" class="credit-chip">
                                        {{ subject.credit_hours }} Credits
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip color="primary" variant="tonal" size="small" class="dept-chip">
                                        {{ getDepartmentName(subject.department_id) }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="subject.is_active ? 'success' : 'error'" size="small"
                                        class="status-chip">
                                        <v-icon start size="16">{{ subject.is_active ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                                        {{ subject.is_active ? 'Active' : 'Inactive' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="date-info">{{ formatDate(subject.created_at) }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="handleView(subject)">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="editSubject(subject)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(subject)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredSubjects.length === 0" class="empty-state">
                        <v-icon icon="mdi-book-off-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No subjects found</h3>
                        <p class="empty-subtitle">
                            Create your first subject to get started with academic course management.
                        </p>
                        <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
                            <v-icon start>mdi-plus</v-icon>
                            Add Subject
                        </v-btn>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div v-if="filteredSubjects.length > 0" class="pagination-section">
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

        <!-- View Details Dialog -->
        <v-dialog v-model="viewDialog" max-width="800" persistent>
            <v-card class="modern-dialog" elevation="24" v-if="selectedSubject">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-book-open-variant" color="primary" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Subject Details</h2>
                            <p class="dialog-subtitle">{{ selectedSubject.subject_name }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="viewDialog = false" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <div class="subject-details">
                        <!-- Basic Information -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-information" size="16" />
                                Basic Information
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Subject ID</div>
                                    <div class="detail-value">{{ selectedSubject.id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Global ID</div>
                                    <div class="detail-value">{{ selectedSubject.global_id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Subject Code</div>
                                    <div class="detail-value">{{ selectedSubject.subject_code }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Credit Hours</div>
                                    <div class="detail-value">{{ selectedSubject.credit_hours }} Credits</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Subject Name</div>
                                    <div class="detail-value">{{ selectedSubject.subject_name }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Department</div>
                                    <div class="detail-value">{{ getDepartmentName(selectedSubject.department_id) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">
                                        <v-chip :color="selectedSubject.is_active ? 'success' : 'error'" size="small">
                                            {{ selectedSubject.is_active ? 'Active' : 'Inactive' }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Description</div>
                                    <div class="detail-value">{{ selectedSubject.description || 'No description provided' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Created At</div>
                                    <div class="detail-value">{{ formatDate(selectedSubject.created_at) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Updated At</div>
                                    <div class="detail-value">{{ formatDate(selectedSubject.updated_at) }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Statistics (placeholder for future) -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-chart-box" size="16" />
                                Statistics
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Total Students</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Active Classes</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Total Instructors</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Average Grade</div>
                                    <div class="detail-value">-</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="viewDialog = false" class="action-btn">
                        <v-icon start>mdi-close</v-icon>
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="formDialog" max-width="700" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" :color="isEdit ? 'warning' : 'primary'" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Subject' : 'Add New Subject' }}</h2>
                            <p class="dialog-subtitle">{{ isEdit ? 'Update subject information' : 'Create a new subject' }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeFormDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <v-form ref="formRef" v-model="formValid" @submit.prevent="saveSubject">
                        <div class="form-group">
                            <label class="form-label">Global ID <span class="text-red">*</span></label>
                            <v-text-field 
                                v-model="formData.global_id" 
                                :rules="globalIdRules" 
                                variant="outlined"
                                density="comfortable" 
                                hide-details="auto" 
                                class="form-field" 
                                placeholder="SUB-001"
                                :disabled="isEdit" />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Subject Code <span class="text-red">*</span></label>
                            <v-text-field 
                                v-model="formData.subject_code" 
                                :rules="subjectCodeRules" 
                                variant="outlined"
                                density="comfortable" 
                                hide-details="auto" 
                                class="form-field" 
                                placeholder="CS101" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Subject Name <span class="text-red">*</span></label>
                            <v-text-field 
                                v-model="formData.subject_name" 
                                :rules="subjectNameRules" 
                                variant="outlined"
                                density="comfortable" 
                                hide-details="auto" 
                                class="form-field" 
                                placeholder="Introduction to Computer Science" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Credit Hours <span class="text-red">*</span></label>
                            <v-text-field 
                                v-model.number="formData.credit_hours" 
                                :rules="creditHoursRules" 
                                type="number"
                                variant="outlined"
                                density="comfortable" 
                                hide-details="auto" 
                                class="form-field" 
                                placeholder="3" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Department <span class="text-red">*</span></label>
                            <v-select 
                                v-model="formData.department_id" 
                                :items="departmentItems" 
                                :rules="departmentRules"
                                item-title="text"
                                item-value="value"
                                variant="outlined" 
                                density="comfortable" 
                                hide-details="auto" 
                                class="form-field"
                                placeholder="Select department" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <v-textarea 
                                v-model="formData.description" 
                                variant="outlined"
                                density="comfortable" 
                                hide-details="auto" 
                                rows="3"
                                class="form-field" 
                                placeholder="Enter subject description..." />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <v-select 
                                v-model="formData.is_active" 
                                :items="statusItems" 
                                item-title="text"
                                item-value="value"
                                variant="outlined" 
                                density="comfortable" 
                                hide-details="auto" 
                                class="form-field" />
                        </div>
                    </v-form>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="closeFormDialog" :disabled="formLoading" class="action-btn cancel-btn">
                        <v-icon start>mdi-close</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="saveSubject" 
                        :loading="formLoading" :disabled="!formValid" class="action-btn submit-btn">
                        <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
                        {{ isEdit ? 'Update Subject' : 'Add Subject' }}
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
                    <h2 class="delete-title">Delete Subject</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                You are about to permanently delete the subject
                                <strong class="subject-name">{{ selectedSubject?.subject_name }}</strong>
                                ({{ selectedSubject?.subject_code }})
                            </p>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Delete Actions -->
                <v-card-actions class="delete-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false" :disabled="deleteLoading"
                        class="action-btn cancel-btn">
                        <v-icon start>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="deleteSubject" :loading="deleteLoading"
                        class="action-btn delete-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete Subject
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top right">
            {{ snackbarMessage }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'

// Define layout
definePageMeta({
  layout: 'admin'
})

// Types
interface Subject {
  id: number
  global_id: string
  subject_code: string
  subject_name: string
  description: string
  credit_hours: number
  department_id: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// State
const subjects = ref<Subject[]>([
  {
    id: 1,
    global_id: 'SUB-001',
    subject_code: 'CS101',
    subject_name: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer science including programming basics',
    credit_hours: 3,
    department_id: 1,
    is_active: true,
    created_at: '2024-01-15T08:00:00',
    updated_at: '2024-01-15T08:00:00'
  },
  {
    id: 2,
    global_id: 'SUB-002',
    subject_code: 'CS201',
    subject_name: 'Data Structures and Algorithms',
    description: 'Study of fundamental data structures and algorithm design techniques',
    credit_hours: 4,
    department_id: 1,
    is_active: true,
    created_at: '2024-01-16T08:00:00',
    updated_at: '2024-01-16T08:00:00'
  },
  {
    id: 3,
    global_id: 'SUB-003',
    subject_code: 'EE101',
    subject_name: 'Circuit Analysis',
    description: 'Basic electrical circuit analysis and network theorems',
    credit_hours: 3,
    department_id: 2,
    is_active: true,
    created_at: '2024-01-17T08:00:00',
    updated_at: '2024-01-17T08:00:00'
  },
  {
    id: 4,
    global_id: 'SUB-004',
    subject_code: 'ME101',
    subject_name: 'Engineering Mechanics',
    description: 'Principles of statics and dynamics in mechanical systems',
    credit_hours: 4,
    department_id: 3,
    is_active: true,
    created_at: '2024-01-18T08:00:00',
    updated_at: '2024-01-18T08:00:00'
  },
  {
    id: 5,
    global_id: 'SUB-005',
    subject_code: 'BA101',
    subject_name: 'Principles of Management',
    description: 'Introduction to management principles and organizational behavior',
    credit_hours: 3,
    department_id: 5,
    is_active: false,
    created_at: '2024-01-19T08:00:00',
    updated_at: '2024-01-19T08:00:00'
  }
])

const mockDepartments = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Electrical Engineering' },
  { id: 3, name: 'Mechanical Engineering' },
  { id: 4, name: 'Civil Engineering' },
  { id: 5, name: 'Business Administration' }
]

// UI State
const search = ref('')
const statusFilter = ref('all')
const departmentFilter = ref('all')
const sortBy = ref('subject_name')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showFilters = ref(false)

// Dialogs
const viewDialog = ref(false)
const formDialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const selectedSubject = ref<Subject | null>(null)

// Form State
const formRef = ref<any>(null)
const formValid = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)

const formData = reactive({
  global_id: '',
  subject_code: '',
  subject_name: '',
  description: '',
  credit_hours: 3,
  department_id: null as number | null,
  is_active: true
})

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Dropdown Options
const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
]

const departmentOptions = computed(() => [
  { title: 'All Departments', value: 'all' },
  ...mockDepartments.map(dept => ({ title: dept.name, value: dept.id }))
])

const sortOptions = [
  { title: 'Subject Name', value: 'subject_name' },
  { title: 'Subject Code', value: 'subject_code' },
  { title: 'Credit Hours', value: 'credit_hours' },
  { title: 'Created Date', value: 'created_at' }
]

const departmentItems = computed(() => 
  mockDepartments.map(dept => ({ text: dept.name, value: dept.id }))
)

const statusItems = [
  { text: 'Active', value: true },
  { text: 'Inactive', value: false }
]

// Validation Rules
const globalIdRules = [
  (v: any) => !!v || 'Global ID is required',
  (v: any) => /^SUB-\d{3}$/.test(v) || 'Global ID must be in format SUB-XXX'
]

const subjectCodeRules = [
  (v: any) => !!v || 'Subject Code is required',
  (v: any) => (v && v.length >= 2) || 'Subject Code must be at least 2 characters'
]

const subjectNameRules = [
  (v: any) => !!v || 'Subject Name is required',
  (v: any) => (v && v.length >= 3) || 'Subject Name must be at least 3 characters'
]

const creditHoursRules = [
  (v: any) => v !== null && v !== '' || 'Credit Hours is required',
  (v: any) => v > 0 || 'Credit Hours must be greater than 0',
  (v: any) => v <= 10 || 'Credit Hours must be 10 or less'
]

const departmentRules = [
  (v: any) => !!v || 'Department is required'
]

// Computed Properties
const activeSubjectsCount = computed(() => 
  subjects.value.filter(s => s.is_active).length
)

const inactiveSubjectsCount = computed(() => 
  subjects.value.filter(s => !s.is_active).length
)

const filteredSubjects = computed(() => {
  let filtered = subjects.value

  // Filter by search
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(subject => 
      subject.subject_name.toLowerCase().includes(searchLower) ||
      subject.subject_code.toLowerCase().includes(searchLower) ||
      subject.global_id.toLowerCase().includes(searchLower) ||
      subject.description.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(s => s.is_active)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(s => !s.is_active)
  }

  // Filter by department
  if (departmentFilter.value !== 'all') {
    filtered = filtered.filter(s => s.department_id === Number(departmentFilter.value))
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy.value === 'subject_name') {
      return a.subject_name.localeCompare(b.subject_name)
    } else if (sortBy.value === 'subject_code') {
      return a.subject_code.localeCompare(b.subject_code)
    } else if (sortBy.value === 'credit_hours') {
      return a.credit_hours - b.credit_hours
    } else if (sortBy.value === 'created_at') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return 0
  })

  return filtered
})

const totalPages = computed(() => 
  Math.ceil(filteredSubjects.value.length / itemsPerPage.value)
)

const paginatedSubjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSubjects.value.slice(start, end)
})

// Helper Functions
const getDepartmentName = (departmentId: number): string => {
  const dept = mockDepartments.find(d => d.id === departmentId)
  return dept ? dept.name : 'Unknown'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const resetForm = () => {
  formData.global_id = ''
  formData.subject_code = ''
  formData.subject_name = ''
  formData.description = ''
  formData.credit_hours = 3
  formData.department_id = null
  formData.is_active = true
  formRef.value?.resetValidation()
}

// Dialog Functions
const openCreateDialog = () => {
  resetForm()
  formData.global_id = generateNextGlobalId()
  isEdit.value = false
  formDialog.value = true
}

const handleView = (subject: Subject) => {
  selectedSubject.value = { ...subject }
  viewDialog.value = true
}

const editSubject = (subject: Subject) => {
  selectedSubject.value = { ...subject }
  Object.assign(formData, subject)
  isEdit.value = true
  formDialog.value = true
}

const closeFormDialog = () => {
  formDialog.value = false
  resetForm()
  selectedSubject.value = null
}

const saveSubject = async () => {
  if (!formValid.value) return

  formLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isEdit.value && selectedSubject.value) {
      const index = subjects.value.findIndex(s => s.id === selectedSubject.value!.id)
      if (index !== -1) {
        subjects.value[index] = {
          ...subjects.value[index],
          ...formData,
          updated_at: new Date().toISOString()
        }
        showSnackbar('Subject updated successfully', 'success')
      }
    } else {
      const newSubject: Subject = {
        id: subjects.value.length + 1,
        ...formData,
        department_id: formData.department_id!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      subjects.value.push(newSubject)
      showSnackbar('Subject created successfully', 'success')
    }

    closeFormDialog()
  } catch (error) {
    showSnackbar('An error occurred', 'error')
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = (subject: Subject) => {
  selectedSubject.value = { ...subject }
  deleteDialog.value = true
}

const deleteSubject = async () => {
  if (!selectedSubject.value) return
  
  deleteLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const index = subjects.value.findIndex(s => s.id === selectedSubject.value!.id)
    if (index !== -1) {
      subjects.value.splice(index, 1)
      showSnackbar('Subject deleted successfully', 'success')
    }
  } catch (error) {
    showSnackbar('An error occurred', 'error')
  } finally {
    deleteLoading.value = false
    deleteDialog.value = false
    selectedSubject.value = null
  }
}

// Export/Import Functions
const handleExportExcel = () => {
  showSnackbar('Exporting to Excel...', 'info')
  // Implementation for Excel export
}

const handleExportPDF = () => {
  showSnackbar('Exporting to PDF...', 'info')
  // Implementation for PDF export
}

const handleImportCSV = () => {
  showSnackbar('Import CSV functionality coming soon...', 'info')
  // Implementation for CSV import
}

// Pagination Functions
const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const generateNextGlobalId = () => {
  if (subjects.value.length === 0) return 'SUB-001'
  
  const ids = subjects.value
    .map(s => {
      const parts = s.global_id.split('-')
      return parseInt(parts[1] || '0')
    })
    .filter(id => !isNaN(id))
    .sort((a, b) => b - a)
  
  const lastId = ids.length > 0 ? ids[0] : 0
  const nextNum = ((lastId ?? 0) + 1).toString().padStart(3, '0')
  return `SUB-${nextNum}`
}

// Watch for search/filter changes to reset pagination
watch([search, statusFilter, departmentFilter, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.subjects-page {
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

.filter-select {
    min-width: 120px;
    background: white;
    border-radius: 8px;
}

.filter-select :deep(.v-field) {
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
    background: #f9fafb;
}

.modern-header-cell {
    padding: 20px 16px !important;
    font-weight: 600 !important;
    color: #45474b !important;
    text-transform: uppercase !important;
    font-size: 13px !important;
    letter-spacing: 0.05em !important;
    border: none !important;
    border-bottom: 1px solid #f1f5f9 !important;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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
    padding: 16px !important;
    color: #1e293b;
    font-size: 14px;
    border: none !important;
    vertical-align: middle;
}

.id-column {
    width: 80px;
}

.center-align {
    text-align: center !important;
}

.id-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #3730a3;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
}

.subject-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.subject-details {
    flex: 1;
}

.subject-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 15px;
}

.subject-description {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.code-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #1e293b;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Courier New', monospace;
}

.credit-chip {
    font-weight: 500 !important;
    text-transform: capitalize !important;
    border-radius: 16px !important;
    padding: 0 12px !important;
    height: 28px !important;
}

.dept-chip {
    font-weight: 500 !important;
    text-transform: capitalize !important;
    border-radius: 16px !important;
    padding: 0 12px !important;
    height: 28px !important;
}

.date-info {
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
}

.status-chip {
    font-weight: 500 !important;
    text-transform: capitalize !important;
    border-radius: 16px !important;
    padding: 0 12px !important;
    height: 28px !important;
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
    padding: 20px 24px;
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
    margin: 0;
    line-height: 1.3;
}

.dialog-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 2px 0 0 0;
    line-height: 1.4;
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
    width: 100%;
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

/* Detail View Styles */
.subject-details {
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
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
    border: 1px solid #fde047;
    border-radius: 12px;
    background: #f9fafb;
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

.delete-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
    display: flex;
    justify-content: flex-end;
}

.delete-btn {
    min-width: 130px;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.delete-btn:hover {
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
    transform: translateY(-1px);
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

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-item.full-width {
        grid-column: 1;
    }
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
