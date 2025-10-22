<template>
    <div class="dashboard-container">
        <!-- Header Section -->
        <v-row class="mb-6">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <div>
                    <h1 class="text-h4 font-weight-bold">Hello, Admin 👋</h1>
                </div>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Search ..."
                    variant="outlined" density="compact" hide-details style="max-width: 300px" rounded />
            </v-col>
        </v-row>

        <!-- Filters Section -->
        <v-row class="mb-4">
            <v-col cols="12">
                <v-card flat class="pa-4">
                    <div class="d-flex align-center flex-wrap ga-3">
                        <span class="text-subtitle-2 font-weight-bold">Filters</span>

                        <v-select v-model="filters.generation" :items="generationOptions" label="Generation"
                            variant="outlined" density="compact" hide-details style="max-width: 120px" />

                        <v-select v-model="filters.year" :items="yearOptions" label="Year" variant="outlined"
                            density="compact" hide-details style="max-width: 120px" />

                        <v-select v-model="filters.group" :items="groupOptions" label="Group" variant="outlined"
                            density="compact" hide-details style="max-width: 120px" />

                        <v-select v-model="filters.specialize" :items="specializeOptions" label="Specialize"
                            variant="outlined" density="compact" hide-details style="max-width: 120px" />

                        <v-select v-model="filters.order" :items="orderOptions" label="Order" variant="outlined"
                            density="compact" hide-details style="max-width: 120px" />
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row class="mb-6">
            <v-col cols="12" md="4">
                <v-card class="stat-card blue-border" elevation="2">
                    <v-card-text class="d-flex align-center justify-space-between">
                        <div>
                            <div class="text-h6 font-weight-bold">Count of student</div>
                            <div class="text-h4 font-weight-bold mt-2">45 students</div>
                            <div class="text-caption text-grey">Female 23 Male 22</div>
                        </div>
                        <v-avatar size="60" color="blue-lighten-4">
                            <v-icon size="40" color="blue">mdi-account-group</v-icon>
                        </v-avatar>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="stat-card orange-border" elevation="2">
                    <v-card-text class="d-flex align-center justify-space-between">
                        <div>
                            <div class="text-h6 font-weight-bold">Count of present</div>
                            <div class="text-h4 font-weight-bold mt-2">45 students</div>
                            <div class="text-caption text-grey">Female 23 Male 22</div>
                        </div>
                        <v-avatar size="60" color="orange-lighten-4">
                            <v-icon size="40" color="orange">mdi-account-check</v-icon>
                        </v-avatar>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="stat-card yellow-border" elevation="2">
                    <v-card-text class="d-flex align-center justify-space-between">
                        <div>
                            <div class="text-h6 font-weight-bold">Count of absent</div>
                            <div class="text-h4 font-weight-bold mt-2">45 students</div>
                            <div class="text-caption text-grey">Female 23 Male 22</div>
                        </div>
                        <v-avatar size="60" color="yellow-lighten-4">
                            <v-icon size="40" color="yellow-darken-2">mdi-account-remove</v-icon>
                        </v-avatar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Charts Section -->
        <v-row class="mb-6">
            <v-col cols="12" md="8">
                <v-card elevation="2">
                    <v-card-title class="text-h6 font-weight-bold">Average in weeks</v-card-title>
                    <v-card-text>
                        <canvas ref="barChartCanvas" height="300"></canvas>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card elevation="2">
                    <v-card-title class="text-h6 font-weight-bold">Attendance in view</v-card-title>
                    <v-card-text class="d-flex flex-column align-center">
                        <canvas ref="doughnutChartCanvas" width="250" height="250"></canvas>
                        <div class="d-flex justify-center ga-4 mt-4 flex-wrap">
                            <div class="d-flex align-center">
                                <div class="legend-dot" style="background-color: #1e3a8a"></div>
                                <span class="text-caption">Present 62.5%</span>
                            </div>
                            <div class="d-flex align-center">
                                <div class="legend-dot" style="background-color: #f97316"></div>
                                <span class="text-caption">Leave 12.5%</span>
                            </div>
                            <div class="d-flex align-center">
                                <div class="legend-dot" style="background-color: #22c55e"></div>
                                <span class="text-caption">Absence 25%</span>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Student Lists Table -->
        <v-row>
            <v-col cols="12">
                <v-card elevation="2">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="text-h6 font-weight-bold">Student lists</span>
                        <div class="d-flex align-center ga-3">
                            <v-text-field v-model="studentSearch" prepend-inner-icon="mdi-magnify"
                                placeholder="Search ..." variant="outlined" density="compact" hide-details
                                style="max-width: 250px" />
                            <v-select v-model="studentOrder" :items="['A-Z', 'Z-A']" label="Order" variant="outlined"
                                density="compact" hide-details style="max-width: 100px" />
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-table class="attendance-table">
                            <thead>
                                <tr>
                                    <th class="text-left font-weight-bold">Student name</th>
                                    <th class="text-center font-weight-bold">Gender</th>
                                    <th class="text-center font-weight-bold">Generation</th>
                                    <th class="text-center font-weight-bold">DOB</th>
                                    <th class="text-center font-weight-bold">Status</th>
                                    <th class="text-center font-weight-bold" colspan="14">Attendance record</th>
                                </tr>
                                <tr>
                                    <th colspan="5"></th>
                                    <th class="text-center week-header" colspan="2">W1</th>
                                    <th class="text-center week-header" colspan="2">W2</th>
                                    <th class="text-center week-header" colspan="2">W3</th>
                                </tr>
                                <tr>
                                    <th colspan="5"></th>
                                    <th class="text-center day-header">D1</th>
                                    <th class="text-center day-header">D2</th>
                                    <th class="text-center day-header">D3</th>
                                    <th class="text-center day-header">D4</th>
                                    <th class="text-center day-header">D5</th>
                                    <th class="text-center day-header">D1</th>
                                    <th class="text-center day-header">D2</th>
                                    <th class="text-center day-header">D3</th>
                                    <th class="text-center day-header">D4</th>
                                    <th class="text-center day-header">D5</th>
                                    <th class="text-center day-header">D1</th>
                                    <th class="text-center day-header">D2</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student in filteredStudents" :key="student.id">
                                    <td>{{ student.name }}</td>
                                    <td class="text-center">{{ student.gender }}</td>
                                    <td class="text-center">{{ student.generation }}</td>
                                    <td class="text-center">{{ student.dob }}</td>
                                    <td class="text-center">
                                        <v-chip :color="student.status === 'Active' ? 'success' : 'grey'" size="small">
                                            {{ student.status }}
                                        </v-chip>
                                    </td>
                                    <td v-for="(attendance, index) in student.attendanceRecord" :key="index"
                                        :class="['text-center attendance-cell', getAttendanceClass(attendance)]">
                                        {{ attendance }}
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    // middleware: ['auth', 'role-admin'] // Commented out for testing
})

// Search and filters
const search = ref('')
const studentSearch = ref('')
const studentOrder = ref('A-Z')

const filters = ref({
    generation: '9',
    year: '2025',
    group: 'G1',
    specialize: 'CS',
    order: 'A-Z'
})

const generationOptions = ['9', '10', '11', '12']
const yearOptions = ['2023', '2024', '2025', '2026']
const groupOptions = ['G1', 'G2', 'G3', 'G4']
const specializeOptions = ['CS', 'IT', 'IS', 'SE']
const orderOptions = ['A-Z', 'Z-A']

// Stats data
const stats = ref({
    totalStudents: { count: 45, female: 23, male: 22 },
    present: { count: 45, female: 23, male: 22 },
    absent: { count: 45, female: 23, male: 22 }
})

// Student data
const students = ref([
    {
        id: 1,
        name: 'MEAN Piseth',
        gender: 'M',
        generation: '9',
        dob: 'Sep 01, 2004',
        status: 'Active',
        attendanceRecord: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
    },
    {
        id: 2,
        name: 'MEAN Piseth',
        gender: 'M',
        generation: '9',
        dob: 'Sep 01, 2004',
        status: 'Active',
        attendanceRecord: ['P', 'P', 'P', 'A', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
    },
    {
        id: 3,
        name: 'MEAN Piseth',
        gender: 'M',
        generation: '9',
        dob: 'Sep 01, 2004',
        status: 'Active',
        attendanceRecord: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
    }
])

const filteredStudents = computed(() => {
    let result = students.value

    if (studentSearch.value) {
        result = result.filter(s =>
            s.name.toLowerCase().includes(studentSearch.value.toLowerCase())
        )
    }

    if (studentOrder.value === 'Z-A') {
        result = [...result].reverse()
    }

    return result
})

// Chart references
const barChartCanvas = ref(null)
const doughnutChartCanvas = ref(null)

const getAttendanceClass = (attendance) => {
    if (attendance === 'P') return 'present'
    if (attendance === 'A') return 'absent'
    if (attendance === 'L') return 'leave'
    return ''
}

// Initialize charts on mount
onMounted(() => {
    // Use nextTick to ensure DOM is fully rendered
    nextTick(() => {
        initBarChart()
        initDoughnutChart()
    })
})

const initBarChart = () => {
    if (!barChartCanvas.value) return

    try {
        const ctx = barChartCanvas.value.getContext('2d')
        if (!ctx) return

        // Simple bar chart implementation
        const data = [10, 6, 7, 7, 12, 10, 5, 4, 3, 2, 1, 6]
        const labels = ['Week-1', 'Week-2', 'Week-3', 'Week-4', 'Week-5', 'Week-6', 'Week-7', 'Week-8', 'Week-9', 'Week-10', 'Week-11', 'Week->3']

        const maxValue = Math.max(...data)
        const canvas = barChartCanvas.value
        const width = canvas.width || 800
        const height = canvas.height || 300
        const barWidth = width / (data.length * 1.5)
        const padding = 40

        // Clear canvas
        ctx.clearRect(0, 0, width, height)

        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (height - padding * 2)
            const x = padding + index * (barWidth * 1.5)
            const y = height - padding - barHeight

            ctx.fillStyle = '#0000FF'
            ctx.fillRect(x, y, barWidth, barHeight)

            // Draw labels
            ctx.fillStyle = '#666'
            ctx.font = '10px Arial'
            ctx.save()
            ctx.translate(x + barWidth / 2, height - 10)
            ctx.rotate(-Math.PI / 4)
            ctx.textAlign = 'right'
            ctx.fillText(labels[index], 0, 0)
            ctx.restore()
        })
    } catch (error) {
        console.error('Error initializing bar chart:', error)
    }
}

const initDoughnutChart = () => {
    if (!doughnutChartCanvas.value) return

    try {
        const ctx = doughnutChartCanvas.value.getContext('2d')
        if (!ctx) return

        const centerX = 125
        const centerY = 125
        const radius = 80
        const innerRadius = 50

        const data = [
            { value: 62.5, color: '#1e3a8a', label: 'Present' },
            { value: 12.5, color: '#f97316', label: 'Leave' },
            { value: 25, color: '#22c55e', label: 'Absence' }
        ]

        let currentAngle = -Math.PI / 2

        data.forEach(segment => {
            const sliceAngle = (segment.value / 100) * 2 * Math.PI

            // Draw outer arc
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
            ctx.closePath()
            ctx.fillStyle = segment.color
            ctx.fill()

            currentAngle += sliceAngle
        })
    } catch (error) {
        console.error('Error initializing doughnut chart:', error)
    }
}
</script>

<style scoped>
.dashboard-container {
    padding: 20px;
}

.stat-card {
    border-left: 4px solid;
    height: 100%;
}

.stat-card.blue-border {
    border-left-color: #2196F3;
}

.stat-card.orange-border {
    border-left-color: #FF9800;
}

.stat-card.yellow-border {
    border-left-color: #FFC107;
}

.attendance-table {
    width: 100%;
}

.attendance-table th {
    background-color: #f5f5f5;
    padding: 12px 8px;
    font-size: 13px;
}

.week-header {
    background-color: #c8e6c9 !important;
    border: 1px solid #4caf50;
}

.day-header {
    background-color: #f5f5f5;
    font-size: 11px;
}

.attendance-cell {
    padding: 8px;
    font-weight: 500;
    font-size: 13px;
}

.attendance-cell.present {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.attendance-cell.absent {
    background-color: #ffebee;
    color: #c62828;
}

.attendance-cell.leave {
    background-color: #fff3e0;
    color: #e65100;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 6px;
}
</style>