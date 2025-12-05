<template>
    <div class="students-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-school" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Student Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Students</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ students.length }}</div>
                            <div class="stat-label">Total Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ activeStudentCount }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ inactiveStudentCount }}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ uniqueGenerations }}</div>
                            <div class="stat-label">Generations</div>
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
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-upload" variant="outlined"
                                v-bind="props">
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

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
                        Add Student
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
                            Student Information
                        </h2>
                        <div class="table-subtitle">Manage and organize student records</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify"
                                label="Search students..." variant="outlined" density="compact" hide-details
                                class="search-input" clearable />
                        </div>

                        <v-select v-model="tableSortOrder" :items="tableSortOptions" label="Sort By" variant="outlined"
                            density="compact" hide-details class="sort-select" />

                        <v-btn icon="mdi-filter-variant" variant="outlined" density="comfortable" class="filter-btn"
                            :class="{ 'active': showFilters }" @click="showFilters = !showFilters" />
                    </div>
                </div>

                <!-- Collapsible Filters -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-section">
                        <div class="filters-grid">
                            <div class="filter-item">
                                <label class="filter-label">Generation</label>
                                <v-select v-model="generationFilter" :items="generationOptions" variant="outlined"
                                    density="compact" hide-details clearable />
                            </div>
                            <div class="filter-item">
                                <label class="filter-label">Group</label>
                                <v-select v-model="groupFilter" :items="groupOptions" variant="outlined"
                                    density="compact" hide-details clearable />
                            </div>
                            <div class="filter-item">
                                <label class="filter-label">Specialization</label>
                                <v-select v-model="specializeFilter" :items="specializeOptions" variant="outlined"
                                    density="compact" hide-details clearable />
                            </div>
                            <div class="filter-item">
                                <label class="filter-label">Status</label>
                                <v-select v-model="statusFilter" :items="statusOptions" variant="outlined"
                                    density="compact" hide-details clearable />
                            </div>
                            <div class="filter-item">
                                <label class="filter-label" style="opacity: 0;">Actions</label>
                                <v-btn class="reset-btn" prepend-icon="mdi-refresh" variant="outlined" block @click="resetFilters">
                                    Reset
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-expand-transition>

                <!-- Modern Table -->
                <!-- Modern Table -->
                <div class="modern-table-wrapper">
                    <v-table class="modern-table">
                        <thead>
                            <tr class="modern-header-row">
                                <th class="modern-header-cell id-column">
                                    <div class="header-content">#</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Student Name</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Student ID</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Generation</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Group</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Specialization</div>
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
                            <tr v-for="(student, index) in paginatedStudents" :key="student.id"
                                class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <span class="">{{ index + 1 }}</span>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="group-info">
                                        <!-- <v-avatar size="36" class="group-avatar" color="green">
                                            <span class="text-white text-subtitle-2 font-weight-medium">
                                                {{ student.name.charAt(0) }}
                                            </span>
                                        </v-avatar> -->
                                        <div class="group-details">
                                            <div class="group-name">{{ student.name }}</div>
                                            <div class="group-meta">{{ student.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <span class="">{{ student.studentId }}</span>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip size="small" variant="tonal" color="">
                                        Gen {{ student.generation }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip size="small" variant="tonal" color="">
                                        {{ student.group }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip size="small" variant="tonal" color="">
                                        {{ student.specialize }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="student.status === 'Active' ? 'success' : 'warning'"
                                        class="status-chip" size="small">
                                        <v-icon start size="16">mdi-check-circle</v-icon>
                                        {{ student.status === 'Active' ? 'active' : 'on leave' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="openEditDialog(student)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(student)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-if="filteredStudents.length === 0">
                                <td colspan="8" class="modern-table-cell">
                                    <div class="empty-state">
                                        <v-icon size="64" color="grey-lighten-1">mdi-school-outline</v-icon>
                                        <p class="empty-title">No students found</p>
                                        <p class="empty-subtitle">Try adjusting your filters or add a new student</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Pagination Footer -->
                    <div v-if="filteredStudents.length > 0" class="pagination-section">
                        <v-btn variant="outlined" :disabled="currentPage === 1" @click="goToPrevPage"
                            class="pagination-btn">
                            Previous
                        </v-btn>

                        <div class="pagination-info">
                            <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
                        </div>

                        <v-btn variant="outlined" :disabled="currentPage >= totalPages" @click="goToNextPage"
                            class="pagination-btn">
                            Next
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="700" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" :color="isEdit ? 'warning' : 'primary'"
                                size="28" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Student' : 'Add New Student' }}</h2>
                            <p class="dialog-subtitle">
                                {{ isEdit ? 'Update student information' : 'Fill in the student details below' }}
                            </p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <v-card-text class="dialog-content">
                    <v-form ref="formRef" v-model="formValid">
                        <div class="form-group">
                            <label class="form-label">Student ID *</label>
                            <v-text-field v-model="formData.studentId" :rules="studentIdRules" variant="outlined"
                                density="comfortable" placeholder="e.g., IDTB090121" class="form-field" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <v-text-field v-model="formData.name" :rules="nameRules" variant="outlined"
                                density="comfortable" placeholder="Enter student full name" class="form-field" />
                        </div>

                        <v-row>
                            <v-col cols="6">
                                <div class="form-group">
                                    <label class="form-label">Email *</label>
                                    <v-text-field v-model="formData.email" :rules="emailRules" variant="outlined"
                                        density="comfortable" placeholder="student@example.com" class="form-field" />
                                </div>
                            </v-col>
                            <v-col cols="6">
                                <div class="form-group">
                                    <label class="form-label">Phone</label>
                                    <v-text-field v-model="formData.phone" variant="outlined" density="comfortable"
                                        placeholder="+855 12 345 678" class="form-field" />
                                </div>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <div class="form-group">
                                    <label class="form-label">Generation *</label>
                                    <v-select v-model="formData.generation" :items="['9', '10', '11', '12']"
                                        :rules="generationRules" variant="outlined" density="comfortable"
                                        class="form-field" />
                                </div>
                            </v-col>
                            <v-col cols="6">
                                <div class="form-group">
                                    <label class="form-label">Gender *</label>
                                    <v-select v-model="formData.gender" :items="['M', 'F']" :rules="genderRules"
                                        variant="outlined" density="comfortable" class="form-field" />
                                </div>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <div class="form-group">
                                    <label class="form-label">Group *</label>
                                    <v-select v-model="formData.group" :items="['G1', 'G2', 'G3', 'G4']"
                                        :rules="groupRules" variant="outlined" density="comfortable"
                                        class="form-field" />
                                </div>
                            </v-col>
                            <v-col cols="6">
                                <div class="form-group">
                                    <label class="form-label">Specialization *</label>
                                    <v-select v-model="formData.specialize" :items="['CS', 'IT', 'IS', 'SE']"
                                        :rules="specializeRules" variant="outlined" density="comfortable"
                                        class="form-field" />
                                </div>
                            </v-col>
                        </v-row>

                        <div class="form-group">
                            <div class="switch-container">
                                <v-switch v-model="formData.active" color="primary" hide-details>
                                    <template v-slot:label>
                                        <div class="switch-info">
                                            <span class="form-label">Active Status</span>
                                            <span class="switch-description">Student is currently active</span>
                                        </div>
                                    </template>
                                </v-switch>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="closeDialog" class="action-btn cancel-btn"
                        :disabled="formLoading">
                        <v-icon start>mdi-close</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="submitForm"
                        :loading="formLoading" :disabled="!formValid" class="action-btn submit-btn">
                        <v-icon start>mdi-content-save</v-icon>
                        {{ isEdit ? 'Save Changes' : 'Create Student' }}
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
                        <v-icon icon="mdi-alert-circle" color="error" size="48" />
                    </div>
                    <h2 class="delete-title">Delete Student Record</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert" color="warning" size="24" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                Are you sure you want to delete
                                <strong class="student-name">{{ selectedStudent?.name }}</strong>?
                            </p>
                            <p class="warning-details">
                                All associated data will be permanently removed from the system.
                            </p>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Delete Actions -->
                <v-card-actions class="delete-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false"
                        :disabled="deleteLoading" class="action-btn cancel-btn">
                        <v-icon start>mdi-close</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading"
                        class="action-btn delete-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete Record
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
})

// Reactive data
const showFilters = ref(false)
const dialogOpen = ref(false)
const deleteDialog = ref(false)
const selectedStudent = ref(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

// Search and filters
const searchQuery = ref('')
const statusFilter = ref('All')
const generationFilter = ref('All')
const groupFilter = ref('All')
const specializeFilter = ref('All')
const tableSortOrder = ref('A-Z')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Form data
const formData = reactive({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    generation: '',
    group: '',
    specialize: '',
    active: true
})

// Validation rules
const studentIdRules = [
    v => !!v || 'Student ID is required',
    v => (v && v.length >= 5) || 'Student ID must be at least 5 characters'
]

const nameRules = [
    v => !!v || 'Name is required',
    v => (v && v.length >= 2) || 'Name must be at least 2 characters'
]

const emailRules = [
    v => !!v || 'Email is required',
    v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const generationRules = [v => !!v || 'Generation is required']
const genderRules = [v => !!v || 'Gender is required']
const groupRules = [v => !!v || 'Group is required']
const specializeRules = [v => !!v || 'Specialization is required']

// Filter options
const generationOptions = ['All', '9', '10', '11', '12']
const groupOptions = ['All', 'G1', 'G2', 'G3', 'G4']
const specializeOptions = ['All', 'CS', 'IT', 'IS', 'SE']
const statusOptions = ['All', 'Active', 'Inactive']
const tableSortOptions = ['A-Z', 'Z-A', 'Gen 9', 'Gen 10', 'Gen 11', 'Gen 12']

// Student data
const students = ref([
    { id: 1, name: 'MEAN Piseth', email: 'piseth@example.com', phone: '+855 12 345 678', gender: 'M', dob: 'Sep 01, 2004', studentId: 'IDTB090121', generation: '9', group: 'G1', specialize: 'CS', status: 'Active' },
    { id: 2, name: 'CHIM Vine', email: 'vine@example.com', phone: '+855 12 345 679', gender: 'M', dob: 'Aug 15, 2004', studentId: 'IDTB090122', generation: '9', group: 'G1', specialize: 'IT', status: 'Active' },
    { id: 3, name: 'SOK Vathana', email: 'vathana@example.com', phone: '+855 12 345 680', gender: 'M', dob: 'Jul 20, 2004', studentId: 'IDTB090123', generation: '9', group: 'G2', specialize: 'CS', status: 'Active' },
    { id: 4, name: 'LIM Sreymom', email: 'sreymom@example.com', phone: '+855 12 345 681', gender: 'F', dob: 'Jun 10, 2004', studentId: 'IDTB090124', generation: '10', group: 'G1', specialize: 'SE', status: 'Inactive' },
    { id: 5, name: 'KONG Sophea', email: 'sophea@example.com', phone: '+855 12 345 682', gender: 'F', dob: 'May 05, 2004', studentId: 'IDTB090125', generation: '10', group: 'G2', specialize: 'IS', status: 'Active' },
])

// Computed filtered students
const filteredStudents = computed(() => {
    let filtered = [...students.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query) ||
            s.studentId.toLowerCase().includes(query)
        )
    }

    // Status filter
    if (statusFilter.value !== 'All') {
        filtered = filtered.filter(s => s.status === statusFilter.value)
    }

    // Generation filter
    if (generationFilter.value !== 'All') {
        filtered = filtered.filter(s => s.generation === generationFilter.value)
    }

    // Group filter
    if (groupFilter.value !== 'All') {
        filtered = filtered.filter(s => s.group === groupFilter.value)
    }

    // Specialization filter
    if (specializeFilter.value !== 'All') {
        filtered = filtered.filter(s => s.specialize === specializeFilter.value)
    }

    // Sort
    filtered.sort((a, b) => {
        if (tableSortOrder.value === 'Z-A') {
            return b.name.localeCompare(a.name)
        } else if (tableSortOrder.value.startsWith('Gen')) {
            const gen = tableSortOrder.value.split(' ')[1]
            return a.generation === gen ? -1 : b.generation === gen ? 1 : 0
        }
        return a.name.localeCompare(b.name)
    })

    return filtered
})

// Computed stats
const activeStudentCount = computed(() => {
    return students.value.filter(s => s.status === 'Active').length
})

const inactiveStudentCount = computed(() => {
    return students.value.filter(s => s.status === 'Inactive').length
})

const uniqueGenerations = computed(() => {
    const uniqueGens = new Set(students.value.map(s => s.generation))
    return uniqueGens.size
})

const gen9Count = computed(() => {
    return students.value.filter(s => s.generation === '9').length
})

const gen10Count = computed(() => {
    return students.value.filter(s => s.generation === '10').length
})

// Pagination computed
const totalPages = computed(() => {
    return Math.ceil(filteredStudents.value.length / itemsPerPage.value)
})

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredStudents.value.slice(start, end)
})

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

// Filter methods
const resetFilters = () => {
    statusFilter.value = 'All'
    generationFilter.value = 'All'
    groupFilter.value = 'All'
    specializeFilter.value = 'All'
    currentPage.value = 1
}

// Dialog methods
const openCreateDialog = () => {
    selectedStudent.value = null
    isEdit.value = false
    formData.studentId = ''
    formData.name = ''
    formData.email = ''
    formData.phone = ''
    formData.gender = ''
    formData.generation = ''
    formData.group = ''
    formData.specialize = ''
    formData.active = true
    dialogOpen.value = true
}

const openEditDialog = (student) => {
    selectedStudent.value = student
    isEdit.value = true
    formData.studentId = student.studentId
    formData.name = student.name
    formData.email = student.email
    formData.phone = student.phone
    formData.gender = student.gender
    formData.generation = student.generation
    formData.group = student.group
    formData.specialize = student.specialize
    formData.active = student.status === 'Active'
    dialogOpen.value = true
}

const closeDialog = () => {
    dialogOpen.value = false
    selectedStudent.value = null
    isEdit.value = false
}

// Form submission
const submitForm = async () => {
    if (!formValid.value) return

    formLoading.value = true

    try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (isEdit.value && selectedStudent.value) {
            const index = students.value.findIndex(s => s.id === selectedStudent.value.id)
            if (index > -1) {
                students.value[index] = {
                    ...students.value[index],
                    studentId: formData.studentId,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender,
                    generation: formData.generation,
                    group: formData.group,
                    specialize: formData.specialize,
                    status: formData.active ? 'Active' : 'Inactive'
                }
            }
        } else {
            const newStudent = {
                id: students.value.length + 1,
                studentId: formData.studentId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                dob: '',
                generation: formData.generation,
                group: formData.group,
                specialize: formData.specialize,
                status: formData.active ? 'Active' : 'Inactive'
            }
            students.value.push(newStudent)
        }

        closeDialog()
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        formLoading.value = false
    }
}

// CRUD operations
const confirmDelete = (student) => {
    selectedStudent.value = student
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedStudent.value) return

    deleteLoading.value = true

    try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const index = students.value.findIndex(s => s.id === selectedStudent.value.id)
        if (index > -1) {
            students.value.splice(index, 1)
        }

        deleteDialog.value = false
        selectedStudent.value = null
    } catch (error) {
        console.error('Error deleting student:', error)
    } finally {
        deleteLoading.value = false
    }
}
</script>

<style scoped>
.students-page {
    background: #f5f5f5;
    min-height: 100vh;
    padding: 0;
}

/* Modern Header Styles */
.modern-header {
    background: white;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: none;
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
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e0e0e0;
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

.filters-section {
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    align-items: end;
}

.filter-item {
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

.reset-btn {
    height: 36px;
    text-transform: none;
    font-weight: 500;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.reset-btn:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
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
}

.modern-table-row {
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #f0f0f0;
}

.modern-table-row:hover {
    background: #fafafa;
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
    width: 36px;
    height: 36px;
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
    color: #1e293b;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 8px;
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
    background: #fef3c7;
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

.student-name {
    color: black;
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

/* Status Chip Styles */
.status-chip {
    font-weight: 500 !important;
    text-transform: lowercase !important;
    border-radius: 16px !important;
    padding: 0 12px !important;
    height: 28px !important;
}

/* Pagination Styles */
.pagination-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 12px;
    border-top: 1px solid #e0e0e0;
}

.pagination-btn {
    min-width: 90px;
    height: 36px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    color: #666;
    letter-spacing: 0;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
}

.pagination-btn:disabled {
    opacity: 0.3;
    background: #fafafa;
}

.pagination-info {
    padding: 0 20px;
}

.pagination-text {
    font-size: 14px;
    color: #666;
    font-weight: 500;
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

    .filters-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
