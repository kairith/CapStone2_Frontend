<template>
    <div class="reports-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-chart-box" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Reports & Analytics</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Reports</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ summary.totalInstructors }}</div>
                            <div class="stat-label">Instructors</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ summary.totalStudents }}</div>
                            <div class="stat-label">Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ summary.avgAttendance.toFixed(1) }}%</div>
                            <div class="stat-label">Avg Attendance</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-btn class="modern-btn" prepend-icon="mdi-refresh" variant="outlined" :loading="isLoading"
                        @click="fetchReport">
                        Refresh
                    </v-btn>

                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-download" variant="flat"
                                color="primary" v-bind="props">
                                Export
                                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item class="menu-item">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-file-excel" color="success" />
                                </template>
                                <v-list-item-title>Export to Excel</v-list-item-title>
                            </v-list-item>
                            <v-list-item class="menu-item">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-file-pdf-box" color="error" />
                                </template>
                                <v-list-item-title>Export to PDF</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </div>

        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <!-- Filters Panel -->
                <div class="filters-panel-wrapper">
                    <div class="filters-content">
                        <div class="filters-row">
                            <div class="filter-item">
                                <v-select v-model="filters.termId" :items="termOptions" label="Academic Term"
                                    variant="outlined" density="compact" item-title="label" item-value="id" clearable
                                    prepend-inner-icon="mdi-calendar-month" hide-details class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.generationId" :items="generationOptions" label="Generation"
                                    variant="outlined" density="compact" item-title="label" item-value="id" clearable
                                    prepend-inner-icon="mdi-school" hide-details class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.departmentId" :items="departmentOptions" label="Department"
                                    variant="outlined" density="compact" item-title="label" item-value="id" clearable
                                    prepend-inner-icon="mdi-office-building" hide-details class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.instructorId" :items="instructorOptions" label="Instructor"
                                    variant="outlined" density="compact" item-title="label" item-value="id" clearable
                                    prepend-inner-icon="mdi-account-tie" hide-details class="filter-select" />
                            </div>
                        </div>
                        <div class="filters-row">
                            <div class="filter-item">
                                <v-select v-model="filters.groupId" :items="groupOptions" label="Group"
                                    variant="outlined" density="compact" item-title="label" item-value="id" clearable
                                    prepend-inner-icon="mdi-account-group" hide-details class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.subjectId" :items="subjectOptions" label="Subject"
                                    variant="outlined" density="compact" item-title="label" item-value="id" clearable
                                    prepend-inner-icon="mdi-book-open-page-variant" hide-details
                                    class="filter-select" />
                            </div>
                            <div class="filter-item slider-item">
                                <div class="slider-wrapper">
                                    <div class="slider-header">
                                        <span class="slider-label">Min Attendance</span>
                                        <span class="slider-value">{{ filters.minAttendance }}%</span>
                                    </div>
                                    <v-slider v-model="filters.minAttendance" :min="0" :max="100" :step="5" hide-details
                                        thumb-label color="primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary Cards -->
                <!-- <div class="summary-cards-wrapper">
                    <div v-for="(card, i) in summaryCards" :key="i" class="summary-card" :class="`summary-card-${i}`">
                        <div class="card-header">
                            <v-avatar size="48" :color="card.color" class="card-icon">
                                <v-icon size="28" color="white">{{ card.icon }}</v-icon>
                            </v-avatar>
                            <v-chip :color="card.chipColor" size="x-small" variant="flat" class="card-trend">
                                {{ card.trend || '+0%' }}
                            </v-chip>
                        </div>
                        <div class="card-value">{{ card.value }}</div>
                        <div class="card-label">{{ card.label }}</div>
                        <div class="card-description">{{ card.description }}</div>
                    </div>
                </div> -->

                <!-- Table Header with Search -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-table" size="20" class="mr-2" />
                            Attendance Overview
                        </h2>
                        <div class="table-subtitle">Instructor & course performance analysis</div>
                    </div>
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="search" placeholder="Search instructor, subject, or group..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
                                class="search-input" clearable />
                        </div>
                    </div>
                </div>

                <!-- Modern Table Wrapper -->
                <div class="modern-table-wrapper">

                    <v-data-table :headers="headers" :items="filteredRows" :search="search" :loading="isLoading"
                        density="comfortable" class="modern-table" :items-per-page="10" hover>
                        <!-- Instructor -->
                        <template #item.instructor="{ item }">
                            <div class="py-3">
                                <div class="font-weight-bold">{{ item.instructorName }}</div>
                                <div class="text-caption text-medium-emphasis">
                                    {{ item.instructorPosition }} • ID: {{ item.instructorId }}
                                </div>
                            </div>
                        </template>

                        <!-- Subject -->
                        <template #item.subject="{ item }">
                            <div class="py-3">
                                <div class="font-weight-bold text-primary">{{ item.subjectName }}</div>
                                <div class="text-caption text-medium-emphasis">
                                    {{ item.subjectCode }} • {{ item.departmentName }}
                                </div>
                            </div>
                        </template>

                        <!-- Group / Generation -->
                        <template #item.group="{ item }">
                            <div>
                                <v-chip color="primary" size="small" variant="flat" class="font-weight-medium">
                                    {{ item.groupName }}
                                </v-chip>
                                <div class="text-caption text-medium-emphasis mt-1">
                                    Gen {{ item.generation }}
                                </div>
                            </div>
                        </template>

                        <!-- Term -->
                        <template #item.term="{ item }">
                            <v-chip color="indigo-lighten-4" text-color="indigo-darken-4" size="small">
                                {{ item.term }}
                            </v-chip>
                        </template>

                        <!-- Sessions -->
                        <template #item.sessions="{ item }">
                            <div class="text-body-2">
                                <div>
                                    <strong>{{ item.completedSessions }}</strong> completed
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                    {{ item.plannedSessions }} planned • {{ item.canceledSessions }} cancelled
                                </div>
                            </div>
                        </template>

                        <!-- Attendance -->
                        <template #item.attendanceRate="{ item }">
                            <div class="d-flex align-center gap-3">
                                <div class="flex-grow-1">
                                    <v-progress-linear :model-value="item.attendanceRate"
                                        :color="getAttendanceColor(item.attendanceRate)" height="10" rounded
                                        class="mb-1" />
                                    <div class="text-caption font-weight-bold">
                                        {{ item.attendanceRate.toFixed(1) }}%
                                        <v-chip :color="getAttendanceColor(item.attendanceRate)" size="x-small"
                                            class="ml-2" variant="flat">
                                            {{ getAttendanceLabel(item.attendanceRate) }}
                                        </v-chip>
                                    </div>
                                    <div class="text-caption text-medium-emphasis">
                                        P: {{ item.presentCount }} • L: {{ item.lateCount }} • A:
                                        {{ item.absentCount }} • E: {{ item.excusedCount }}
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- Actions -->
                        <template #item.actions="{ item }">
                            <v-btn icon="mdi-eye" variant="text" color="white" size="small" class="bg-primary"
                                @click="openOfferingDetails(item)">
                                <v-tooltip activator="parent" location="top">
                                    View Details
                                </v-tooltip>
                            </v-btn>
                        </template>

                        <template #no-data>
                            <div class="empty-state">
                                <v-icon icon="mdi-chart-box-outline" size="64" color="grey-lighten-1" />
                                <h3 class="empty-title">No reports found</h3>
                                <p class="empty-subtitle">
                                    {{ search ? 'Try adjusting your search terms' : 'No records match your filters' }}
                                </p>
                            </div>
                        </template>
                    </v-data-table>
                </div>
            </div>
        </div>

        <!-- ========================= -->
        <!-- DETAILS DIALOG (ADMIN VIEW) -->
        <!-- ========================= -->
        <v-dialog v-model="detailsDialog" max-width="1100" scrollable>
            <v-card rounded="xl" elevation="24" class="overflow-hidden">
                <v-card-title class="bg-gradient-primary text-white pa-6">
                    <div>
                        <div class="text-h5 font-weight-bold">
                            {{ selectedRow?.subjectName }}
                            <v-chip class="ml-3" color="white" text-color="primary" size="small">
                                {{ selectedRow?.groupName }}
                            </v-chip>
                        </div>
                        <div class="text-body-1 opacity-90 mt-2">
                            {{ selectedRow?.subjectCode }} • {{ selectedRow?.term }} • Gen
                            {{ selectedRow?.generation }}
                        </div>
                        <div class="text-caption opacity-90 mt-2">
                            Instructor:
                            <strong>{{ selectedRow?.instructorName }}</strong>
                            ({{ selectedRow?.instructorPosition }})
                        </div>
                    </div>
                    <v-btn icon variant="text" @click="detailsDialog = false" color="white">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pa-8">
                    <!-- Stats Row -->
                    <v-row class="mb-8">
                        <v-col cols="12" md="3">
                            <v-card elevation="4" rounded="lg" class="pa-5 text-center bg-blue-lighten-5">
                                <v-icon size="48" color="primary" class="mb-3">
                                    mdi-account-group
                                </v-icon>
                                <div class="text-h4 font-weight-black">
                                    {{ selectedRow?.totalStudents }}
                                </div>
                                <div class="text-body-1 font-weight-medium">Total Students</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-card elevation="4" rounded="lg" class="pa-5 text-center bg-green-lighten-5">
                                <v-icon size="48" color="success" class="mb-3">
                                    mdi-check-circle
                                </v-icon>
                                <div class="text-h4 font-weight-black">
                                    {{ selectedRow?.completedSessions }}
                                </div>
                                <div class="text-body-1 font-weight-medium">Sessions Completed</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-card elevation="4" rounded="lg" class="pa-5 text-center bg-orange-lighten-5">
                                <v-icon size="48" color="orange" class="mb-3">
                                    mdi-alert-circle
                                </v-icon>
                                <div class="text-h4 font-weight-black">
                                    {{ selectedRow?.absentCount }}
                                </div>
                                <div class="text-body-1 font-weight-medium">Total Absences</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-card elevation="4" rounded="lg" class="pa-5 text-center bg-purple-lighten-5">
                                <v-icon size="48" color="purple" class="mb-3">
                                    mdi-trending-up
                                </v-icon>
                                <div class="text-h4 font-weight-black">
                                    {{ (selectedRow?.attendanceRate || 0).toFixed(1) }}%
                                </div>
                                <div class="text-body-1 font-weight-medium">
                                    Overall Attendance
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Student table -->
                    <v-data-table :headers="studentHeaders" :items="studentAttendance" :loading="detailsLoading"
                        density="comfortable" class="elevation-3 rounded-lg">
                        <template #item.student="{ item }">
                            <div class="font-weight-bold">
                                {{ item.firstName }} {{ item.lastName }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ item.studentCode }} • {{ item.groupName }} • Gen {{ item.generation }}
                            </div>
                        </template>

                        <template #item.attendanceRate="{ item }">
                            <div class="d-flex align-center">
                                <v-progress-linear :model-value="item.attendanceRate" height="8" rounded :color="item.attendanceRate >= 90
                                    ? 'success'
                                    : item.attendanceRate >= 75
                                        ? 'warning'
                                        : 'error'
                                    " class="mr-3" />
                                <span class="text-caption font-weight-bold">
                                    {{ item.attendanceRate.toFixed(1) }}%
                                </span>
                            </div>
                        </template>

                        <template #item.flags="{ item }">
                            <div class="d-flex flex-wrap ga-1">
                                <v-chip v-if="item.isAtRisk" size="x-small" color="error" variant="flat"
                                    class="mr-1 mb-1">
                                    At Risk
                                </v-chip>
                                <v-chip v-if="item.absentCount >= 3" size="x-small" color="orange" variant="flat"
                                    class="mr-1 mb-1">
                                    3+ Absences
                                </v-chip>
                            </div>
                        </template>
                    </v-data-table>
                </v-card-text>

                <v-card-actions class="pa-6 bg-grey-lighten-4">
                    <v-spacer />
                    <v-btn variant="text" @click="detailsDialog = false">Close</v-btn>
                    <v-btn color="primary" variant="elevated" prepend-icon="mdi-download">
                        Export Detailed Report
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({
    layout: 'admin'
})

const lastUpdated = new Date().toLocaleString()
const currentTermLabel = ref<string | null>(null)

const isLoading = ref(false)
const detailsDialog = ref(false)
const detailsLoading = ref(false)
const search = ref('')

type FilterState = {
    termId: number | null
    generationId: number | null
    departmentId: number | null
    instructorId: number | null
    groupId: number | null
    subjectId: number | null
    minAttendance: number
}

const filters = ref<FilterState>({
    termId: null,
    generationId: null,
    departmentId: null,
    instructorId: null,
    groupId: null,
    subjectId: null,
    minAttendance: 0,
})

/**
 * Static options (you will later load from API using your DB schema)
 */
const termOptions = ref([
    { id: 1, label: 'Term 1, 2025' },
    { id: 2, label: 'Term 2, 2025' },
])

const generationOptions = ref([
    { id: 1, label: 'Batch 2023' },
    { id: 2, label: 'Batch 2024' },
    { id: 3, label: 'Batch 2025' },
])

const departmentOptions = ref([
    { id: 1, label: 'Computer Science' },
    { id: 2, label: 'Information Technology' },
])

const instructorOptions = ref([
    { id: 1, label: 'Dr. John Doe' },
    { id: 2, label: 'Ms. Jane Smith' },
])

const groupOptions = ref([
    { id: 1, label: 'Group A' },
    { id: 2, label: 'Group B' },
])

const subjectOptions = ref([
    { id: 1, label: 'CS101 - Intro to Programming' },
    { id: 2, label: 'CS202 - Data Structures' },
])

const headers = [
    { title: 'Instructor', value: 'instructor', width: 260 },
    { title: 'Subject', value: 'subject', width: 260 },
    { title: 'Group / Generation', value: 'group', width: 200 },
    { title: 'Term', value: 'term', width: 150 },
    {
        title: 'Students',
        value: 'totalStudents',
        width: 100,
        align: 'center' as const,
    },
    { title: 'Sessions', value: 'sessions', width: 200 },
    { title: 'Attendance', value: 'attendanceRate', width: 260 },
    { title: 'Actions', value: 'actions', sortable: false, width: 120 },
]

const studentHeaders = [
    { title: 'Student', value: 'student', width: 260 },
    { title: 'Present', value: 'presentCount', align: 'center' as const },
    { title: 'Late', value: 'lateCount', align: 'center' as const },
    { title: 'Absent', value: 'absentCount', align: 'center' as const },
    { title: 'Excused', value: 'excusedCount', align: 'center' as const },
    { title: 'Attendance %', value: 'attendanceRate', align: 'center' as const },
    { title: 'Flags', value: 'flags', sortable: false },
]

/**
 * Types shaped according to your DB:
 * - course_offerings + instructors + subjects + groups + generations + terms + attendance
 */
type AdminRow = {
    id: number
    offeringId: number
    instructorId: number
    instructorName: string
    instructorPosition: string
    subjectId: number
    subjectCode: string
    subjectName: string
    departmentId: number | null
    departmentName: string | null
    groupId: number
    groupName: string
    generationId: number
    generation: string
    termId: number
    term: string
    totalStudents: number
    plannedSessions: number
    completedSessions: number
    canceledSessions: number
    attendanceRate: number
    presentCount: number
    lateCount: number
    absentCount: number
    excusedCount: number
}

type StudentAttendanceRow = {
    studentId: number
    studentCode: string
    firstName: string
    lastName: string
    generation: string
    groupName: string
    presentCount: number
    lateCount: number
    absentCount: number
    excusedCount: number
    attendanceRate: number
    isAtRisk: boolean
}

/**
 * Mock data – replace with API results later.
 */
const rows = ref<AdminRow[]>([
    {
        id: 1,
        offeringId: 1,
        instructorId: 1,
        instructorName: 'Dr. John Doe',
        instructorPosition: 'professor',
        subjectId: 1,
        subjectCode: 'CS101',
        subjectName: 'Introduction to Programming',
        departmentId: 1,
        departmentName: 'Computer Science',
        groupId: 1,
        groupName: 'Group A',
        generationId: 3,
        generation: 'Batch 2025',
        termId: 1,
        term: 'Term 1, 2025',
        totalStudents: 32,
        plannedSessions: 16,
        completedSessions: 12,
        canceledSessions: 1,
        attendanceRate: 92.3,
        presentCount: 340,
        lateCount: 18,
        absentCount: 10,
        excusedCount: 5,
    },
    {
        id: 2,
        offeringId: 2,
        instructorId: 2,
        instructorName: 'Ms. Jane Smith',
        instructorPosition: 'lecturer',
        subjectId: 2,
        subjectCode: 'CS202',
        subjectName: 'Data Structures',
        departmentId: 1,
        departmentName: 'Computer Science',
        groupId: 2,
        groupName: 'Group B',
        generationId: 2,
        generation: 'Batch 2024',
        termId: 1,
        term: 'Term 1, 2025',
        totalStudents: 28,
        plannedSessions: 16,
        completedSessions: 10,
        canceledSessions: 0,
        attendanceRate: 84.7,
        presentCount: 260,
        lateCount: 22,
        absentCount: 18,
        excusedCount: 7,
    },
    {
        id: 3,
        offeringId: 3,
        instructorId: 1,
        instructorName: 'Dr. John Doe',
        instructorPosition: 'professor',
        subjectId: 2,
        subjectCode: 'CS202',
        subjectName: 'Data Structures',
        departmentId: 1,
        departmentName: 'Computer Science',
        groupId: 1,
        groupName: 'Group A',
        generationId: 1,
        generation: 'Batch 2023',
        termId: 2,
        term: 'Term 2, 2025',
        totalStudents: 25,
        plannedSessions: 14,
        completedSessions: 5,
        canceledSessions: 0,
        attendanceRate: 73.5,
        presentCount: 90,
        lateCount: 10,
        absentCount: 22,
        excusedCount: 3,
    },
])

const studentAttendance = ref<StudentAttendanceRow[]>([])
const selectedRow = ref<AdminRow | null>(null)

const filteredRows = computed(() =>
    rows.value.filter((r) => {
        if (filters.value.termId && r.termId !== filters.value.termId) return false
        if (filters.value.generationId && r.generationId !== filters.value.generationId)
            return false
        if (filters.value.departmentId && r.departmentId !== filters.value.departmentId)
            return false
        if (filters.value.instructorId && r.instructorId !== filters.value.instructorId)
            return false
        if (filters.value.groupId && r.groupId !== filters.value.groupId) return false
        if (filters.value.subjectId && r.subjectId !== filters.value.subjectId) return false
        if (r.attendanceRate < filters.value.minAttendance) return false
        return true
    }),
)

const summary = computed(() => {
    const rows = filteredRows.value
    const totalOfferings = rows.length

    const instructorSet = new Set<number>()
    const studentCount = rows.reduce((acc, r) => acc + r.totalStudents, 0)

    let totalSessions = 0
    let present = 0
    let late = 0
    let absent = 0

    rows.forEach((r) => {
        instructorSet.add(r.instructorId)
        totalSessions += r.plannedSessions + r.completedSessions + r.canceledSessions
        present += r.presentCount
        late += r.lateCount
        absent += r.absentCount
    })

    const avgAttendance =
        rows.length > 0
            ? rows.reduce((sum, r) => sum + r.attendanceRate, 0) / rows.length
            : 0

    return {
        totalOfferings,
        totalInstructors: instructorSet.size,
        totalStudents: studentCount,
        totalSessions,
        avgAttendance,
        present,
        late,
        absent,
    }
})

type SummaryCard = {
    label: string
    value: string | number
    icon: string
    description: string
    color: string
    chipColor: string
    trend?: string
}

const summaryCards = computed<SummaryCard[]>(() => [
    {
        label: 'Active Instructors',
        value: summary.value.totalInstructors,
        icon: 'mdi-account-tie',
        description: 'Instructors with active course offerings',
        color: 'deep-purple',
        chipColor: 'green',
        trend: '+2%',
    },
    {
        label: 'Enrolled Students',
        value: summary.value.totalStudents,
        icon: 'mdi-account-group',
        description: 'Total students across filtered offerings',
        color: 'indigo',
        chipColor: 'blue',
        trend: '+5%',
    },
    {
        label: 'Total Sessions',
        value: summary.value.totalSessions,
        icon: 'mdi-calendar-clock',
        description: 'Planned + completed + cancelled sessions',
        color: 'amber',
        chipColor: 'orange',
        trend: '+3%',
    },
    {
        label: 'Avg Attendance',
        value: `${summary.value.avgAttendance.toFixed(1)}%`,
        icon: 'mdi-chart-line',
        description: 'Average attendance across all filtered offerings',
        color: 'deep-purple-accent-2',
        chipColor: 'purple',
        trend: '+1.2%',
    },
])

function getAttendanceColor(rate: number): string {
    if (rate >= 90) return 'success'
    if (rate >= 75) return 'warning'
    return 'error'
}

function getAttendanceLabel(rate: number): string {
    if (rate >= 90) return 'High'
    if (rate >= 75) return 'Medium'
    return 'Low'
}

async function fetchReport() {
    isLoading.value = true
    try {
        // TODO: call your backend:
        // - aggregate from course_offerings, sessions, attendance
        // - join instructors, subjects, groups, generations, terms
        await new Promise((resolve) => setTimeout(resolve, 600))
    } finally {
        isLoading.value = false
    }
}

async function openOfferingDetails(row: AdminRow) {
    selectedRow.value = row
    detailsDialog.value = true
    detailsLoading.value = true

    try {
        // TODO: call backend: fetch attendance per student
        await new Promise((resolve) => setTimeout(resolve, 600))

        studentAttendance.value = [
            {
                studentId: 1,
                studentCode: 'STU001',
                firstName: 'Alice',
                lastName: 'Chan',
                generation: row.generation,
                groupName: row.groupName,
                presentCount: 10,
                lateCount: 1,
                absentCount: 1,
                excusedCount: 0,
                attendanceRate: 91.7,
                isAtRisk: false,
            },
            {
                studentId: 2,
                studentCode: 'STU002',
                firstName: 'Bob',
                lastName: 'Sok',
                generation: row.generation,
                groupName: row.groupName,
                presentCount: 8,
                lateCount: 1,
                absentCount: 3,
                excusedCount: 0,
                attendanceRate: 75.0,
                isAtRisk: false,
            },
            {
                studentId: 3,
                studentCode: 'STU003',
                firstName: 'Dara',
                lastName: 'Lim',
                generation: row.generation,
                groupName: row.groupName,
                presentCount: 6,
                lateCount: 0,
                absentCount: 6,
                excusedCount: 0,
                attendanceRate: 50.0,
                isAtRisk: true,
            },
        ]
    } finally {
        detailsLoading.value = false
    }
}

onMounted(() => {
    fetchReport()
})
</script>

<style scoped>
.reports-page {
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
    margin-bottom: 20px;
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

.stats-cards {
    display: flex;
    gap: 16px;
}

.stat-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    min-width: 110px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.modern-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 20px;
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
}

.modern-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.export-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
    border: none !important;
    color: white !important;
}

.modern-menu {
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
}

.menu-item {
    padding: 12px 16px;
    border-radius: 8px;
    margin: 4px;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background: #f8fafc;
}

/* Modern Table Section */
.modern-table-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
}

.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

/* Filters Panel */
.filters-panel-wrapper {
    padding: 20px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.filters-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.filters-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.filter-item {
    flex: 1;
    min-width: 200px;
}

.slider-item {
    flex: 1.5;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.slider-wrapper {
    background: white;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.slider-label {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
}

.slider-value {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
}

/* Summary Cards in Table */
.summary-cards-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
}

.summary-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid rgba(63, 81, 181, 0.1);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(63, 81, 181, 0.12);
}

.summary-card-0 {
    border-left: 4px solid #673ab7;
}

.summary-card-1 {
    border-left: 4px solid #3f51b5;
}

.summary-card-2 {
    border-left: 4px solid #ff9800;
}

.summary-card-3 {
    border-left: 4px solid #9c27b0;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.card-icon {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.card-trend {
    font-weight: 600;
    font-size: 11px;
}

.card-value {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 8px;
}

.card-label {
    font-size: 15px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 4px;
}

.card-description {
    font-size: 12px;
    color: #64748b;
    line-height: 1.4;
}

/* Table Toolbar */
.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.toolbar-left {
    flex: 1;
}

.table-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
}

.table-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.toolbar-right {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-container {
    min-width: 350px;
}

.search-input :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Modern Table Wrapper */
.modern-table-wrapper {
    position: relative;
    overflow: hidden;
}

.modern-table {
    width: 100%;
}

.modern-table :deep(.v-table__wrapper > table > thead > tr) {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.modern-table :deep(.v-table__wrapper > table > thead > tr > th) {
    color: white !important;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 20px 16px;
    border: none;
}

.modern-table :deep(.v-table__wrapper > table > tbody > tr) {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
}

.modern-table :deep(.v-table__wrapper > table > tbody > tr:hover) {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modern-table :deep(.v-table__wrapper > table > tbody > tr > td) {
    padding: 16px;
    border: none;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 64px 32px;
    color: #64748b;
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #475569;
    margin: 16px 0 8px 0;
}

.empty-subtitle {
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
}

/* Dialog Styles */
.bg-gradient-primary {
    background: linear-gradient(90deg, #3f51b5 0%, #5c6bc0 50%, #7986cb 100%);
}

/* Responsive Design */
@media (max-width: 1200px) {
    .header-container {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
    }

    .action-section {
        justify-content: center;
    }

    .stats-cards {
        justify-content: center;
        flex-wrap: wrap;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 16px 20px;
    }

    .modern-table-section {
        padding: 16px 20px;
    }

    .title-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .toolbar-right {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .search-container {
        min-width: auto;
    }

    .table-toolbar {
        flex-direction: column;
        gap: 16px;
    }

    .filters-row {
        flex-direction: column;
    }

    .filter-item {
        min-width: 100%;
    }

    .summary-cards-wrapper {
        grid-template-columns: 1fr;
    }
}
</style>
