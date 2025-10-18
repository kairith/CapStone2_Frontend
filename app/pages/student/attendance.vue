<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-icon left>mdi-chart-line</v-icon>
                        Attendance Overview
                    </v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="green" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-check-circle</v-icon>
                                        <h2>{{ attendanceStats.present }}</h2>
                                        <p>Present</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="red" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-close-circle</v-icon>
                                        <h2>{{ attendanceStats.absent }}</h2>
                                        <p>Absent</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="orange" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-clock</v-icon>
                                        <h2>{{ attendanceStats.late }}</h2>
                                        <p>Late</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="blue" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-percent</v-icon>
                                        <h2>{{ attendanceStats.percentage }}%</h2>
                                        <p>Total</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Attendance Chart -->
        <v-row class="mt-4">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>Attendance Trend</v-card-title>
                    <v-card-text>
                        <canvas ref="chartCanvas" width="400" height="200"></canvas>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Recent Classes</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="record in recentAttendance" :key="record.id">
                                <v-list-item-content>
                                    <v-list-item-title>{{ record.subject }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ record.date }}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-chip :color="getStatusColor(record.status)" small>
                                        {{ record.status }}
                                    </v-chip>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Detailed Attendance Table -->
        <v-row class="mt-4">
            <v-col>
                <v-card>
                    <v-card-title>Detailed Attendance</v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="attendanceRecords" :items-per-page="10">
                            <template v-slot:item.status="{ item }">
                                <v-chip :color="getStatusColor(item.status)" dark small>
                                    {{ item.status }}
                                </v-chip>
                            </template>
                        </v-data-table>
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

const chartCanvas = ref(null)

const attendanceStats = reactive({
    present: 45,
    absent: 5,
    late: 3,
    percentage: 85
})

const headers = [
    { title: 'Date', key: 'date' },
    { title: 'Subject', key: 'subject' },
    { title: 'Time', key: 'time' },
    { title: 'Status', key: 'status' },
    { title: 'Remarks', key: 'remarks' }
]

const attendanceRecords = ref([
    {
        id: 1,
        date: '2024-01-15',
        subject: 'Mathematics',
        time: '08:00 - 09:30',
        status: 'Present',
        remarks: 'On time'
    },
    {
        id: 2,
        date: '2024-01-14',
        subject: 'Physics',
        time: '10:00 - 11:30',
        status: 'Late',
        remarks: '15 minutes late'
    },
    {
        id: 3,
        date: '2024-01-13',
        subject: 'Chemistry',
        time: '14:00 - 15:30',
        status: 'Absent',
        remarks: 'Sick leave'
    }
])

const recentAttendance = ref([
    {
        id: 1,
        subject: 'Mathematics',
        date: '2024-01-15',
        status: 'Present'
    },
    {
        id: 2,
        subject: 'Physics',
        date: '2024-01-14',
        status: 'Late'
    },
    {
        id: 3,
        subject: 'Chemistry',
        date: '2024-01-13',
        status: 'Absent'
    }
])

const getStatusColor = (status) => {
    switch (status) {
        case 'Present': return 'green'
        case 'Absent': return 'red'
        case 'Late': return 'orange'
        default: return 'grey'
    }
}

onMounted(() => {
    // Initialize chart here if needed
    if (chartCanvas.value) {
        console.log('Chart canvas ready')
    }
})
</script>