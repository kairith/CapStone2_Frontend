<template>
    <div class="dashboard-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-view-dashboard" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Dashboard Overview</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Dashboard</span>
                            </div>
                        </div>
                    </div>
                    <div class="welcome-message">
                        <span class="greeting">Hello, Admin 👋</span>
                        <span class="sub-greeting">Welcome back to your dashboard</span>
                    </div>
                </div>

                <div class="action-section">
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Search ..."
                        variant="outlined" density="compact" hide-details class="search-field" />
                </div>
            </div>
        </div>

        <!-- Modern Content Section -->
        <div class="modern-content-section">
            <div class="content-container">
                <!-- Filters Panel -->
                <div class="filters-panel">
                    <div class="filters-header">
                        <v-icon icon="mdi-filter-variant" size="18" class="mr-2" />
                        <span class="filters-title">Filters</span>
                    </div>
                    <div class="filters-content">
                        <v-select v-model="filters.generation" :items="generationOptions" label="Generation"
                            variant="outlined" density="compact" hide-details class="filter-select" />

                        <v-select v-model="filters.year" :items="yearOptions" label="Year" variant="outlined"
                            density="compact" hide-details class="filter-select" />

                        <v-select v-model="filters.group" :items="groupOptions" label="Group" variant="outlined"
                            density="compact" hide-details class="filter-select" />

                        <v-select v-model="filters.specialize" :items="specializeOptions" label="Specialize"
                            variant="outlined" density="compact" hide-details class="filter-select" />

                        <v-select v-model="filters.order" :items="orderOptions" label="Order" variant="outlined"
                            density="compact" hide-details class="filter-select" />
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card stat-card-0">
                        <div class="stat-header">
                            <v-avatar size="56" color="#3b82f6" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-group</v-icon>
                            </v-avatar>
                            <v-chip color="blue" size="x-small" variant="flat" class="stat-trend">
                                +5%
                            </v-chip>
                        </div>
                        <div class="stat-value">45</div>
                        <div class="stat-label">Total Students</div>
                        <div class="stat-details">Female: 23 • Male: 22</div>
                    </div>

                    <div class="stat-card stat-card-1">
                        <div class="stat-header">
                            <v-avatar size="56" color="#22c55e" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-check</v-icon>
                            </v-avatar>
                            <v-chip color="green" size="x-small" variant="flat" class="stat-trend">
                                +8%
                            </v-chip>
                        </div>
                        <div class="stat-value">45</div>
                        <div class="stat-label">Present Today</div>
                        <div class="stat-details">Female: 23 • Male: 22</div>
                    </div>

                    <div class="stat-card stat-card-2">
                        <div class="stat-header">
                            <v-avatar size="56" color="#f59e0b" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-remove</v-icon>
                            </v-avatar>
                            <v-chip color="orange" size="x-small" variant="flat" class="stat-trend">
                                -2%
                            </v-chip>
                        </div>
                        <div class="stat-value">45</div>
                        <div class="stat-label">Absent Today</div>
                        <div class="stat-details">Female: 23 • Male: 22</div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-card chart-large">
                        <div class="chart-header">
                            <h3 class="chart-title">
                                <v-icon icon="mdi-chart-bar" size="20" class="mr-2" />
                                Average in Weeks
                            </h3>
                        </div>
                        <div class="chart-content">
                            <canvas ref="barChartCanvas" height="300"></canvas>
                        </div>
                    </div>

                    <div class="chart-card chart-small">
                        <div class="chart-header">
                            <h3 class="chart-title">
                                <v-icon icon="mdi-chart-donut" size="20" class="mr-2" />
                                Attendance Overview
                            </h3>
                        </div>
                        <div class="chart-content doughnut-content">
                            <canvas ref="doughnutChartCanvas" width="250" height="250"></canvas>
                            <div class="chart-legend">
                                <div class="legend-item">
                                    <div class="legend-dot" style="background-color: #1e3a8a"></div>
                                    <span class="legend-text">Present 62.5%</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-dot" style="background-color: #f97316"></div>
                                    <span class="legend-text">Leave 12.5%</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-dot" style="background-color: #22c55e"></div>
                                    <span class="legend-text">Absence 25%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Student Lists Table -->
                <div class="table-card">
                    <div class="table-header">
                        <div class="table-title-section">
                            <h3 class="table-title">
                                <v-icon icon="mdi-account-multiple" size="20" class="mr-2" />
                                Student Lists
                            </h3>
                            <span class="table-subtitle">Attendance tracking records</span>
                        </div>
                        <div class="table-actions">
                            <v-text-field v-model="studentSearch" prepend-inner-icon="mdi-magnify"
                                placeholder="Search ..." variant="outlined" density="compact" hide-details
                                class="search-field-small" />
                            <v-select v-model="studentOrder" :items="['A-Z', 'Z-A']" label="Order" variant="outlined"
                                density="compact" hide-details class="order-select" />
                        </div>
                    </div>
                    <div class="table-content">
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
                    </div>
                </div>
            </div>
        </div>
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
.dashboard-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    padding: 0;
}

/* Modern Header Styles */
.modern-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
    margin-bottom: 16px;
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

.welcome-message {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.greeting {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
}

.sub-greeting {
    font-size: 14px;
    color: #64748b;
}

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-field {
    min-width: 300px;
}

.search-field :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Modern Content Section */
.modern-content-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
}

.content-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* Filters Panel */
.filters-panel {
    background: white;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}

.filters-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
}

.filters-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.filters-content {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.filter-select {
    flex: 1;
    min-width: 120px;
    max-width: 160px;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.stat-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid rgba(63, 81, 181, 0.1);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(63, 81, 181, 0.12);
}

.stat-card-0 {
    border-left: 4px solid #3b82f6;
}

.stat-card-1 {
    border-left: 4px solid #22c55e;
}

.stat-card-2 {
    border-left: 4px solid #f59e0b;
}

.stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.stat-icon {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.stat-trend {
    font-weight: 600;
    font-size: 11px;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 16px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 6px;
}

.stat-details {
    font-size: 13px;
    color: #64748b;
    line-height: 1.4;
}

/* Charts Section */
.charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
}

.chart-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
}

.chart-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
}

.chart-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
}

.chart-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.doughnut-content {
    flex-direction: column;
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.legend-text {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
}

/* Table Card */
.table-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
}

.table-title-section {
    flex: 1;
}

.table-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
}

.table-subtitle {
    font-size: 14px;
    color: #64748b;
}

.table-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-field-small {
    max-width: 250px;
}

.search-field-small :deep(.v-field) {
    border-radius: 12px;
}

.order-select {
    max-width: 120px;
}

.order-select :deep(.v-field) {
    border-radius: 12px;
}

.table-content {
    padding: 0;
}

/* Attendance Table Styles */
.attendance-table {
    width: 100%;
}

.attendance-table th {
    background-color: #1e293b;
    color: white !important;
    padding: 16px 12px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
}

.week-header {
    background-color: #22c55e !important;
    border: 1px solid #16a34a;
    color: white !important;
}

.day-header {
    background-color: #334155 !important;
    font-size: 11px;
    color: white !important;
}

.attendance-table tbody tr {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
}

.attendance-table tbody tr:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.attendance-table tbody td {
    padding: 16px 12px;
    font-size: 14px;
    border: none;
}

.attendance-cell {
    padding: 8px;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
}

.attendance-cell.present {
    background-color: #dcfce7;
    color: #15803d;
}

.attendance-cell.absent {
    background-color: #fee2e2;
    color: #b91c1c;
}

.attendance-cell.leave {
    background-color: #fed7aa;
    color: #c2410c;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .header-container {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
    }

    .charts-section {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 16px 20px;
    }

    .modern-content-section {
        padding: 16px 20px;
    }

    .title-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .filters-content {
        flex-direction: column;
    }

    .filter-select {
        max-width: 100%;
    }

    .table-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .table-actions {
        flex-direction: column;
        align-items: stretch;
    }

    .search-field-small,
    .order-select {
        max-width: 100%;
    }

    .attendance-table {
        display: block;
        overflow-x: auto;
    }
}
</style>