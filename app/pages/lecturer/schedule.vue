<template>
    <v-container fluid class="pa-6">
        <!-- Page Header -->
        <div class="mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">My Schedule</h1>
            <p class="text-grey">View your weekly teaching schedule</p>
        </div>

        <!-- Week Selector -->
        <v-card class="mb-6" elevation="1">
            <v-card-text>
                <div class="d-flex justify-space-between align-center">
                    <v-btn icon variant="text" @click="previousWeek">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <div class="text-center">
                        <div class="text-h6 font-weight-bold">{{ currentWeekLabel }}</div>
                        <div class="text-caption text-grey">{{ currentWeekRange }}</div>
                    </div>
                    <v-btn icon variant="text" @click="nextWeek">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>

        <!-- Schedule Table -->
        <v-card elevation="1">
            <v-card-text class="pa-0">
                <div class="schedule-grid">
                    <!-- Header Row - Time Column -->
                    <div class="time-column header-cell">
                        <div class="pa-3 text-center font-weight-bold">Time</div>
                    </div>

                    <!-- Header Row - Days -->
                    <div v-for="day in weekDays" :key="day" class="day-column header-cell">
                        <div class="pa-3 text-center">
                            <div class="font-weight-bold">{{ day }}</div>
                            <div class="text-caption text-grey">{{ getDayDate(day) }}</div>
                        </div>
                    </div>

                    <!-- Time Slots -->
                    <template v-for="slot in timeSlots" :key="slot">
                        <!-- Time Column -->
                        <div class="time-column cell">
                            <div class="pa-3 text-center text-body-2 text-grey">
                                {{ slot }}
                            </div>
                        </div>

                        <!-- Day Cells -->
                        <div v-for="day in weekDays" :key="`${day}-${slot}`" class="day-column cell">
                            <div class="pa-2">
                                <div v-for="session in getSessionsForSlot(day, slot)" :key="session.id"
                                    class="session-card mb-2" :class="session.color" @click="viewSession(session)">
                                    <div class="font-weight-bold text-body-2 mb-1">{{ session.code }}</div>
                                    <div class="text-caption">{{ session.subject }}</div>
                                    <div class="text-caption">
                                        <v-icon size="x-small">mdi-map-marker</v-icon>
                                        {{ session.room }}
                                    </div>
                                    <div class="text-caption">
                                        <v-icon size="x-small">mdi-account-group</v-icon>
                                        {{ session.group }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </v-card-text>
        </v-card>

        <!-- Legend -->
        <v-card class="mt-6" elevation="1">
            <v-card-text>
                <div class="d-flex align-center flex-wrap gap-4">
                    <span class="text-subtitle-2 font-weight-bold mr-2">Legend:</span>
                    <div class="d-flex align-center">
                        <div class="legend-box bg-blue mr-2"></div>
                        <span class="text-body-2">Data Structures</span>
                    </div>
                    <div class="d-flex align-center">
                        <div class="legend-box bg-green mr-2"></div>
                        <span class="text-body-2">Database</span>
                    </div>
                    <div class="d-flex align-center">
                        <div class="legend-box bg-orange mr-2"></div>
                        <span class="text-body-2">Web Development</span>
                    </div>
                    <div class="d-flex align-center">
                        <div class="legend-box bg-purple mr-2"></div>
                        <span class="text-body-2">Mobile Development</span>
                    </div>
                    <div class="d-flex align-center">
                        <div class="legend-box bg-red mr-2"></div>
                        <span class="text-body-2">Software Engineering</span>
                    </div>
                    <div class="d-flex align-center">
                        <div class="legend-box bg-indigo mr-2"></div>
                        <span class="text-body-2">AI</span>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '13:00 - 15:00',
    '15:00 - 17:00'
]

const currentWeek = ref(0)

const currentWeekLabel = computed(() => {
    if (currentWeek.value === 0) return 'This Week'
    if (currentWeek.value === -1) return 'Last Week'
    if (currentWeek.value === 1) return 'Next Week'
    return `Week ${currentWeek.value > 0 ? '+' : ''}${currentWeek.value}`
})

const currentWeekRange = computed(() => {
    const today = new Date()
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (currentWeek.value * 7)))
    const lastDay = new Date(firstDay)
    lastDay.setDate(lastDay.getDate() + 4)

    return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
})

const schedule = ref([
    {
        id: 1,
        day: 'Monday',
        time: '08:00 - 10:00',
        subject: 'Data Structures & Algorithms',
        code: 'CS201',
        group: 'CS-9-G1',
        room: 'Lab 301',
        color: 'bg-blue'
    },
    {
        id: 2,
        day: 'Monday',
        time: '10:00 - 12:00',
        subject: 'Database Management',
        code: 'CS303',
        group: 'IT-10-G2',
        room: 'Room 205',
        color: 'bg-green'
    },
    {
        id: 3,
        day: 'Monday',
        time: '13:00 - 15:00',
        subject: 'Software Engineering',
        code: 'CS301',
        group: 'CS-10-G2',
        room: 'Room 201',
        color: 'bg-red'
    },
    {
        id: 4,
        day: 'Tuesday',
        time: '08:00 - 10:00',
        subject: 'Web Development',
        code: 'CS405',
        group: 'CS-11-G1',
        room: 'Lab 302',
        color: 'bg-orange'
    },
    {
        id: 5,
        day: 'Tuesday',
        time: '10:00 - 12:00',
        subject: 'Artificial Intelligence',
        code: 'CS501',
        group: 'CS-12-G1',
        room: 'Lab 401',
        color: 'bg-indigo'
    },
    {
        id: 6,
        day: 'Wednesday',
        time: '08:00 - 10:00',
        subject: 'Data Structures & Algorithms',
        code: 'CS201',
        group: 'CS-9-G1',
        room: 'Lab 301',
        color: 'bg-blue'
    },
    {
        id: 7,
        day: 'Wednesday',
        time: '13:00 - 15:00',
        subject: 'Mobile App Development',
        code: 'CS407',
        group: 'SE-11-G3',
        room: 'Lab 303',
        color: 'bg-purple'
    },
    {
        id: 8,
        day: 'Wednesday',
        time: '13:00 - 15:00',
        subject: 'Software Engineering',
        code: 'CS301',
        group: 'CS-10-G2',
        room: 'Room 201',
        color: 'bg-red'
    },
    {
        id: 9,
        day: 'Thursday',
        time: '08:00 - 10:00',
        subject: 'Database Management',
        code: 'CS303',
        group: 'IT-10-G2',
        room: 'Room 205',
        color: 'bg-green'
    },
    {
        id: 10,
        day: 'Thursday',
        time: '10:00 - 12:00',
        subject: 'Mobile App Development',
        code: 'CS407',
        group: 'SE-11-G3',
        room: 'Lab 303',
        color: 'bg-purple'
    },
    {
        id: 11,
        day: 'Thursday',
        time: '13:00 - 15:00',
        subject: 'Artificial Intelligence',
        code: 'CS501',
        group: 'CS-12-G1',
        room: 'Lab 401',
        color: 'bg-indigo'
    },
    {
        id: 12,
        day: 'Friday',
        time: '08:00 - 10:00',
        subject: 'Data Structures & Algorithms',
        code: 'CS201',
        group: 'CS-9-G1',
        room: 'Lab 301',
        color: 'bg-blue'
    },
    {
        id: 13,
        day: 'Friday',
        time: '10:00 - 12:00',
        subject: 'Web Development',
        code: 'CS405',
        group: 'CS-11-G1',
        room: 'Lab 302',
        color: 'bg-orange'
    }
])

const getSessionsForSlot = (day, time) => {
    return schedule.value.filter(s => s.day === day && s.time === time)
}

const getDayDate = (day) => {
    const dayIndex = weekDays.indexOf(day)
    const today = new Date()
    const targetDate = new Date(today.setDate(today.getDate() - today.getDay() + 1 + dayIndex + (currentWeek.value * 7)))
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const previousWeek = () => {
    currentWeek.value--
}

const nextWeek = () => {
    currentWeek.value++
}

const viewSession = (session) => {
    console.log('View session:', session)
    // Navigate to class details or session page
}
</script>

<style scoped>
.schedule-grid {
    display: grid;
    grid-template-columns: 120px repeat(5, 1fr);
    min-width: 100%;
}

.header-cell {
    background-color: #f5f5f5;
    border-bottom: 2px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    font-weight: bold;
}

.cell {
    border-bottom: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    min-height: 100px;
}

.time-column {
    border-left: 1px solid #e0e0e0;
}

.session-card {
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
}

.session-card:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.bg-blue {
    background-color: #2196F3;
}

.bg-green {
    background-color: #4CAF50;
}

.bg-orange {
    background-color: #FF9800;
}

.bg-purple {
    background-color: #9C27B0;
}

.bg-red {
    background-color: #F44336;
}

.bg-indigo {
    background-color: #3F51B5;
}

.legend-box {
    width: 24px;
    height: 24px;
    border-radius: 4px;
}
</style>
