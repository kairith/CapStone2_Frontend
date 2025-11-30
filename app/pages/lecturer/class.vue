<template>
    <v-container fluid class="pa-6">
        <!-- Header Section -->
        <div class="mb-6">
            <div class="d-flex justify-space-between align-center mb-2">
                <div>
                    <h1 class="text-h4 font-weight-bold mb-2">My Classes</h1>
                    <p class="text-grey">Manage your classes, students, and attendance</p>
                </div>
                <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="openAddClassDialog">
                    Add New Class
                </v-btn>
            </div>
        </div>

        <!-- Filter and Search -->
        <v-card elevation="1" class="mb-6">
            <v-card-text>
                <v-row align="center">
                    <v-col cols="12" md="4">
                        <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search classes..."
                            variant="outlined" density="comfortable" hide-details clearable></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select v-model="filterSemester" :items="semesters" label="Semester" variant="outlined"
                            density="comfortable" hide-details></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select v-model="filterStatus" :items="statusOptions" label="Status" variant="outlined"
                            density="comfortable" hide-details></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-btn color="primary" variant="outlined" block @click="resetFilters">
                            Reset Filters
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Classes Grid/List View -->
        <div class="mb-4">
            <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-h6">
                    {{ filteredClasses.length }} Classes Found
                </div>
                <v-btn-toggle v-model="viewMode" mandatory color="primary" variant="outlined" divided>
                    <v-btn value="grid" icon="mdi-view-grid"></v-btn>
                    <v-btn value="list" icon="mdi-view-list"></v-btn>
                </v-btn-toggle>
            </div>
        </div>

        <!-- Grid View -->
        <v-row v-if="viewMode === 'grid'">
            <v-col v-for="classItem in filteredClasses" :key="classItem.id" cols="12" md="6" lg="4">
                <v-card elevation="2" class="class-card" hover @click="viewClassDetails(classItem)">
                    <div class="class-card-header pa-4" :style="{ background: classItem.color }">
                        <div class="d-flex justify-space-between align-center">
                            <div class="text-white">
                                <div class="text-overline">{{ classItem.code }}</div>
                                <div class="text-h6 font-weight-bold">{{ classItem.subject }}</div>
                            </div>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-vertical" variant="text" color="white" size="small"
                                        v-bind="props" @click.stop></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="editClass(classItem)">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-pencil</v-icon>
                                        </template>
                                        <v-list-item-title>Edit</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="duplicateClass(classItem)">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-content-copy</v-icon>
                                        </template>
                                        <v-list-item-title>Duplicate</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="archiveClass(classItem)">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-archive</v-icon>
                                        </template>
                                        <v-list-item-title>Archive</v-list-item-title>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                    <v-list-item @click="deleteClass(classItem)" class="text-error">
                                        <template v-slot:prepend>
                                            <v-icon color="error">mdi-delete</v-icon>
                                        </template>
                                        <v-list-item-title>Delete</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </div>

                    <v-card-text class="pa-4">
                        <!-- Class Info -->
                        <div class="mb-3">
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" class="mr-2">mdi-account-group</v-icon>
                                <span class="text-body-2">{{ classItem.group }} • {{ classItem.students }}
                                    students</span>
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                                <span class="text-body-2">{{ classItem.schedule }}</span>
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                                <span class="text-body-2">{{ classItem.room }}</span>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div class="mb-3">
                            <div class="d-flex justify-space-between mb-1">
                                <span class="text-caption text-grey">Attendance Rate</span>
                                <span class="text-caption font-weight-bold">{{ classItem.attendance }}%</span>
                            </div>
                            <v-progress-linear :model-value="classItem.attendance"
                                :color="getAttendanceColor(classItem.attendance)" height="6"
                                rounded></v-progress-linear>
                        </div>

                        <!-- Status Badge -->
                        <div class="d-flex justify-space-between align-center">
                            <v-chip :color="classItem.status === 'active' ? 'success' : 'grey'" size="small">
                                {{ classItem.status }}
                            </v-chip>
                            <div class="text-caption text-grey">
                                {{ classItem.semester }}
                            </div>
                        </div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <!-- Quick Actions -->
                    <v-card-actions class="pa-3">
                        <v-btn size="small" variant="text" prepend-icon="mdi-checkbox-marked-circle"
                            @click.stop="takeAttendance(classItem)">
                            Attendance
                        </v-btn>
                        <v-btn size="small" variant="text" prepend-icon="mdi-account-multiple"
                            @click.stop="viewStudents(classItem)">
                            Students
                        </v-btn>
                        <v-btn size="small" variant="text" prepend-icon="mdi-chart-line"
                            @click.stop="viewInsights(classItem)">
                            Insights
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- List View -->
        <v-card v-else elevation="1">
            <v-table>
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Group</th>
                        <th>Schedule</th>
                        <th>Room</th>
                        <th>Students</th>
                        <th>Attendance</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="classItem in filteredClasses" :key="classItem.id" class="table-row"
                        @click="viewClassDetails(classItem)">
                        <td>
                            <div class="d-flex align-center">
                                <div class="color-indicator mr-3" :style="{ background: classItem.color }"></div>
                                <div>
                                    <div class="font-weight-bold">{{ classItem.subject }}</div>
                                    <div class="text-caption text-grey">{{ classItem.code }}</div>
                                </div>
                            </div>
                        </td>
                        <td>{{ classItem.group }}</td>
                        <td>{{ classItem.schedule }}</td>
                        <td>{{ classItem.room }}</td>
                        <td>
                            <v-chip size="small" variant="tonal">{{ classItem.students }}</v-chip>
                        </td>
                        <td>
                            <div class="d-flex align-center" style="min-width: 120px;">
                                <v-progress-linear :model-value="classItem.attendance"
                                    :color="getAttendanceColor(classItem.attendance)" height="6" rounded class="mr-2"
                                    style="max-width: 80px;"></v-progress-linear>
                                <span class="text-caption">{{ classItem.attendance }}%</span>
                            </div>
                        </td>
                        <td>
                            <v-chip :color="classItem.status === 'active' ? 'success' : 'grey'" size="small">
                                {{ classItem.status }}
                            </v-chip>
                        </td>
                        <td>
                            <div class="d-flex align-center">
                                <v-btn icon size="small" variant="text" @click.stop="takeAttendance(classItem)">
                                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                                    <v-tooltip activator="parent" location="top">Take Attendance</v-tooltip>
                                </v-btn>
                                <v-btn icon size="small" variant="text" @click.stop="viewStudents(classItem)">
                                    <v-icon>mdi-account-multiple</v-icon>
                                    <v-tooltip activator="parent" location="top">View Students</v-tooltip>
                                </v-btn>
                                <v-btn icon size="small" variant="text" @click.stop="editClass(classItem)">
                                    <v-icon>mdi-pencil</v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Empty State -->
        <v-card v-if="filteredClasses.length === 0" elevation="1" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1">mdi-google-classroom</v-icon>
            <div class="text-h6 mt-4 mb-2">No Classes Found</div>
            <div class="text-grey mb-4">Start by creating your first class</div>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddClassDialog">
                Add New Class
            </v-btn>
        </v-card>

        <!-- Add/Edit Class Dialog -->
        <v-dialog v-model="classDialog" max-width="800px" persistent>
            <v-card>
                <v-card-title class="pa-4 bg-primary">
                    <span class="text-h6 text-white">{{ editMode ? 'Edit Class' : 'Add New Class' }}</span>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-form ref="classForm">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.subject" label="Subject Name*" variant="outlined"
                                    :rules="[v => !!v || 'Subject name is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.code" label="Course Code*" variant="outlined"
                                    :rules="[v => !!v || 'Course code is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="formData.group" :items="groups" label="Group*" variant="outlined"
                                    :rules="[v => !!v || 'Group is required']"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="formData.semester" :items="semesters" label="Semester*"
                                    variant="outlined" :rules="[v => !!v || 'Semester is required']"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.room" label="Room*" variant="outlined"
                                    :rules="[v => !!v || 'Room is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.schedule" label="Schedule (e.g., Mon/Wed 2-4PM)*"
                                    variant="outlined" :rules="[v => !!v || 'Schedule is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="formData.students" label="Number of Students"
                                    type="number" variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="formData.color" :items="colorOptions" label="Color Theme"
                                    variant="outlined">
                                    <template v-slot:item="{ item, props }">
                                        <v-list-item v-bind="props">
                                            <template v-slot:prepend>
                                                <div class="color-preview mr-2" :style="{ background: item.value }">
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </template>
                                    <template v-slot:selection="{ item }">
                                        <div class="d-flex align-center">
                                            <div class="color-preview mr-2" :style="{ background: item.value }"></div>
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="formData.description" label="Description" variant="outlined"
                                    rows="3" placeholder="Add class description, objectives, or notes..."></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="formData.status" :items="['active', 'inactive']" label="Status"
                                    variant="outlined"></v-select>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="closeClassDialog">Cancel</v-btn>
                    <v-btn color="primary" variant="flat" @click="saveClass">
                        {{ editMode ? 'Save Changes' : 'Add Class' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Class Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="900px">
            <v-card v-if="selectedClass">
                <div class="class-details-header pa-6" :style="{ background: selectedClass.color }">
                    <div class="d-flex justify-space-between align-center text-white">
                        <div>
                            <div class="text-overline">{{ selectedClass.code }}</div>
                            <div class="text-h4 font-weight-bold mb-2">{{ selectedClass.subject }}</div>
                            <div class="text-h6">{{ selectedClass.group }}</div>
                        </div>
                        <v-btn icon="mdi-close" variant="text" color="white" @click="detailsDialog = false"></v-btn>
                    </div>
                </div>

                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Schedule</div>
                                <div class="text-h6 d-flex align-center">
                                    <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                                    {{ selectedClass.schedule }}
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Room</div>
                                <div class="text-h6 d-flex align-center">
                                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                                    {{ selectedClass.room }}
                                </div>
                            </div>
                        </v-col>
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
                                    <div class="text-h4 font-weight-bold">{{ selectedClass.sessions || 24 }}</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"></v-divider>

                    <!-- Quick Actions -->
                    <div class="text-h6 mb-4">Quick Actions</div>
                    <v-row>
                        <v-col cols="6" md="3">
                            <v-btn color="primary" variant="tonal" block prepend-icon="mdi-checkbox-marked-circle"
                                @click="takeAttendance(selectedClass)">
                                Take Attendance
                            </v-btn>
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-btn color="success" variant="tonal" block prepend-icon="mdi-account-multiple"
                                @click="viewStudents(selectedClass)">
                                View Students
                            </v-btn>
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-btn color="info" variant="tonal" block prepend-icon="mdi-chart-line"
                                @click="viewInsights(selectedClass)">
                                View Insights
                            </v-btn>
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-btn color="warning" variant="tonal" block prepend-icon="mdi-file-document"
                                @click="generateReport(selectedClass)">
                                Generate Report
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Confirmation Dialog -->
        <v-dialog v-model="confirmDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h6">Confirm Action</v-card-title>
                <v-card-text>{{ confirmMessage }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
                    <v-btn color="error" variant="flat" @click="confirmAction">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { useClassStore } from '~/stores/useClassStore'
import { useAuthStore } from '~/stores/useAuthStore'

definePageMeta({
    layout: 'lecturer',
    middleware: ['auth', 'role-lecturer']
})

const classStore = useClassStore()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const filterSemester = ref('All Semesters')
const filterStatus = ref('All Status')
const viewMode = ref('grid')
const classDialog = ref(false)
const detailsDialog = ref(false)
const confirmDialog = ref(false)
const editMode = ref(false)
const selectedClass = ref(null)
const confirmMessage = ref('')
const confirmCallback = ref(null)

// Form Data
const formData = ref({
    subject: '',
    code: '',
    group: '',
    semester: '',
    room: '',
    schedule: '',
    students: 0,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '',
    status: 'active'
})

// Options
const semesters = ['All Semesters', 'Fall 2024', 'Spring 2025', 'Summer 2025']
const statusOptions = ['All Status', 'active', 'inactive']
const groups = ['CS-9-G1', 'CS-9-G2', 'CS-10-G1', 'CS-10-G2', 'IT-9-G1', 'IT-10-G1', 'IT-10-G2']
const colorOptions = [
    { title: 'Purple Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Blue Gradient', value: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' },
    { title: 'Green Gradient', value: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' },
    { title: 'Orange Gradient', value: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' },
    { title: 'Red Gradient', value: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)' },
    { title: 'Teal Gradient', value: 'linear-gradient(135deg, #009688 0%, #00695C 100%)' },
]

// Get classes for current lecturer
// TODO: Replace with actual lecturer ID from auth
const currentLecturerId = computed(() => authStore.user?.id || 1)

const classes = computed(() => {
    // Filter classes assigned to this lecturer
    return classStore.classesByLecturer(currentLecturerId.value)
})

// Computed
const filteredClasses = computed(() => {
    let result = classes.value

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c =>
            c.subject.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.group.toLowerCase().includes(query)
        )
    }

    // Filter by semester
    if (filterSemester.value !== 'All Semesters') {
        result = result.filter(c => c.semester === filterSemester.value)
    }

    // Filter by status
    if (filterStatus.value !== 'All Status') {
        result = result.filter(c => c.status === filterStatus.value)
    }

    return result
})

// Methods
const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success'
    if (attendance >= 75) return 'primary'
    if (attendance >= 60) return 'warning'
    return 'error'
}

const openAddClassDialog = () => {
    editMode.value = false
    formData.value = {
        subject: '',
        code: '',
        group: '',
        semester: '',
        room: '',
        schedule: '',
        students: 0,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '',
        status: 'active'
    }
    classDialog.value = true
}

const editClass = (classItem) => {
    editMode.value = true
    selectedClass.value = classItem
    formData.value = { ...classItem }
    classDialog.value = true
}

const closeClassDialog = () => {
    classDialog.value = false
    editMode.value = false
    selectedClass.value = null
}

const saveClass = () => {
    if (editMode.value) {
        const index = classes.value.findIndex(c => c.id === selectedClass.value.id)
        if (index !== -1) {
            classes.value[index] = { ...classes.value[index], ...formData.value }
        }
    } else {
        const newClass = {
            id: classes.value.length + 1,
            ...formData.value,
            attendance: 0,
            sessions: 0
        }
        classes.value.push(newClass)
    }
    closeClassDialog()
}

const viewClassDetails = (classItem) => {
    selectedClass.value = classItem
    detailsDialog.value = true
}

const deleteClass = (classItem) => {
    confirmMessage.value = `Are you sure you want to delete "${classItem.subject}"?`
    confirmCallback.value = () => {
        classes.value = classes.value.filter(c => c.id !== classItem.id)
        confirmDialog.value = false
    }
    confirmDialog.value = true
}

const duplicateClass = (classItem) => {
    const newClass = {
        ...classItem,
        id: classes.value.length + 1,
        subject: `${classItem.subject} (Copy)`,
    }
    classes.value.push(newClass)
}

const archiveClass = (classItem) => {
    confirmMessage.value = `Are you sure you want to archive "${classItem.subject}"?`
    confirmCallback.value = () => {
        const index = classes.value.findIndex(c => c.id === classItem.id)
        if (index !== -1) {
            classes.value[index].status = 'inactive'
        }
        confirmDialog.value = false
    }
    confirmDialog.value = true
}

const confirmAction = () => {
    if (confirmCallback.value) {
        confirmCallback.value()
    }
}

const resetFilters = () => {
    searchQuery.value = ''
    filterSemester.value = 'All Semesters'
    filterStatus.value = 'All Status'
}

const takeAttendance = (classItem) => {
    // Navigate to attendance page or open attendance dialog
    console.log('Take attendance for:', classItem.subject)
}

const viewStudents = (classItem) => {
    // Navigate to students page
    console.log('View students for:', classItem.subject)
}

const viewInsights = (classItem) => {
    // Navigate to insights page
    navigateTo('/lecturer/insights')
}

const generateReport = (classItem) => {
    // Generate and download report
    console.log('Generate report for:', classItem.subject)
}

// Initialize - fetch classes on mount
onMounted(async () => {
    await classStore.fetchClasses()
})
</script>

<style scoped>
.class-card {
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.class-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.class-card-header {
    border-radius: 16px 16px 0 0;
}

.class-details-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.color-indicator {
    width: 4px;
    height: 40px;
    border-radius: 2px;
}

.color-preview {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 2px solid #e0e0e0;
}

.table-row {
    cursor: pointer;
    transition: background-color 0.2s;
}

.table-row:hover {
    background-color: #f5f5f5;
}

.info-item {
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
}
</style>