<template>
    <v-app>
        <v-main>
            <div class="class-management-container">
                <!-- Page Header -->
                <div class="page-header mb-6">
                    <v-avatar size="48" color="white" class="mr-4">
                        <v-icon color="indigo" size="32">mdi-google-classroom</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                        <h1 class="text-h5 font-weight-bold mb-1">Class Management</h1>
                        <p class="text-body-2 text-grey-darken-1">Create and manage classes for lecturers and
                            students</p>
                    </div>
                    <v-btn color="indigo" prepend-icon="mdi-plus" size="large" class="text-none elevation-2"
                        @click="openAddDialog">
                        Add New Class
                    </v-btn>
                </div>

                <!-- Statistics Cards -->
                <v-row class="mb-6">
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="3">
                            <v-card-text class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey-darken-1 mb-1">Total Classes</div>
                                        <div class="text-h4 font-weight-bold text-indigo">{{ allClasses.length }}</div>
                                    </div>
                                    <v-avatar size="48" color="indigo-lighten-5">
                                        <v-icon color="indigo" size="28">mdi-school</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="3">
                            <v-card-text class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey-darken-1 mb-1">Active Classes</div>
                                        <div class="text-h4 font-weight-bold text-blue">{{ activeClassesCount }}</div>
                                    </div>
                                    <v-avatar size="48" color="blue-lighten-5">
                                        <v-icon color="blue" size="28">mdi-checkbox-marked-circle</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="3">
                            <v-card-text class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey-darken-1 mb-1">Total Students</div>
                                        <div class="text-h4 font-weight-bold text-green">{{ totalStudents }}</div>
                                    </div>
                                    <v-avatar size="48" color="green-lighten-5">
                                        <v-icon color="green" size="28">mdi-account-group</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="3">
                            <v-card-text class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey-darken-1 mb-1">Avg Attendance</div>
                                        <div class="text-h4 font-weight-bold text-purple">{{ avgAttendance }}%</div>
                                    </div>
                                    <v-avatar size="48" color="purple-lighten-5">
                                        <v-icon color="purple" size="28">mdi-chart-line</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Filter Card -->
                <v-card elevation="2" class="mb-6 filter-card">
                    <v-card-title class="bg-grey-lighten-4 py-4">
                        <v-icon class="mr-2" color="indigo">mdi-filter-variant</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">Filter Classes</span>
                    </v-card-title>
                    <v-card-text class="pa-5">
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify"
                                    label="Search by name or code" variant="outlined" density="comfortable" hide-details
                                    bg-color="white" color="indigo" clearable />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-select v-model="filterYear" :items="yearOptions" label="Year" variant="outlined"
                                    density="comfortable" hide-details prepend-inner-icon="mdi-calendar-today"
                                    bg-color="white" color="indigo" />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-select v-model="filterTerm" :items="termOptions" label="Term" variant="outlined"
                                    density="comfortable" hide-details prepend-inner-icon="mdi-calendar-month"
                                    bg-color="white" color="indigo" />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-select v-model="filterClassType" :items="classTypeOptions" label="Class Type"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-book-open-variant" bg-color="white" color="indigo" />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-btn color="grey-darken-1" variant="outlined" block size="large"
                                    @click="resetFilters">
                                    Reset
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row class="mt-2">
                            <v-col cols="12" md="2">
                                <v-select v-model="filterStatus" :items="statusOptions" label="Status"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-toggle-switch" bg-color="white" color="indigo" />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-select v-model="filterGeneration" :items="generationOptions" label="Generation"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-school" bg-color="white" color="indigo" />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-select v-model="filterDepartment" :items="departmentOptions" label="Department"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-domain" bg-color="white" color="indigo" />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <!-- Data Table -->
                <v-card elevation="2">
                    <v-card-title class="table-header pa-4">
                        <div class="d-flex align-center justify-space-between w-100">
                            <span class="text-white font-weight-bold">Classes List ({{ filteredClasses.length }})</span>
                            <v-btn variant="text" color="white" prepend-icon="mdi-refresh" @click="refreshData">
                                Refresh
                            </v-btn>
                        </div>
                    </v-card-title>

                    <v-data-table :headers="headers" :items="filteredClasses" :items-per-page="10"
                        :loading="classStore.loading" class="elevation-0">
                        <!-- Subject Column -->
                        <template v-slot:item.subject="{ item }">
                            <div class="py-2">
                                <div class="font-weight-bold">{{ item.subject }}</div>
                                <div class="text-caption text-grey">{{ item.code }}</div>
                            </div>
                        </template>

                        <!-- Lecturer Column -->
                        <template v-slot:item.lecturerName="{ item }">
                            <div class="d-flex align-center">
                                <v-avatar size="32" color="blue-grey-lighten-4" class="mr-2">
                                    <v-icon size="20" color="blue-grey">mdi-account</v-icon>
                                </v-avatar>
                                <span>{{ item.lecturerName }}</span>
                            </div>
                        </template>

                        <!-- Class Type Column -->
                        <template v-slot:item.classType="{ item }">
                            <v-chip size="small" :color="getClassTypeColor(item.classType)" variant="tonal">
                                {{ item.classType }}
                            </v-chip>
                        </template>

                        <!-- Year/Term Column -->
                        <template v-slot:item.year="{ item }">
                            <v-chip size="small" color="indigo" variant="tonal">
                                Y{{ item.year }}/T{{ item.term }}
                            </v-chip>
                        </template>

                        <!-- Group/Generation Column -->
                        <template v-slot:item.group="{ item }">
                            <v-chip size="small" color="blue" variant="tonal">
                                Gen {{ item.generation }} - {{ item.group }}
                            </v-chip>
                        </template>

                        <!-- Schedule Column -->
                        <template v-slot:item.schedule="{ item }">
                            <div class="text-body-2">
                                <div>{{ item.schedule }}</div>
                                <div class="text-caption text-grey">{{ item.room }}</div>
                            </div>
                        </template>

                        <!-- Students Column -->
                        <template v-slot:item.students="{ item }">
                            <v-chip size="small" variant="tonal" color="green">
                                {{ item.students }} students
                            </v-chip>
                        </template>

                        <!-- Attendance Column -->
                        <template v-slot:item.attendance="{ item }">
                            <div style="min-width: 100px;">
                                <div class="text-caption mb-1">{{ item.attendance }}%</div>
                                <v-progress-linear :model-value="item.attendance"
                                    :color="getAttendanceColor(item.attendance)" height="6" rounded />
                            </div>
                        </template>

                        <!-- Status Column -->
                        <template v-slot:item.status="{ item }">
                            <v-chip :color="item.status === 'active' ? 'success' : 'grey'" size="small" variant="flat">
                                <v-icon start size="14">{{ item.status === 'active' ? 'mdi-check-circle' :
                                    'mdi-close-circle' }}</v-icon>
                                {{ item.status }}
                            </v-chip>
                        </template>

                        <!-- Actions Column -->
                        <template v-slot:item.actions="{ item }">
                            <div class="d-flex align-center gap-1">
                                <v-btn icon size="small" variant="text" color="blue" @click="viewClass(item)">
                                    <v-icon>mdi-eye</v-icon>
                                    <v-tooltip activator="parent" location="top">View Details</v-tooltip>
                                </v-btn>
                                <v-btn icon size="small" variant="text" color="orange" @click="editClass(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
                                <v-btn icon size="small" variant="text" color="red" @click="deleteClass(item)">
                                    <v-icon>mdi-delete</v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>
                            </div>
                        </template>

                        <!-- No Data -->
                        <template v-slot:no-data>
                            <div class="text-center pa-8">
                                <v-icon size="64" color="grey-lighten-1">mdi-google-classroom</v-icon>
                                <div class="text-h6 mt-4 mb-2">No Classes Found</div>
                                <div class="text-grey mb-4">Start by creating your first class</div>
                                <v-btn color="indigo" prepend-icon="mdi-plus" @click="openAddDialog">
                                    Add New Class
                                </v-btn>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Add/Edit Dialog -->
                <v-dialog v-model="dialog" max-width="900px" persistent>
                    <v-card>
                        <v-card-title class="dialog-header pa-4">
                            <div class="d-flex align-center text-white">
                                <v-icon class="mr-2" color="white">{{ editMode ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
                                <span class="text-h6">{{ editMode ? 'Edit Class' : 'Add New Class' }}</span>
                            </div>
                        </v-card-title>

                        <v-card-text class="pa-6">
                            <ClassForm :initial-data="editMode ? selectedClass : null" :is-edit-mode="editMode"
                                @save="handleSave" @cancel="closeDialog" />
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <!-- View Details Dialog -->
                <v-dialog v-model="viewDialog" max-width="800px">
                    <v-card v-if="selectedClass">
                        <div class="class-details-header pa-6" :style="{ background: selectedClass.color }">
                            <div class="d-flex justify-space-between align-center text-white">
                                <div>
                                    <div class="text-overline">{{ selectedClass.code }}</div>
                                    <div class="text-h4 font-weight-bold mb-2">{{ selectedClass.subject }}</div>
                                    <div class="text-h6">Gen {{ selectedClass.generation }} - {{ selectedClass.group }}
                                    </div>
                                </div>
                                <v-btn icon="mdi-close" variant="text" color="white" @click="viewDialog = false" />
                            </div>
                        </div>

                        <v-card-text class="pa-6">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Lecturer</div>
                                        <div class="text-h6">{{ selectedClass.lecturerName }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Department</div>
                                        <div class="text-h6">{{ selectedClass.department }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Class Type</div>
                                        <div class="text-h6">{{ selectedClass.classType }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Year</div>
                                        <div class="text-h6">Year {{ selectedClass.year }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Term</div>
                                        <div class="text-h6">Term {{ selectedClass.term }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Schedule</div>
                                        <div class="text-h6">{{ selectedClass.schedule }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Room</div>
                                        <div class="text-h6">{{ selectedClass.room }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12">
                                    <div class="info-item mb-4">
                                        <div class="text-caption text-grey mb-1">Description</div>
                                        <div class="text-body-1">{{ selectedClass.description || 'No description' }}
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row class="mt-4">
                                <v-col cols="12" md="4">
                                    <v-card variant="tonal" color="primary">
                                        <v-card-text class="text-center">
                                            <div class="text-caption mb-1">Total Students</div>
                                            <div class="text-h4 font-weight-bold">{{ selectedClass.students }}</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card variant="tonal" color="success">
                                        <v-card-text class="text-center">
                                            <div class="text-caption mb-1">Attendance Rate</div>
                                            <div class="text-h4 font-weight-bold">{{ selectedClass.attendance }}%</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card variant="tonal" color="warning">
                                        <v-card-text class="text-center">
                                            <div class="text-caption mb-1">Sessions</div>
                                            <div class="text-h4 font-weight-bold">{{ selectedClass.sessions || 0 }}
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <!-- Delete Confirmation Dialog -->
                <v-dialog v-model="deleteDialog" max-width="400px">
                    <v-card>
                        <v-card-title class="text-h6 pa-4">Confirm Delete</v-card-title>
                        <v-card-text class="pa-4">
                            Are you sure you want to delete <strong>{{ selectedClass?.subject }}</strong>? This action
                            cannot be undone.
                        </v-card-text>
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
                            <v-btn color="error" variant="flat" @click="confirmDelete">Delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
import { useClassStore } from '~/stores/useClassStore'
import ClassForm from '~/components/admin/ClassForm.vue'

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'role-admin']
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

// Options
const yearOptions = ['All', '1', '2', '3', '4']
const termOptions = ['All', '1', '2']
const classTypeOptions = ['All', 'Theory Class', 'Lab Class', 'Seminar', 'Workshop', 'Capstone Project']
const statusOptions = ['All', 'active', 'inactive']
const generationOptions = ['All', '9', '10', '11', '12']
const departmentOptions = ['All', 'Computer Science', 'Information Technology']

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

// Initialize
onMounted(async () => {
    await classStore.fetchClasses()
})
</script>

<style scoped>
.class-management-container {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    background: linear-gradient(135deg, #3949AB 0%, #5C6BC0 100%);
    padding: 24px;
    border-radius: 12px;
    color: white;
    display: flex;
    align-items: center;
}

.stat-card {
    border-radius: 12px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.filter-card {
    border-radius: 12px;
}

.table-header {
    background: linear-gradient(135deg, #3949AB 0%, #5C6BC0 100%);
}

.dialog-header {
    background: linear-gradient(135deg, #3949AB 0%, #5C6BC0 100%);
}

.class-details-header {
    border-radius: 12px 12px 0 0;
}

.info-item {
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
}
</style>