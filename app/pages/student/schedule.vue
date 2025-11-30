<template>
    <v-container fluid class="schedule-container pa-4">
        <!-- Header -->
        <div class="mb-4">
            <h1 class="text-h5 font-weight-bold mb-2">My Class Schedule</h1>
            <p class="text-body-2 text-grey-darken-1">View your weekly class schedule and upcoming sessions</p>
        </div>

        <!-- Date Navigation -->
        <v-card class="mb-4" elevation="1">
            <v-card-text class="pa-3">
                <div class="d-flex align-center justify-space-between flex-wrap ga-2">
                    <div class="d-flex align-center ga-2">
                        <v-btn icon size="small" variant="text" @click="previousWeek">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <div class="text-center">
                            <div class="text-subtitle-2 font-weight-bold">{{ currentWeekText }}</div>
                            <div class="text-caption text-grey">{{ weekDateRange }}</div>
                        </div>
                        <v-btn icon size="small" variant="text" @click="nextWeek">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>
                    <v-btn variant="outlined" size="small" @click="goToToday">
                        Today
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>

        <!-- Today's Classes (Mobile Priority) -->
        <v-card class="mb-4" elevation="1">
            <v-card-title class="d-flex align-center justify-space-between pa-3">
                <span class="text-subtitle-1 font-weight-bold">Today's Classes</span>
                <v-chip size="small" variant="outlined">{{ todaysClasses.length }} classes</v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-3">
                <div v-if="todaysClasses.length === 0" class="text-center py-8">
                    <v-icon size="48" color="grey-lighten-1">mdi-calendar-blank</v-icon>
                    <p class="text-body-2 text-grey mt-2">No classes scheduled for today</p>
                </div>
                <div v-else class="d-flex flex-column ga-3">
                    <v-card v-for="classItem in todaysClasses" :key="classItem.id" elevation="0" border
                        :class="{ 'class-card-active': classItem.status === 'In Progress' }">
                        <v-card-text class="pa-3">
                            <div class="d-flex justify-space-between align-start mb-2">
                                <div class="flex-grow-1">
                                    <div class="text-subtitle-2 font-weight-bold mb-1">{{ classItem.subject }}</div>
                                    <div class="text-caption text-grey-darken-1">
                                        <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                                        {{ classItem.time }}
                                    </div>
                                </div>
                                <v-chip :color="getStatusColor(classItem.status)" size="small" variant="flat">
                                    {{ classItem.status }}
                                </v-chip>
                            </div>
                            <div class="d-flex flex-column ga-1 text-caption">
                                <div>
                                    <v-icon size="14" class="mr-1">mdi-account</v-icon>
                                    {{ classItem.lecturer }}
                                </div>
                                <div>
                                    <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                                    {{ classItem.room }}
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>

        <!-- Weekly Schedule -->
        <v-card elevation="1">
            <v-card-title class="pa-3">
                <span class="text-subtitle-1 font-weight-bold">Weekly Schedule</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <!-- Mobile View: Day by Day -->
                <div class="d-md-none">
                    <v-tabs v-model="selectedDay" show-arrows>
                        <v-tab v-for="day in weekDays" :key="day.value" :value="day.value">
                            <div class="text-center">
                                <div class="text-caption">{{ day.short }}</div>
                                <div class="text-body-2 font-weight-bold">{{ day.date }}</div>
                            </div>
                        </v-tab>
                    </v-tabs>
                    <v-window v-model="selectedDay">
                        <v-window-item v-for="day in weekDays" :key="day.value" :value="day.value">
                            <div class="pa-3">
                                <div v-if="getDayClasses(day.value).length === 0" class="text-center py-8">
                                    <v-icon size="40" color="grey-lighten-2">mdi-calendar-blank</v-icon>
                                    <p class="text-body-2 text-grey mt-2">No classes scheduled</p>
                                </div>
                                <div v-else class="d-flex flex-column ga-2">
                                    <v-card v-for="classItem in getDayClasses(day.value)" :key="classItem.id"
                                        elevation="0" border>
                                        <v-card-text class="pa-3">
                                            <div class="d-flex justify-space-between align-start mb-2">
                                                <div>
                                                    <div class="text-subtitle-2 font-weight-bold">{{ classItem.subject
                                                        }}</div>
                                                    <div class="text-caption text-grey">{{ classItem.time }}</div>
                                                </div>
                                                <v-chip size="x-small" variant="outlined">{{ classItem.type }}</v-chip>
                                            </div>
                                            <div class="text-caption">
                                                <div>{{ classItem.lecturer }}</div>
                                                <div class="text-grey">{{ classItem.room }}</div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </div>
                        </v-window-item>
                    </v-window>
                </div>

                <!-- Desktop View: Table -->
                <div class="d-none d-md-block">
                    <v-table class="schedule-table">
                        <thead>
                            <tr>
                                <th class="time-column">Time</th>
                                <th v-for="day in weekDays" :key="day.value" class="text-center">
                                    <div>{{ day.name }}</div>
                                    <div class="text-caption font-weight-regular">{{ day.date }}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="timeSlot in timeSlots" :key="timeSlot">
                                <td class="time-cell">{{ timeSlot }}</td>
                                <td v-for="day in weekDays" :key="day.value" class="schedule-cell">
                                    <div v-for="classItem in getClassAtTime(day.value, timeSlot)" :key="classItem.id"
                                        class="class-block">
                                        <div class="class-block-title">{{ classItem.subject }}</div>
                                        <div class="class-block-info">{{ classItem.room }}</div>
                                        <div class="class-block-info">{{ classItem.lecturer }}</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-student'],
    layout: 'student'
})

// Current week tracking
const currentWeekOffset = ref(0)
const selectedDay = ref(1) // Monday

// Time slots for desktop view
const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
]

// Get current date
const getCurrentDate = () => {
    const now = new Date()
    now.setDate(now.getDate() + (currentWeekOffset.value * 7))
    return now
}

// Get week start (Monday)
const getWeekStart = () => {
    const date = getCurrentDate()
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff))
}

// Computed properties
const currentWeekText = computed(() => {
    if (currentWeekOffset.value === 0) return 'This Week'
    if (currentWeekOffset.value === 1) return 'Next Week'
    if (currentWeekOffset.value === -1) return 'Last Week'
    return `Week ${currentWeekOffset.value > 0 ? '+' : ''}${currentWeekOffset.value}`
})

const weekDateRange = computed(() => {
    const start = getWeekStart()
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return `${formatDate(start)} - ${formatDate(end)}`
})

const weekDays = computed(() => {
    const start = getWeekStart()
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const shorts = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return days.map((name, index) => {
        const date = new Date(start)
        date.setDate(start.getDate() + index)
        return {
            value: index + 1,
            name: name,
            short: shorts[index],
            date: date.getDate()
        }
    })
})

const todaysClasses = computed(() => {
    const today = new Date().getDay() || 7 // Convert Sunday (0) to 7
    return weeklySchedule.value.filter(c => c.day === today)
})

// Week navigation
const previousWeek = () => {
    currentWeekOffset.value--
}

const nextWeek = () => {
    currentWeekOffset.value++
}

const goToToday = () => {
    currentWeekOffset.value = 0
}

// Mock schedule data
const weeklySchedule = ref([
    // Monday
    { id: 1, day: 1, subject: 'Web Development', time: '08:00 - 09:30', startTime: '08:00', endTime: '09:30', room: 'Room A101', lecturer: 'Dr. Smith', status: 'Scheduled', type: 'Lecture' },
    { id: 2, day: 1, subject: 'Database Systems', time: '10:00 - 11:30', startTime: '10:00', endTime: '11:30', room: 'Lab B201', lecturer: 'Prof. Johnson', status: 'Scheduled', type: 'Lab' },
    { id: 3, day: 1, subject: 'Algorithms', time: '13:00 - 14:30', startTime: '13:00', endTime: '14:30', room: 'Room C305', lecturer: 'Dr. Williams', status: 'Scheduled', type: 'Lecture' },

    // Tuesday
    { id: 4, day: 2, subject: 'Mobile App Development', time: '09:00 - 10:30', startTime: '09:00', endTime: '10:30', room: 'Lab D102', lecturer: 'Ms. Davis', status: 'Scheduled', type: 'Lab' },
    { id: 5, day: 2, subject: 'Software Engineering', time: '11:00 - 12:30', startTime: '11:00', endTime: '12:30', room: 'Room E204', lecturer: 'Prof. Brown', status: 'Scheduled', type: 'Lecture' },
    { id: 6, day: 2, subject: 'Data Structures', time: '14:00 - 15:30', startTime: '14:00', endTime: '15:30', room: 'Room A101', lecturer: 'Dr. Miller', status: 'Scheduled', type: 'Lecture' },

    // Wednesday
    { id: 7, day: 3, subject: 'Web Development', time: '08:00 - 09:30', startTime: '08:00', endTime: '09:30', room: 'Lab B201', lecturer: 'Dr. Smith', status: 'In Progress', type: 'Lab' },
    { id: 8, day: 3, subject: 'Computer Networks', time: '10:00 - 11:30', startTime: '10:00', endTime: '11:30', room: 'Room C305', lecturer: 'Dr. Anderson', status: 'Scheduled', type: 'Lecture' },
    { id: 9, day: 3, subject: 'AI & Machine Learning', time: '13:00 - 14:30', startTime: '13:00', endTime: '14:30', room: 'Lab D102', lecturer: 'Prof. Taylor', status: 'Scheduled', type: 'Lab' },

    // Thursday
    { id: 10, day: 4, subject: 'Operating Systems', time: '09:00 - 10:30', startTime: '09:00', endTime: '10:30', room: 'Room E204', lecturer: 'Dr. Wilson', status: 'Scheduled', type: 'Lecture' },
    { id: 11, day: 4, subject: 'Database Systems', time: '11:00 - 12:30', startTime: '11:00', endTime: '12:30', room: 'Lab B201', lecturer: 'Prof. Johnson', status: 'Scheduled', type: 'Lab' },
    { id: 12, day: 4, subject: 'Project Management', time: '14:00 - 15:30', startTime: '14:00', endTime: '15:30', room: 'Room A101', lecturer: 'Ms. Garcia', status: 'Scheduled', type: 'Lecture' },

    // Friday
    { id: 13, day: 5, subject: 'Software Testing', time: '08:00 - 09:30', startTime: '08:00', endTime: '09:30', room: 'Lab D102', lecturer: 'Dr. Martinez', status: 'Scheduled', type: 'Lab' },
    { id: 14, day: 5, subject: 'Mobile App Development', time: '10:00 - 11:30', startTime: '10:00', endTime: '11:30', room: 'Lab B201', lecturer: 'Ms. Davis', status: 'Scheduled', type: 'Lab' },
])

// Helper functions
const getDayClasses = (day) => {
    return weeklySchedule.value.filter(c => c.day === day)
}

const getClassAtTime = (day, timeSlot) => {
    return weeklySchedule.value.filter(c => {
        if (c.day !== day) return false
        const classStart = c.startTime
        return classStart === timeSlot
    })
}

const getStatusColor = (status) => {
    switch (status) {
        case 'Scheduled': return 'primary'
        case 'In Progress': return 'success'
        case 'Completed': return 'default'
        case 'Cancelled': return 'error'
        default: return 'default'
    }
}
</script>

<style scoped>
.schedule-container {
    max-width: 1400px;
    margin: 0 auto;
}

.class-card-active {
    border-left: 4px solid rgb(var(--v-theme-success)) !important;
}

/* Desktop Table Styles */
.schedule-table {
    width: 100%;
}

.schedule-table thead th {
    background-color: #f5f5f5;
    font-weight: 600;
    padding: 12px 8px !important;
    border-bottom: 2px solid #e0e0e0;
}

.time-column {
    width: 80px;
}

.time-cell {
    font-weight: 500;
    color: #616161;
    background-color: #fafafa;
    text-align: center;
    font-size: 0.875rem;
    vertical-align: top;
    padding: 12px 8px !important;
}

.schedule-cell {
    vertical-align: top;
    padding: 8px !important;
    border-right: 1px solid #e0e0e0;
    min-height: 80px;
    position: relative;
}

.schedule-cell:last-child {
    border-right: none;
}

.class-block {
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
    color: white;
    padding: 8px;
    border-radius: 6px;
    margin-bottom: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.class-block:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.class-block-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.8rem;
}

.class-block-info {
    font-size: 0.7rem;
    opacity: 0.9;
    line-height: 1.3;
}

/* Mobile Responsiveness */
@media (max-width: 960px) {
    .schedule-container {
        padding: 12px !important;
    }
}
</style>