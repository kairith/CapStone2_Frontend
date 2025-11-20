<template>
    <v-app>
        <v-main>
            <div class="lecturer-dashboard-container">
                <!-- Header Section -->
                <v-row class="mb-6" align="center">
                    <v-col cols="12" class="d-flex justify-space-between align-center">
                        <div>
                            <h1 class="text-h4 font-semibold">Hello, {{ lecturerName }} 👋</h1>
                            <p class="text-subtitle-2 text-grey">{{ currentDate }} | {{ department }}</p>
                        </div>
                        <v-btn color="primary" size="large" prepend-icon="mdi-clock-outline">
                            {{ currentTime }}
                        </v-btn>
                    </v-col>
                </v-row>

                <!-- Quick Stats Cards -->
                <v-row class="mb-6">
                    <v-col cols="12" md="3">
                        <v-card class="stat-card blue-border" elevation="2">
                            <v-card-text class="d-flex align-center justify-space-between">
                                <div>
                                    <div class="text-grey-darken-3 text-h6 font-semibold">Total Classes</div>
                                    <div class="text-h4 font-weight-bold mt-2">{{ totalClasses }}</div>
                                    <div class="text-h8 text-grey-darken-1 mt-2">This semester</div>
                                </div>
                                <v-avatar size="70" color="blue" class="rounded-lg">
                                    <v-icon size="40" color="white">mdi-book-education</v-icon>
                                </v-avatar>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-card class="stat-card green-border" elevation="2">
                            <v-card-text class="d-flex align-center justify-space-between">
                                <div>
                                    <div class="text-grey-darken-3 text-h6 font-weight-medium">Total Students</div>
                                    <div class="text-h4 font-weight-bold mt-2">{{ totalStudents }}</div>
                                    <div class="text-h8 text-grey-darken-1 mt-2">Across all classes</div>
                                </div>
                                <v-avatar size="70" color="green" class="rounded-lg">
                                    <v-icon size="40" color="white">mdi-account-group</v-icon>
                                </v-avatar>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-card class="stat-card orange-border" elevation="2">
                            <v-card-text class="d-flex align-center justify-space-between">
                                <div>
                                    <div class="text-grey-darken-3 text-h6 font-weight-medium">Today's Sessions</div>
                                    <div class="text-h4 font-weight-bold mt-2">{{ todaySessions }}</div>
                                    <div class="text-h8 text-grey-darken-1 mt-2">{{ completedSessions }} completed</div>
                                </div>
                                <v-avatar size="70" color="orange" class="rounded-lg">
                                    <v-icon size="40" color="white">mdi-calendar-today</v-icon>
                                </v-avatar>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-card class="stat-card purple-border" elevation="2">
                            <v-card-text class="d-flex align-center justify-space-between">
                                <div>
                                    <div class="text-grey-darken-3 text-h6 font-weight-medium">Avg Attendance</div>
                                    <div class="text-h4 font-weight-bold mt-2">{{ avgAttendance }}%</div>
                                    <div class="text-h8 text-grey-darken-1 mt-2">This week</div>
                                </div>
                                <v-avatar size="70" color="purple" class="rounded-lg">
                                    <v-icon size="40" color="white">mdi-chart-line</v-icon>
                                </v-avatar>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Today's Schedule and Pending Actions -->
                <v-row class="mb-6">
                    <!-- Today's Classes Schedule -->
                    <v-col cols="12" md="8">
                        <v-card elevation="2">
                            <v-card-title class="d-flex justify-space-between align-center pa-4">
                                <span class="text-h6 font-weight-bold">Today's Schedule</span>
                                <v-chip color="primary" size="small">{{ currentDay }}</v-chip>
                            </v-card-title>
                            <v-card-text>
                                <v-timeline side="end" density="compact">
                                    <v-timeline-item v-for="classItem in todayClasses" :key="classItem.id"
                                        :dot-color="getStatusColor(classItem.status)" size="small">
                                        <template v-slot:opposite>
                                            <div class="text-subtitle-2 font-weight-bold">{{ classItem.time }}</div>
                                        </template>
                                        <v-card :color="classItem.status === 'ongoing' ? 'blue-lighten-5' : ''">
                                            <v-card-text>
                                                <div class="d-flex justify-space-between align-center">
                                                    <div>
                                                        <div class="text-h6 font-weight-bold">{{ classItem.subject }}
                                                        </div>
                                                        <div class="text-body-2 text-grey">
                                                            <v-icon size="small">mdi-account-group</v-icon>
                                                            {{ classItem.group }} | {{ classItem.students }} students
                                                        </div>
                                                        <div class="text-body-2 text-grey">
                                                            <v-icon size="small">mdi-map-marker</v-icon>
                                                            {{ classItem.room }}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <v-chip :color="getStatusColor(classItem.status)" size="small"
                                                            class="mb-2">
                                                            {{ classItem.status }}
                                                        </v-chip>
                                                        <div>
                                                            <v-btn v-if="classItem.status === 'upcoming'"
                                                                color="primary" size="small"
                                                                @click="startClass(classItem)">
                                                                Start Class
                                                            </v-btn>
                                                            <v-btn v-else-if="classItem.status === 'ongoing'"
                                                                color="success" size="small"
                                                                @click="takeAttendance(classItem)">
                                                                Take Attendance
                                                            </v-btn>
                                                            <v-btn v-else color="grey" size="small" variant="text"
                                                                @click="viewClass(classItem)">
                                                                View Details
                                                            </v-btn>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-timeline-item>
                                </v-timeline>

                                <v-alert v-if="todayClasses.length === 0" type="info" variant="tonal" class="mt-4">
                                    No classes scheduled for today
                                </v-alert>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Pending Actions & Leave Requests -->
                    <v-col cols="12" md="4">
                        <!-- Leave Requests -->
                        <v-card elevation="2" class="mb-4">
                            <v-card-title class="d-flex justify-space-between align-center pa-4">
                                <span class="text-h6 font-weight-bold">Leave Requests</span>
                                <v-chip color="warning" size="small">{{ pendingLeaves }}</v-chip>
                            </v-card-title>
                            <v-card-text>
                                <v-list density="compact">
                                    <v-list-item v-for="leave in recentLeaves" :key="leave.id" class="px-0">
                                        <template v-slot:prepend>
                                            <v-avatar :color="leave.status === 'pending' ? 'warning' : 'success'"
                                                size="40">
                                                <span class="text-white">{{ leave.student.charAt(0) }}</span>
                                            </v-avatar>
                                        </template>
                                        <v-list-item-title>{{ leave.student }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ leave.date }} - {{ leave.class }}
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle class="text-caption">
                                            {{ leave.reason }}
                                        </v-list-item-subtitle>
                                        <template v-slot:append>
                                            <div v-if="leave.status === 'pending'" class="d-flex ga-1">
                                                <v-btn icon size="x-small" color="success" @click="approveLeave(leave)">
                                                    <v-icon>mdi-check</v-icon>
                                                </v-btn>
                                                <v-btn icon size="x-small" color="error" @click="rejectLeave(leave)">
                                                    <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                            </div>
                                            <v-chip v-else :color="leave.status === 'approved' ? 'success' : 'error'"
                                                size="x-small">
                                                {{ leave.status }}
                                            </v-chip>
                                        </template>
                                    </v-list-item>
                                </v-list>
                                <v-btn block color="primary" variant="text" class="mt-2" to="/lecturer/leave">
                                    View All Requests
                                </v-btn>
                            </v-card-text>
                        </v-card>

                        <!-- Quick Actions -->
                        <v-card elevation="2">
                            <v-card-title class="pa-4">
                                <span class="text-h6 font-weight-bold">Quick Actions</span>
                            </v-card-title>
                            <v-card-text>
                                <v-list density="compact">
                                    <v-list-item prepend-icon="mdi-clipboard-text" to="/lecturer/insights">
                                        View Insights
                                    </v-list-item>
                                    <v-list-item prepend-icon="mdi-calendar-month" to="/lecturer/schedule">
                                        Full Schedule
                                    </v-list-item>
                                    <v-list-item prepend-icon="mdi-account-multiple" to="/lecturer/students">
                                        All Students
                                    </v-list-item>
                                    <v-list-item prepend-icon="mdi-file-document" to="/lecturer/reports">
                                        Generate Report
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- My Classes Overview -->
                <v-row>
                    <v-col cols="12">
                        <v-card elevation="2">
                            <v-card-title class="d-flex justify-space-between align-center pa-4">
                                <span class="text-h6 font-weight-bold">My Classes Overview</span>
                            </v-card-title>

                            <!-- Filters Section -->
                            <v-card-text class="pb-0">
                                <v-card flat class="mb-4 pa-4 bg-grey-lighten-5">
                                    <div class="d-flex align-center flex-wrap ga-3">
                                        <span class="text-subtitle-2 font-weight-bold">Filters</span>

                                        <!-- Department Filter -->
                                        <v-select v-model="filters.department" :items="departmentOptions"
                                            label="Department" variant="outlined" density="compact" hide-details
                                            style="max-width: 200px" />

                                        <!-- Group Filter -->
                                        <v-select v-model="filters.group" :items="groupOptions" label="Group"
                                            variant="outlined" density="compact" hide-details
                                            style="max-width: 150px" />

                                        <!-- Generation Filter -->
                                        <v-select v-model="filters.generation" :items="generationOptions"
                                            label="Generation" variant="outlined" density="compact" hide-details
                                            style="max-width: 150px" />

                                        <!-- Schedule Day Filter -->
                                        <v-select v-model="filters.scheduleDay" :items="scheduleDayOptions"
                                            label="Schedule Day" variant="outlined" density="compact" hide-details
                                            style="max-width: 150px" />

                                        <!-- Attendance Rate Filter -->
                                        <v-select v-model="filters.attendanceRate" :items="attendanceRateOptions"
                                            label="Attendance Rate" variant="outlined" density="compact" hide-details
                                            style="max-width: 180px" />

                                        <!-- Sort By -->
                                        <v-select v-model="filters.sortBy" :items="sortByOptions" label="Sort By"
                                            variant="outlined" density="compact" hide-details
                                            style="max-width: 180px" />

                                        <!-- Search -->
                                        <v-text-field v-model="classSearch" prepend-inner-icon="mdi-magnify"
                                            placeholder="Search classes..." variant="outlined" density="compact"
                                            hide-details style="max-width: 250px" />

                                        <!-- Reset Button -->
                                        <v-btn variant="text" color="grey" @click="resetFilters">
                                            Reset
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-card-text>

                            <!-- Classes Grid -->
                            <v-card-text>
                                <!-- Results Count -->
                                <div class="text-body-2 text-grey mb-4">
                                    Showing {{ filteredClasses.length }} of {{ myClasses.length }} classes
                                </div>

                                <v-row v-if="filteredClasses.length > 0">
                                    <v-col cols="12" md="6" lg="4" v-for="classItem in filteredClasses"
                                        :key="classItem.id">
                                        <v-card elevation="1" hover @click="viewClassDetails(classItem)">
                                            <v-card-text>
                                                <div class="d-flex justify-space-between align-center mb-3">
                                                    <v-chip :color="classItem.color" size="small" variant="flat"
                                                        class="text-white">
                                                        {{ classItem.code }}
                                                    </v-chip>
                                                    <v-chip size="small" variant="outlined">
                                                        {{ classItem.schedule }}
                                                    </v-chip>
                                                </div>
                                                <div class="text-h6 font-weight-bold mb-2">{{ classItem.subject }}</div>
                                                <div class="text-body-2 text-grey mb-3">
                                                    <v-icon size="small">mdi-account-group</v-icon>
                                                    {{ classItem.group }} | {{ classItem.students }} students
                                                </div>
                                                <v-divider class="my-3"></v-divider>
                                                <div class="d-flex justify-space-between">
                                                    <div>
                                                        <div class="text-caption text-grey">Attendance Rate</div>
                                                        <div class="text-h6 font-weight-bold">{{
                                                            classItem.attendanceRate }}%</div>
                                                    </div>
                                                    <div>
                                                        <div class="text-caption text-grey">Sessions</div>
                                                        <div class="text-h6 font-weight-bold">{{
                                                            classItem.sessionsCompleted }}/{{ classItem.totalSessions
                                                            }}</div>
                                                    </div>
                                                </div>
                                                <v-progress-linear :model-value="classItem.attendanceRate"
                                                    :color="getAttendanceColor(classItem.attendanceRate)" class="mt-3"
                                                    height="6" rounded></v-progress-linear>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <!-- No Results -->
                                <v-alert v-else type="info" variant="tonal" class="mt-4">
                                    No classes found matching your filters. Try adjusting your search criteria.
                                </v-alert>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
definePageMeta({
    layout: false
    // middleware: ['auth', 'role-lecturer']
})

// Lecturer Info
const lecturerName = ref('Dr. CHAN Rithy')
const department = ref('Computer Science Department')

// Current date and time
const currentDate = ref(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}))
const currentTime = ref(new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
}))
const currentDay = ref(new Date().toLocaleDateString('en-US', { weekday: 'long' }))

// Stats
const totalClasses = ref(6)
const totalStudents = ref(245)
const todaySessions = ref(3)
const completedSessions = ref(1)
const avgAttendance = ref(87)
const pendingLeaves = ref(3)

// Search
const classSearch = ref('')

// Filters
const filters = ref({
    department: 'All',
    group: 'All',
    generation: 'All',
    scheduleDay: 'All',
    attendanceRate: 'All',
    sortBy: 'Name (A-Z)'
})

const departmentOptions = ['All', 'Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems']
const groupOptions = ['All', 'CS-9-G1', 'IT-10-G2', 'CS-11-G1', 'SE-11-G3', 'CS-10-G2', 'CS-12-G1']
const generationOptions = ['All', '9', '10', '11', '12']
const scheduleDayOptions = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const attendanceRateOptions = ['All', 'Excellent (≥90%)', 'Good (75-89%)', 'Poor (<75%)']
const sortByOptions = ['Name (A-Z)', 'Name (Z-A)', 'Attendance (High-Low)', 'Attendance (Low-High)', 'Students (Most-Least)', 'Students (Least-Most)']

// Today's Classes
const todayClasses = ref([
    {
        id: 1,
        subject: 'Data Structures & Algorithms',
        code: 'CS201',
        group: 'CS-9-G1',
        time: '08:00 - 10:00',
        room: 'Lab 301',
        students: 42,
        status: 'completed'
    },
    {
        id: 2,
        subject: 'Database Management Systems',
        code: 'CS303',
        group: 'IT-10-G2',
        time: '10:30 - 12:30',
        room: 'Room 205',
        students: 38,
        status: 'ongoing'
    },
    {
        id: 3,
        subject: 'Web Development',
        code: 'CS405',
        group: 'CS-11-G1',
        time: '14:00 - 16:00',
        room: 'Lab 302',
        students: 35,
        status: 'upcoming'
    }
])

// Leave Requests
const recentLeaves = ref([
    {
        id: 1,
        student: 'MEAN Piseth',
        date: 'Nov 01, 2025',
        class: 'CS201',
        reason: 'Medical appointment',
        status: 'pending'
    },
    {
        id: 2,
        student: 'CHIM Vine',
        date: 'Oct 31, 2025',
        class: 'CS303',
        reason: 'Family emergency',
        status: 'pending'
    },
    {
        id: 3,
        student: 'SOK Vathana',
        date: 'Oct 30, 2025',
        class: 'CS405',
        reason: 'Personal matter',
        status: 'approved'
    },
    {
        id: 4,
        student: 'LIM Sreymom',
        date: 'Oct 29, 2025',
        class: 'CS201',
        reason: 'Sick',
        status: 'rejected'
    }
])

// My Classes
const myClasses = ref([
    {
        id: 1,
        subject: 'Data Structures & Algorithms',
        code: 'CS201',
        group: 'CS-9-G1',
        schedule: 'Mon, Wed, Fri',
        students: 42,
        attendanceRate: 88,
        sessionsCompleted: 24,
        totalSessions: 40,
        color: 'blue',
        department: 'Computer Science',
        generation: '9'
    },
    {
        id: 2,
        subject: 'Database Management Systems',
        code: 'CS303',
        group: 'IT-10-G2',
        schedule: 'Mon, Thu',
        students: 38,
        attendanceRate: 92,
        sessionsCompleted: 18,
        totalSessions: 30,
        color: 'green',
        department: 'Information Technology',
        generation: '10'
    },
    {
        id: 3,
        subject: 'Web Development',
        code: 'CS405',
        group: 'CS-11-G1',
        schedule: 'Tue, Fri',
        students: 35,
        attendanceRate: 85,
        sessionsCompleted: 20,
        totalSessions: 35,
        color: 'orange',
        department: 'Computer Science',
        generation: '11'
    },
    {
        id: 4,
        subject: 'Mobile App Development',
        code: 'CS407',
        group: 'SE-11-G3',
        schedule: 'Wed, Thu',
        students: 40,
        attendanceRate: 78,
        sessionsCompleted: 15,
        totalSessions: 30,
        color: 'purple',
        department: 'Software Engineering',
        generation: '11'
    },
    {
        id: 5,
        subject: 'Software Engineering',
        code: 'CS301',
        group: 'CS-10-G2',
        schedule: 'Mon, Wed',
        students: 45,
        attendanceRate: 90,
        sessionsCompleted: 22,
        totalSessions: 35,
        color: 'red',
        department: 'Computer Science',
        generation: '10'
    },
    {
        id: 6,
        subject: 'Artificial Intelligence',
        code: 'CS501',
        group: 'CS-12-G1',
        schedule: 'Tue, Thu',
        students: 45,
        attendanceRate: 94,
        sessionsCompleted: 26,
        totalSessions: 40,
        color: 'indigo',
        department: 'Computer Science',
        generation: '12'
    }
])

// Filtered classes
const filteredClasses = computed(() => {
    let result = myClasses.value

    // Filter by department
    if (filters.value.department !== 'All') {
        result = result.filter(c => c.department === filters.value.department)
    }

    // Filter by group
    if (filters.value.group !== 'All') {
        result = result.filter(c => c.group === filters.value.group)
    }

    // Filter by generation
    if (filters.value.generation !== 'All') {
        result = result.filter(c => c.generation === filters.value.generation)
    }

    // Filter by schedule day
    if (filters.value.scheduleDay !== 'All') {
        const dayMap = {
            'Monday': 'Mon',
            'Tuesday': 'Tue',
            'Wednesday': 'Wed',
            'Thursday': 'Thu',
            'Friday': 'Fri'
        }
        const dayAbbr = dayMap[filters.value.scheduleDay]
        result = result.filter(c => c.schedule.includes(dayAbbr))
    }

    // Filter by attendance rate
    if (filters.value.attendanceRate !== 'All') {
        if (filters.value.attendanceRate === 'Excellent (≥90%)') {
            result = result.filter(c => c.attendanceRate >= 90)
        } else if (filters.value.attendanceRate === 'Good (75-89%)') {
            result = result.filter(c => c.attendanceRate >= 75 && c.attendanceRate < 90)
        } else if (filters.value.attendanceRate === 'Poor (<75%)') {
            result = result.filter(c => c.attendanceRate < 75)
        }
    }

    // Search filter
    if (classSearch.value) {
        result = result.filter(c =>
            c.subject.toLowerCase().includes(classSearch.value.toLowerCase()) ||
            c.code.toLowerCase().includes(classSearch.value.toLowerCase()) ||
            c.group.toLowerCase().includes(classSearch.value.toLowerCase())
        )
    }

    // Sort
    switch (filters.value.sortBy) {
        case 'Name (A-Z)':
            result = [...result].sort((a, b) => a.subject.localeCompare(b.subject))
            break
        case 'Name (Z-A)':
            result = [...result].sort((a, b) => b.subject.localeCompare(a.subject))
            break
        case 'Attendance (High-Low)':
            result = [...result].sort((a, b) => b.attendanceRate - a.attendanceRate)
            break
        case 'Attendance (Low-High)':
            result = [...result].sort((a, b) => a.attendanceRate - b.attendanceRate)
            break
        case 'Students (Most-Least)':
            result = [...result].sort((a, b) => b.students - a.students)
            break
        case 'Students (Least-Most)':
            result = [...result].sort((a, b) => a.students - b.students)
            break
    }

    return result
})

const resetFilters = () => {
    filters.value = {
        department: 'All',
        group: 'All',
        generation: 'All',
        scheduleDay: 'All',
        attendanceRate: 'All',
        sortBy: 'Name (A-Z)'
    }
    classSearch.value = ''
}

// Helper functions
const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return 'success'
        case 'ongoing':
            return 'primary'
        case 'upcoming':
            return 'warning'
        default:
            return 'grey'
    }
}

const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'success'
    if (rate >= 75) return 'warning'
    return 'error'
}

// Actions
const startClass = (classItem) => {
    console.log('Start class:', classItem)
    alert(`Starting class: ${classItem.subject}`)
    // TODO: Navigate to class session page
}

const takeAttendance = (classItem) => {
    console.log('Take attendance:', classItem)
    // TODO: Navigate to attendance page
    alert(`Take attendance for: ${classItem.subject}`)
}

const viewClass = (classItem) => {
    console.log('View class:', classItem)
    // TODO: Navigate to class details page
}

const viewClassDetails = (classItem) => {
    console.log('View class details:', classItem)
    // TODO: Navigate to detailed class page with students, schedule, attendance history
}

const approveLeave = (leave) => {
    leave.status = 'approved'
    pendingLeaves.value--
    alert(`Leave request from ${leave.student} approved`)
}

const rejectLeave = (leave) => {
    leave.status = 'rejected'
    pendingLeaves.value--
    alert(`Leave request from ${leave.student} rejected`)
}

// Update time every minute
onMounted(() => {
    setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }, 60000)
})
</script>

<style scoped>
.lecturer-dashboard-container {
    padding: 24px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.stat-card {
    border-left: 4px solid;
    height: 100%;
    border-radius: 12px;
}

.stat-card.blue-border {
    border-left-color: #2196F3;
}

.stat-card.green-border {
    border-left-color: #4CAF50;
}

.stat-card.orange-border {
    border-left-color: #FF9800;
}

.stat-card.purple-border {
    border-left-color: #9C27B0;
}
</style>