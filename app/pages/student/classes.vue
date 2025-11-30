<template>
    <v-container fluid class="pa-6">
        <!-- Header Section -->
        <div class="page-header mb-6">
            <v-avatar size="48" color="white" class="mr-4">
                <v-icon color="blue" size="32">mdi-school</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
                <h1 class="text-h4 font-weight-bold mb-1 text-white">My Classes</h1>
                <p class="text-white opacity-90">View your enrolled classes and schedules</p>
            </div>
        </div>

        <!-- Stats Cards -->
        <v-row class="mb-6">
            <v-col cols="12" md="3">
                <v-card class="stat-card" elevation="3">
                    <v-card-text class="pa-4">
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div class="text-caption text-grey-darken-1 mb-1">Total Classes</div>
                                <div class="text-h4 font-weight-bold text-blue">{{ enrolledClasses.length }}</div>
                            </div>
                            <v-avatar size="48" color="blue-lighten-5">
                                <v-icon color="blue" size="28">mdi-book-multiple</v-icon>
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
                                <div class="text-h4 font-weight-bold text-green">{{ activeClassesCount }}</div>
                            </div>
                            <v-avatar size="48" color="green-lighten-5">
                                <v-icon color="green" size="28">mdi-checkbox-marked-circle</v-icon>
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
                                <div class="text-caption text-grey-darken-1 mb-1">My Attendance</div>
                                <div class="text-h4 font-weight-bold text-purple">{{ myAttendance }}%</div>
                            </div>
                            <v-avatar size="48" color="purple-lighten-5">
                                <v-icon color="purple" size="28">mdi-chart-line</v-icon>
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
                                <div class="text-caption text-grey-darken-1 mb-1">This Semester</div>
                                <div class="text-h6 font-weight-bold text-orange">{{ currentSemester }}</div>
                            </div>
                            <v-avatar size="48" color="orange-lighten-5">
                                <v-icon color="orange" size="28">mdi-calendar</v-icon>
                            </v-avatar>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Filter Section -->
        <v-card elevation="2" class="mb-6">
            <v-card-text class="pa-4">
                <v-row align="center">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify"
                            label="Search classes by name or code" variant="outlined" density="comfortable" hide-details
                            clearable bg-color="white" color="blue" />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select v-model="filterSemester" :items="semesterOptions" label="Semester" variant="outlined"
                            density="comfortable" hide-details prepend-inner-icon="mdi-calendar" bg-color="white"
                            color="blue" />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select v-model="filterStatus" :items="statusOptions" label="Status" variant="outlined"
                            density="comfortable" hide-details prepend-inner-icon="mdi-toggle-switch" bg-color="white"
                            color="blue" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Classes Grid -->
        <v-row>
            <v-col v-for="classItem in filteredClasses" :key="classItem.id" cols="12" md="6" lg="4">
                <v-card elevation="3" class="class-card" hover @click="viewClassDetails(classItem)">
                    <div class="class-card-header pa-4" :style="{ background: classItem.color }">
                        <div class="d-flex justify-space-between align-center">
                            <div class="text-white">
                                <div class="text-overline">{{ classItem.code }}</div>
                                <div class="text-h6 font-weight-bold">{{ classItem.subject }}</div>
                            </div>
                            <v-chip :color="classItem.status === 'active' ? 'success' : 'grey'" size="small"
                                variant="flat">
                                {{ classItem.status }}
                            </v-chip>
                        </div>
                    </div>

                    <v-card-text class="pa-4">
                        <!-- Lecturer Info -->
                        <div class="mb-3">
                            <div class="d-flex align-center mb-2">
                                <v-avatar size="32" color="blue-grey-lighten-4" class="mr-2">
                                    <v-icon size="20" color="blue-grey">mdi-account-tie</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Lecturer</div>
                                    <div class="text-body-2 font-weight-bold">{{ classItem.lecturerName }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Class Info -->
                        <div class="mb-3">
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" class="mr-2">mdi-calendar-clock</v-icon>
                                <span class="text-body-2">{{ classItem.schedule }}</span>
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                                <span class="text-body-2">{{ classItem.room }}</span>
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" class="mr-2">mdi-account-group</v-icon>
                                <span class="text-body-2">{{ classItem.students }} students</span>
                            </div>
                        </div>

                        <!-- Attendance Progress -->
                        <div class="mb-3">
                            <div class="d-flex justify-space-between mb-1">
                                <span class="text-caption text-grey">Class Attendance</span>
                                <span class="text-caption font-weight-bold">{{ classItem.attendance }}%</span>
                            </div>
                            <v-progress-linear :model-value="classItem.attendance"
                                :color="getAttendanceColor(classItem.attendance)" height="6" rounded />
                        </div>

                        <!-- Semester Badge -->
                        <div class="d-flex justify-space-between align-center">
                            <v-chip size="small" variant="tonal" color="blue">
                                {{ classItem.semester }}
                            </v-chip>
                            <div class="text-caption text-grey">
                                {{ classItem.sessions || 0 }} sessions
                            </div>
                        </div>
                    </v-card-text>

                    <v-divider />

                    <!-- Quick Actions -->
                    <v-card-actions class="pa-3">
                        <v-btn size="small" variant="text" prepend-icon="mdi-information"
                            @click.stop="viewClassDetails(classItem)">
                            Details
                        </v-btn>
                        <v-btn size="small" variant="text" prepend-icon="mdi-chart-box"
                            @click.stop="viewAttendance(classItem)">
                            My Attendance
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="filteredClasses.length === 0">
            <v-col cols="12">
                <v-card elevation="2" class="text-center pa-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-school-outline</v-icon>
                    <div class="text-h6 mt-4 mb-2">No Classes Found</div>
                    <div class="text-grey mb-4">You don't have any enrolled classes matching your filters</div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Class Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="700px">
            <v-card v-if="selectedClass">
                <div class="class-details-header pa-6" :style="{ background: selectedClass.color }">
                    <div class="d-flex justify-space-between align-center text-white">
                        <div>
                            <div class="text-overline">{{ selectedClass.code }}</div>
                            <div class="text-h4 font-weight-bold mb-2">{{ selectedClass.subject }}</div>
                            <div class="text-h6">{{ selectedClass.lecturerName }}</div>
                        </div>
                        <v-btn icon="mdi-close" variant="text" color="white" @click="detailsDialog = false" />
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
                        <v-col cols="12" md="6">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Department</div>
                                <div class="text-h6">{{ selectedClass.department }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Semester</div>
                                <div class="text-h6">{{ selectedClass.semester }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12" v-if="selectedClass.description">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Description</div>
                                <div class="text-body-1">{{ selectedClass.description }}</div>
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
                                    <div class="text-caption mb-1">Class Attendance</div>
                                    <div class="text-h4 font-weight-bold">{{ selectedClass.attendance }}%</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card variant="tonal" color="warning">
                                <v-card-text class="text-center">
                                    <div class="text-caption mb-1">Sessions</div>
                                    <div class="text-h4 font-weight-bold">{{ selectedClass.sessions || 0 }}</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { useClassStore } from '~/stores/useClassStore'
import { useAuthStore } from '~/stores/useAuthStore'

definePageMeta({
    layout: 'student',
    middleware: ['auth', 'role-student']
})

const classStore = useClassStore()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const filterSemester = ref('All')
const filterStatus = ref('All')
const detailsDialog = ref(false)
const selectedClass = ref(null)

// Options
const semesterOptions = ['All', 'Fall 2024', 'Spring 2025', 'Summer 2025']
const statusOptions = ['All', 'active', 'inactive']

// Get student info from auth
// TODO: Replace with actual student data from auth
const studentGroup = computed(() => authStore.user?.group || 'G1')
const studentGeneration = computed(() => authStore.user?.generation || '9')
const currentSemester = computed(() => 'Fall 2024')
const myAttendance = computed(() => 88) // TODO: Calculate from actual attendance data

// Get enrolled classes
const enrolledClasses = computed(() => {
    return classStore.classesByStudent(studentGroup.value, studentGeneration.value)
})

// Computed
const filteredClasses = computed(() => {
    let result = enrolledClasses.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c =>
            c.subject.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.lecturerName.toLowerCase().includes(query)
        )
    }

    // Semester filter
    if (filterSemester.value !== 'All') {
        result = result.filter(c => c.semester === filterSemester.value)
    }

    // Status filter
    if (filterStatus.value !== 'All') {
        result = result.filter(c => c.status === filterStatus.value)
    }

    return result
})

const activeClassesCount = computed(() =>
    enrolledClasses.value.filter(c => c.status === 'active').length
)

// Methods
const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success'
    if (attendance >= 75) return 'primary'
    if (attendance >= 60) return 'warning'
    return 'error'
}

const viewClassDetails = (classItem) => {
    selectedClass.value = classItem
    detailsDialog.value = true
}

const viewAttendance = (classItem) => {
    // Navigate to attendance page with class filter
    navigateTo(`/student/attendance?classId=${classItem.id}`)
}

// Initialize
onMounted(async () => {
    await classStore.fetchClasses()
})
</script>

<style scoped>
.page-header {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
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
    border-radius: 12px 12px 0 0;
}

.info-item {
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
}
</style>
