<template>
    <div class="professors-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-account-tie" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Professor Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Professors</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ professors.length }}</div>
                            <div class="stat-label">Total Professors</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ activeProfessors.length }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ onLeaveProfessors.length }}</div>
                            <div class="stat-label">On Leave</div>
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

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
                        Add Professor
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
                            <v-icon icon="mdi-account-tie" size="20" class="mr-2" />
                            Professor Information
                        </h2>
                        <div class="table-subtitle">Manage and organize your professors</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search professors..." prepend-inner-icon="mdi-magnify"
                                variant="outlined" density="compact" hide-details class="search-input" clearable />
                        </div>

                        <v-select v-model="departmentFilter" :items="departmentOptions" label="Department" variant="outlined"
                            density="compact" hide-details class="filter-select" />
                        
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
                                <label class="filter-label">Sort By</label>
                                <v-select v-model="sortOrder" :items="sortOptions" variant="outlined" density="compact"
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
                                    <div class="header-content">ID</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Professor</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Code</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Department</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Contact</div>
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
                            <tr v-for="professor in paginatedProfessors" :key="professor.id" class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ professor.id }}</div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="professor-info">
                                        <div class="professor-avatar">
                                            <v-icon icon="mdi-account-tie" />
                                        </div>
                                        <div class="professor-details">
                                            <div class="professor-name">{{ professor.name }}</div>
                                            <div class="professor-email">{{ professor.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="code-badge">{{ professor.professor_code }}</div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="department-info">{{ professor.department }}</div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="contact-info">
                                        <div class="phone">{{ professor.phone }}</div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="professor.status === 'Active' ? 'success' : 'warning'" size="small"
                                        class="status-chip">
                                        <v-icon start size="16">mdi-check-circle</v-icon>
                                        {{ professor.status === 'Active' ? 'active' : 'on leave' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="handleView(professor)">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="openEditDialog(professor)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(professor)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredProfessors.length === 0" class="empty-state">
                        <v-icon icon="mdi-account-tie-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No professors found</h3>
                        <p class="empty-subtitle">
                            Create your first professor to get started with management.
                        </p>
                        <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
                            <v-icon start>mdi-plus</v-icon>
                            Add Professor
                        </v-btn>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div v-if="filteredProfessors.length > 0" class="pagination-section">
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

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="600" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" color="#fde047" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Professor' : 'Add New Professor' }}</h2>
                            <p class="dialog-subtitle">{{ isEdit ? 'Update professor information' : 'Create a new professor profile' }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
                        <div class="form-group">
                            <label class="form-label">Professor Code</label>
                            <v-text-field v-model="formData.professor_code" :rules="codeRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" placeholder="PROF-001" />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <v-text-field v-model="formData.name" :rules="nameRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" placeholder="Dr. John Doe" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <v-text-field v-model="formData.email" :rules="emailRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" placeholder="john.doe@example.com" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Department</label>
                            <v-select v-model="formData.department" :items="departmentItems" :rules="requiredRules"
                                variant="outlined" density="comfortable" hide-details="auto" class="form-field" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Phone Number</label>
                            <v-text-field v-model="formData.phone" :rules="phoneRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" placeholder="012 345 678" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <v-select v-model="formData.status" :items="statusItems" :rules="requiredRules"
                                variant="outlined" density="comfortable" hide-details="auto" class="form-field" />
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
                        {{ isEdit ? 'Update Professor' : 'Add Professor' }}
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
                    <h2 class="delete-title">Delete Professor</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                You are about to permanently delete the professor
                                <strong class="professor-name">{{ selectedProfessor?.name }}</strong>
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
                        Delete Professor
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
    layout: "admin",
});

const router = useRouter();

const professors = ref([
    {
        id: 1,
        professor_code: "PROF-001",
        name: "Dr. John Doe",
        email: "john.doe@example.com",
        department: "Computer Science",
        phone: "012 345 678",
        status: "Active",
    },
    {
        id: 2,
        professor_code: "PROF-002",
        name: "Dr. Jane Smith",
        email: "jane.smith@example.com",
        department: "Information Technology",
        phone: "098 765 432",
        status: "On Leave",
    },
    {
        id: 3,
        professor_code: "PROF-003",
        name: "Dr. Michael Chan",
        email: "michael.chan@example.com",
        department: "Mathematics",
        phone: "010 234 567",
        status: "Active",
    },
    {
        id: 4,
        professor_code: "PROF-004",
        name: "Dr. Laura Kim",
        email: "laura.kim@example.com",
        department: "Physics",
        phone: "099 556 761",
        status: "Active",
    },
    {
        id: 5,
        professor_code: "PROF-005",
        name: "Dr. Robert Lee",
        email: "robert.lee@example.com",
        department: "Chemistry",
        phone: "093 827 364",
        status: "On Leave",
    },
    {
        id: 6,
        professor_code: "PROF-006",
        name: "Dr. Angela Rivera",
        email: "angela.rivera@example.com",
        department: "Business Administration",
        phone: "087 444 222",
        status: "Active",
    },
    {
        id: 7,
        professor_code: "PROF-007",
        name: "Dr. Samuel Park",
        email: "samuel.park@example.com",
        department: "Information Technology",
        phone: "088 221 113",
        status: "Active",
    },
    {
        id: 8,
        professor_code: "PROF-008",
        name: "Dr. Emily Watson",
        email: "emily.watson@example.com",
        department: "Nursing",
        phone: "016 558 209",
        status: "On Leave",
    },
    {
        id: 9,
        professor_code: "PROF-009",
        name: "Dr. Kevin Brown",
        email: "kevin.brown@example.com",
        department: "Engineering",
        phone: "067 322 111",
        status: "Active",
    },
    {
        id: 10,
        professor_code: "PROF-010",
        name: "Dr. Susan Hart",
        email: "susan.hart@example.com",
        department: "Architecture",
        phone: "077 990 443",
        status: "Active",
    },
    {
        id: 11,
        professor_code: "PROF-011",
        name: "Dr. Patrick Wilson",
        email: "patrick.wilson@example.com",
        department: "Computer Science",
        phone: "015 789 345",
        status: "On Leave",
    },
    {
        id: 12,
        professor_code: "PROF-012",
        name: "Dr. Harriet Moore",
        email: "harriet.moore@example.com",
        department: "Pharmacy",
        phone: "061 233 890",
        status: "Active",
    },
    {
        id: 13,
        professor_code: "PROF-013",
        name: "Dr. Anthony Scott",
        email: "anthony.scott@example.com",
        department: "Literature",
        phone: "099 887 001",
        status: "Active",
    },
    {
        id: 14,
        professor_code: "PROF-014",
        name: "Dr. Kimberly Adams",
        email: "kimberly.adams@example.com",
        department: "Human Resources",
        phone: "097 224 669",
        status: "On Leave",
    },
    {
        id: 15,
        professor_code: "PROF-015",
        name: "Dr. Victor Nguyen",
        email: "victor.nguyen@example.com",
        department: "Management",
        phone: "092 556 710",
        status: "Active",
    },
    {
        id: 16,
        professor_code: "PROF-016",
        name: "Dr. Sophia Turner",
        email: "sophia.turner@example.com",
        department: "Marketing",
        phone: "089 773 442",
        status: "Active",
    },
    {
        id: 17,
        professor_code: "PROF-017",
        name: "Dr. Daniel Cooper",
        email: "daniel.cooper@example.com",
        department: "Education",
        phone: "090 123 776",
        status: "On Leave",
    },
    {
        id: 18,
        professor_code: "PROF-018",
        name: "Dr. Maria Lopez",
        email: "maria.lopez@example.com",
        department: "Psychology",
        phone: "096 889 441",
        status: "Active",
    },
    {
        id: 19,
        professor_code: "PROF-019",
        name: "Dr. Felix Grant",
        email: "felix.grant@example.com",
        department: "Sociology",
        phone: "086 112 908",
        status: "Active",
    },
    {
        id: 20,
        professor_code: "PROF-020",
        name: "Dr. Jasmine Patel",
        email: "jasmine.patel@example.com",
        department: "Biology",
        phone: "085 443 229",
        status: "On Leave",
    },
]);

// Reactive data
const searchQuery = ref('')
const departmentFilter = ref('All')
const statusFilter = ref('All')
const sortOrder = ref('A-Z')
const dialogOpen = ref(false)
const deleteDialog = ref(false)
// explicitly type selectedProfessor as a nullable object to satisfy TypeScript
const selectedProfessor = ref<Record<string, any> | null>(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Form data
const formData = reactive({
    professor_code: '',
    name: '',
    email: '',
    department: '',
    phone: '',
    status: 'Active'
})

// Computed properties
const activeProfessors = computed(() => professors.value.filter(p => p.status === 'Active'))
const onLeaveProfessors = computed(() => professors.value.filter(p => p.status === 'On Leave'))

const filteredProfessors = computed(() => {
    let filtered = [...professors.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(professor =>
            professor.name.toLowerCase().includes(query) ||
            professor.email.toLowerCase().includes(query) ||
            professor.professor_code.toLowerCase().includes(query) ||
            professor.department.toLowerCase().includes(query)
        )
    }

    // Department filter
    if (departmentFilter.value !== 'All') {
        filtered = filtered.filter(professor => professor.department === departmentFilter.value)
    }

    // Status filter
    if (statusFilter.value !== 'All') {
        filtered = filtered.filter(professor => professor.status === statusFilter.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortOrder.value) {
            case 'A-Z':
                return a.name.localeCompare(b.name)
            case 'Z-A':
                return b.name.localeCompare(a.name)
            case 'Department':
                return a.department.localeCompare(b.department)
            default:
                return 0
        }
    })

    return filtered
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredProfessors.value.length / itemsPerPage.value))

const paginatedProfessors = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProfessors.value.slice(start, end)
})

// Options
const departmentOptions = ['All', 'Computer Science', 'Information Technology', 'Mathematics', 'Physics', 'Chemistry', 'Business Administration', 'Nursing', 'Engineering', 'Architecture', 'Pharmacy', 'Literature', 'Human Resources', 'Management', 'Marketing', 'Education', 'Psychology', 'Sociology', 'Biology']
const statusOptions = ['All', 'Active', 'On Leave']
const sortOptions = ['A-Z', 'Z-A', 'Department']

const departmentItems = ['Computer Science', 'Information Technology', 'Mathematics', 'Physics', 'Chemistry', 'Business Administration', 'Nursing', 'Engineering', 'Architecture', 'Pharmacy', 'Literature', 'Human Resources', 'Management', 'Marketing', 'Education', 'Psychology', 'Sociology', 'Biology']
const statusItems = ['Active', 'On Leave']

// Validation rules
const requiredRules = [(v: any) => !!v || 'Field is required']
const codeRules = [
    (v: any) => !!v || 'Professor code is required',
    (v: any) => /^PROF-\d{3}$/.test(v) || 'Professor code must be in format: PROF-001'
]
const nameRules = [
    (v: any) => !!v || 'Name is required',
    (v: any) => v.length >= 3 || 'Name must be at least 3 characters'
]
const emailRules = [
    (v: any) => !!v || 'Email is required',
    (v: any) => /.+@.+\..+/.test(v) || 'Email must be valid'
]
const phoneRules = [
    (v: any) => !!v || 'Phone is required',
    (v: any) => /^\d{3} \d{3} \d{3}$/.test(v) || 'Phone must be in format: 012 345 678'
]

const permissions = reactive({
    add: true,
    edit: true,
    delete: true,
    list: true,
});

// Dialog methods
const openCreateDialog = () => {
    selectedProfessor.value = null
    isEdit.value = false
    resetForm()
    dialogOpen.value = true
}

const openEditDialog = (professor: any) => {
    selectedProfessor.value = professor
    isEdit.value = true
    // Populate form data
    formData.professor_code = professor.professor_code
    formData.name = professor.name
    formData.email = professor.email
    formData.department = professor.department
    formData.phone = professor.phone
    formData.status = professor.status
    dialogOpen.value = true
}

const closeDialog = () => {
    dialogOpen.value = false
    selectedProfessor.value = null
    isEdit.value = false
    resetForm()
}

const resetForm = () => {
    formData.professor_code = ''
    formData.name = ''
    formData.email = ''
    formData.department = ''
    formData.phone = ''
    formData.status = 'Active'
    if (formRef.value) {
        (formRef.value as any).resetValidation()
    }
}

// Form submission
const submitForm = async () => {
    if (!formValid.value) return

    formLoading.value = true

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (isEdit.value && selectedProfessor.value) {
            // Update existing professor
            const index = professors.value.findIndex(p => p.id === selectedProfessor.value!.id)
            // ensure the item exists at that index before accessing it
            const existingProfessor = professors.value[index]
            if (index !== -1 && existingProfessor) {
                professors.value[index] = {
                    id: existingProfessor.id,
                    professor_code: formData.professor_code,
                    name: formData.name,
                    email: formData.email,
                    department: formData.department,
                    phone: formData.phone,
                    status: formData.status
                }
            }
        } else {
            // Create new professor
            const newProfessor = {
                id: Math.max(...professors.value.map(p => p.id)) + 1,
                professor_code: formData.professor_code,
                name: formData.name,
                email: formData.email,
                department: formData.department,
                phone: formData.phone,
                status: formData.status
            }
            professors.value.push(newProfessor)
        }

        closeDialog()
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        formLoading.value = false
    }
}

// CRUD operations
const confirmDelete = (professor: any) => {
    selectedProfessor.value = professor
    deleteDialog.value = true
}

const handleEdit = (id: number | string) => {
    const professor = professors.value.find(p => p.id === id)
    if (professor) {
        openEditDialog(professor)
    }
}

const handleDelete = async () => {
    if (!selectedProfessor.value) return

    deleteLoading.value = true

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        professors.value = professors.value.filter((p) => p.id !== selectedProfessor.value!.id)
        deleteDialog.value = false
        selectedProfessor.value = null
    } catch (error) {
        console.error('Error deleting professor:', error)
    } finally {
        deleteLoading.value = false
    }
}

const handleView = (prof: any) => {
    // Extra behavior if you want
    console.log('Viewing professor:', prof)
}

// Export/Import functions
const handleExportExcel = () => {
    // Implementation for Excel export
    console.log('Exporting professors to Excel...')
}

const handleExportPDF = () => {
    // Implementation for PDF export
    console.log('Exporting professors to PDF...')
}

const handleImportCSV = () => {
    // Implementation for CSV import
    console.log('Importing professors from CSV...')
}

// Pagination methods
const goToPrevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

// Watch for filter changes and reset pagination
watch([searchQuery, departmentFilter, statusFilter, sortOrder], () => {
    currentPage.value = 1
})
</script>

<style scoped>
.professors-page {
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

.professor-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.professor-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
    border-radius: 10px;
}

.professor-details {
    flex: 1;
}

.professor-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.professor-email {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.code-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #1e293b;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 8px;
}

.department-info {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
}

.contact-info {
    text-align: left;
}

.phone {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

/* Status Chip Styles */
.status-chip {
    font-weight: 500 !important;
    text-transform: lowercase !important;
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

.professor-name {
    color: black;
    font-weight: 600;
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
