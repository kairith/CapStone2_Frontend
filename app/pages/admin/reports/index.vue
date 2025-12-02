<template>
    <v-container fluid class="py-10 px-4 px-md-8 admin-report">
        <!-- ========================= -->
        <!-- PAGE HEADER -->
        <!-- ========================= -->
        <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center mb-8 gap-4">
            <div>
                <h1 class="text-h4 font-weight-bold text-primary mb-2">
                    Teaching & Attendance Analytics (Admin)
                </h1>
                <p class="text-body-1 text-medium-emphasis max-w-600">
                    Centralized overview of instructors, course offerings, sessions, and student
                    attendance across terms, generations, and departments.
                </p>
            </div>

            <div class="text-center text-md-end">
                <v-chip size="large" color="primary" class="font-weight-bold text-h6 px-5" elevation="2">
                    <v-icon start size="28">mdi-shield-account</v-icon>
                    Admin Dashboard
                </v-chip>

                <div class="mt-3 text-caption text-medium-emphasis">
                    <v-icon small class="mr-1">mdi-calendar</v-icon>
                    Term Filter:
                    <strong>{{ currentTermLabel || 'All terms' }}</strong>
                </div>
                <div class="text-caption text-medium-emphasis">
                    <v-icon small class="mr-1">mdi-clock-outline</v-icon>
                    Updated {{ lastUpdated }}
                </div>
            </div>
        </div>

        <!-- ========================= -->
        <!-- FILTERS BAR -->
        <!-- ========================= -->
        <v-card elevation="4" rounded="xl" class="mb-8 overflow-hidden border">
            <v-card-text class="pa-6">
                <v-row align="center">
                    <!-- Term -->
                    <v-col cols="12" sm="6" md="2">
                        <v-select v-model="filters.termId" :items="termOptions" label="Academic Term" variant="outlined"
                            density="comfortable" item-title="label" item-value="id" clearable
                            prepend-inner-icon="mdi-calendar-month" hide-details />
                    </v-col>

                    <!-- Generation -->
                    <v-col cols="12" sm="6" md="2">
                        <v-select v-model="filters.generationId" :items="generationOptions" label="Generation"
                            variant="outlined" density="comfortable" item-title="label" item-value="id" clearable
                            prepend-inner-icon="mdi-school" hide-details />
                    </v-col>

                    <!-- Department -->
                    <v-col cols="12" sm="6" md="2">
                        <v-select v-model="filters.departmentId" :items="departmentOptions" label="Department"
                            variant="outlined" density="comfortable" item-title="label" item-value="id" clearable
                            prepend-inner-icon="mdi-office-building" hide-details />
                    </v-col>

                    <!-- Instructor -->
                    <v-col cols="12" sm="6" md="3">
                        <v-select v-model="filters.instructorId" :items="instructorOptions" label="Instructor"
                            variant="outlined" density="comfortable" item-title="label" item-value="id" clearable
                            prepend-inner-icon="mdi-account-tie" hide-details />
                    </v-col>

                    <!-- Min Attendance -->
                    <v-col cols="12" sm="6" md="3">
                        <div class="d-flex flex-column">
                            <div class="d-flex align-center justify-space-between mb-1">
                                <span class="text-caption text-medium-emphasis">
                                    Minimum Attendance %
                                </span>
                                <span class="text-caption font-weight-bold">
                                    {{ filters.minAttendance }}%
                                </span>
                            </div>
                            <v-slider v-model="filters.minAttendance" :min="0" :max="100" :step="5" hide-details
                                thumb-label />
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-4" align="center">
                    <!-- Group -->
                    <v-col cols="12" sm="6" md="3">
                        <v-select v-model="filters.groupId" :items="groupOptions" label="Group" variant="outlined"
                            density="comfortable" item-title="label" item-value="id" clearable
                            prepend-inner-icon="mdi-account-group" hide-details />
                    </v-col>

                    <!-- Subject -->
                    <v-col cols="12" sm="6" md="3">
                        <v-select v-model="filters.subjectId" :items="subjectOptions" label="Subject" variant="outlined"
                            density="comfortable" item-title="label" item-value="id" clearable
                            prepend-inner-icon="mdi-book-open-page-variant" hide-details />
                    </v-col>

                    <!-- Actions -->
                    <v-col cols="12" md="6" class="d-flex align-center justify-end flex-wrap gap-2">
                        <v-btn size="large" color="primary" variant="elevated" :loading="isLoading"
                            prepend-icon="mdi-refresh" @click="fetchReport" class="rounded-lg"
                            style="margin-right: 30px">
                            Refresh
                        </v-btn>

                        <v-btn size="large" color="grey-darken-1" variant="outlined" prepend-icon="mdi-download"
                            class="rounded-lg">
                            Export Summary
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- ========================= -->
        <!-- SUMMARY CARDS -->
        <!-- ========================= -->
        <v-row class="mb-10">
            <v-col v-for="(card, i) in summaryCards" :key="i" cols="12" sm="6" md="3">
                <v-card rounded="xl" elevation="6" class="h-100 pa-6 summary-card-gradient"
                    :class="`summary-card-${i}`">
                    <div class="d-flex align-center justify-space-between mb-4">
                        <v-avatar size="56" :color="card.color" class="shadow-lg">
                            <v-icon size="32" color="white">{{ card.icon }}</v-icon>
                        </v-avatar>
                        <v-chip :color="card.chipColor" size="small" variant="flat" class="font-weight-bold">
                            {{ card.trend || '+0%' }}
                        </v-chip>
                    </div>

                    <div class="text-h3 font-weight-black text-primary mb-1">
                        {{ card.value }}
                    </div>
                    <div class="text-body-1 font-weight-medium text-high-emphasis">
                        {{ card.label }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                        {{ card.description }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- ========================= -->
        <!-- MAIN TABLE (ADMIN VIEW) -->
        <!-- ========================= -->
        <v-card rounded="xl" elevation="6" class="overflow-hidden">
            <v-card-title class="bg-gradient-primary text-white pa-6">
                <div>
                    <div class="text-h5 font-weight-bold">
                        Instructor & Course Attendance Overview
                    </div>
                    <div class="text-body-1 opacity-90">
                        Aggregated attendance performance by instructor, subject, and group.
                    </div>
                </div>

                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"
                    placeholder="Search by instructor, subject, code, or group..." variant="solo" density="comfortable"
                    hide-details class="mt-4 max-w-400 search-field-white" bg-color="white" rounded />
            </v-card-title>

            <v-data-table :headers="headers" :items="filteredRows" :search="search" :loading="isLoading"
                density="comfortable" class="elevation-1 custom-table" :items-per-page="10" hover>
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
                                :color="getAttendanceColor(item.attendanceRate)" height="10" rounded class="mb-1" />
                            <div class="text-caption font-weight-bold">
                                {{ item.attendanceRate.toFixed(1) }}%
                                <v-chip :color="getAttendanceColor(item.attendanceRate)" size="x-small" class="ml-2"
                                    variant="flat">
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
                    <v-alert type="info" variant="tonal" class="ma-6">
                        No records match your filters. Try adjusting term, department, or instructor.
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>

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
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

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
        align: 'center',
    },
    { title: 'Sessions', value: 'sessions', width: 200 },
    { title: 'Attendance', value: 'attendanceRate', width: 260 },
    { title: 'Actions', value: 'actions', sortable: false, width: 120 },
]

const studentHeaders = [
    { title: 'Student', value: 'student', width: 260 },
    { title: 'Present', value: 'presentCount', align: 'center' },
    { title: 'Late', value: 'lateCount', align: 'center' },
    { title: 'Absent', value: 'absentCount', align: 'center' },
    { title: 'Excused', value: 'excusedCount', align: 'center' },
    { title: 'Attendance %', value: 'attendanceRate', align: 'center' },
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
.admin-report {
    background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
    min-height: 100vh;
}

.bg-gradient-primary {
    background: linear-gradient(90deg, #3f51b5 0%, #5c6bc0 50%, #7986cb 100%);
}

.summary-card-gradient {
    background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid rgba(63, 81, 181, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-card-0 {
    border-left: 5px solid #4caf50;
}

.summary-card-1 {
    border-left: 5px solid #2196f3;
}

.summary-card-2 {
    border-left: 5px solid #ff9800;
}

.summary-card-3 {
    border-left: 5px solid #9c27b0;
}

.summary-card-gradient:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(63, 81, 181, 0.15) !important;
}

.custom-table .v-table__wrapper>table>tbody>tr:hover {
    background: #e8f0ff !important;
}

.custom-table .v-data-table-header {
    background: #f5f7fb;
}

.search-field-white .v-field__input {
    color: #1a1a1a !important;
}

.gap-3 {
    gap: 12px;
}

.max-w-600 {
    max-width: 600px;
}

.max-w-400 {
    max-width: 400px;
}

.border {
    border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
