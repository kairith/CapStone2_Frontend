<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-icon left>mdi-calendar-clock</v-icon>
                        My Schedule
                    </v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-select v-model="selectedWeek" :items="weeks" label="Select Week" outlined />
                            </v-col>
                            <v-col cols="12" md="8">
                                <v-btn-toggle v-model="viewMode" mandatory>
                                    <v-btn value="week">Week View</v-btn>
                                    <v-btn value="day">Day View</v-btn>
                                </v-btn-toggle>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-calendar v-model="calendar" :events="scheduleEvents"
                                    :weekdays="[1, 2, 3, 4, 5, 6, 0]" type="week" />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Today's Classes -->
        <v-row class="mt-4">
            <v-col>
                <v-card>
                    <v-card-title>Today's Classes</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col v-for="class_item in todaysClasses" :key="class_item.id" cols="12" md="6">
                                <v-card elevation="2">
                                    <v-card-title>{{ class_item.subject }}</v-card-title>
                                    <v-card-subtitle>
                                        {{ class_item.time }} - {{ class_item.room }}
                                    </v-card-subtitle>
                                    <v-card-text>
                                        <p><strong>Lecturer:</strong> {{ class_item.lecturer }}</p>
                                        <v-chip :color="getStatusColor(class_item.status)" small>
                                            {{ class_item.status }}
                                        </v-chip>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-student'],
    layout: 'student'
})

const calendar = ref(new Date())
const selectedWeek = ref('Current Week')
const viewMode = ref('week')

const weeks = [
    'Previous Week',
    'Current Week',
    'Next Week'
]

const scheduleEvents = ref([
    {
        name: 'Mathematics',
        start: '2024-01-15 08:00',
        end: '2024-01-15 09:30',
        color: 'blue'
    },
    {
        name: 'Physics',
        start: '2024-01-15 10:00',
        end: '2024-01-15 11:30',
        color: 'green'
    }
])

const todaysClasses = ref([
    {
        id: 1,
        subject: 'Mathematics',
        time: '08:00 - 09:30',
        room: 'Room A101',
        lecturer: 'Dr. Smith',
        status: 'Scheduled'
    },
    {
        id: 2,
        subject: 'Physics',
        time: '10:00 - 11:30',
        room: 'Lab B201',
        lecturer: 'Prof. Johnson',
        status: 'In Progress'
    }
])

const getStatusColor = (status) => {
    switch (status) {
        case 'Scheduled': return 'blue'
        case 'In Progress': return 'green'
        case 'Completed': return 'grey'
        case 'Cancelled': return 'red'
        default: return 'grey'
    }
}
</script>