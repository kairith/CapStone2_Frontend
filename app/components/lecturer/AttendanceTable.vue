<template>
    <div class="attendance-table-wrapper">
        <!-- Search and Filters -->
        <v-card class="filter-card mb-6">
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="searchTerm"
                            label="Search students..."
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            density="comfortable"
                            clearable
                            @input="onSearchChange"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select
                            v-model="statusFilter"
                            :items="statusOptions"
                            label="Filter by Status"
                            variant="outlined"
                            density="comfortable"
                            clearable
                            @update:model-value="onStatusChange"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select
                            v-model="methodFilter"
                            :items="methodOptions"
                            label="Filter by Method"
                            variant="outlined"
                            density="comfortable"
                            clearable
                            @update:model-value="onMethodChange"
                        />
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-btn
                            color="primary"
                            block
                            prepend-icon="mdi-refresh"
                            @click="refreshData"
                        >
                            Refresh
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Session Info -->
        <v-card v-if="sessionInfo" class="session-info-card mb-6">
            <v-card-text>
                <div class="session-header">
                    <div class="session-details">
                        <h3 class="session-title">
                            <v-icon class="mr-2">mdi-school</v-icon>
                            {{ sessionInfo.name }}
                        </h3>
                        <div class="session-meta">
                            <span class="meta-item">
                                <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                                {{ formatDate(sessionInfo.date) }}
                            </span>
                            <span class="meta-item">
                                <v-icon size="16" class="mr-1">mdi-clock</v-icon>
                                {{ sessionInfo.start_time }} - {{ sessionInfo.end_time }}
                            </span>
                            <span class="meta-item">
                                <v-icon size="16" class="mr-1">mdi-door</v-icon>
                                {{ sessionInfo.room }}
                            </span>
                        </div>
                    </div>
                    <div class="session-stats">
                        <div class="quick-stat">
                            <span class="stat-value">{{ statistics.present }}/{{ statistics.total }}</span>
                            <span class="stat-label">Present</span>
                        </div>
                        <div class="quick-stat">
                            <span class="stat-value">{{ attendanceRate }}%</span>
                            <span class="stat-label">Attendance</span>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- Attendance Table -->
        <v-card class="at-card">
            <div class="at-header">
                <h2 class="at-title">
                    <v-icon class="mr-2">mdi-clipboard-list</v-icon>
                    Student Attendance ({{ filteredAttendance.length }} records)
                </h2>
                <div class="at-rows-per-page">
                    <span class="at-rows-label">Rows per page:</span>
                    <v-select 
                        v-model="rowsPerPage" 
                        :items="[10, 25, 50, 100]" 
                        density="compact" 
                        hide-details
                        variant="outlined" 
                        class="at-rows-select" 
                    />
                </div>
            </div>

            <div class="at-table-container">
                <table class="at-table">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>STUDENT ID</th>
                            <th>STUDENT NAME</th>
                            <th>STATUS</th>
                            <th>CHECK IN TIME</th>
                            <th>CHECK OUT TIME</th>
                            <th>METHOD</th>
                            <th>VERIFICATION</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="paginatedAttendance.length === 0">
                            <td colspan="9" class="at-empty">
                                <div class="empty-content">
                                    <v-icon size="48" class="empty-icon">mdi-clipboard-off</v-icon>
                                    <p class="empty-text">No attendance records found</p>
                                    <p class="empty-subtext">Try adjusting your filters or refresh the data</p>
                                </div>
                            </td>
                        </tr>

                        <tr v-for="(record, index) in paginatedAttendance" :key="record.id" class="at-row">
                            <td class="at-cell-number">{{ startIndex + index + 1 }}</td>
                            <td class="at-cell-text">{{ record.student_id }}</td>
                            <td class="at-cell-text">
                                <div class="student-info">
                                    <span class="student-name">{{ record.student_name }}</span>
                                    <span v-if="record.similarity_score" class="similarity-score">
                                        {{ Math.round(record.similarity_score) }}% match
                                    </span>
                                </div>
                            </td>
                            <td class="at-cell-text">
                                <span class="at-status-chip" :class="getStatusClass(record.status)">
                                    <v-icon size="14" class="mr-1">{{ getStatusIcon(record.status) }}</v-icon>
                                    {{ record.status }}
                                </span>
                            </td>
                            <td class="at-cell-text">
                                {{ record.checkin_time ? formatTime(record.checkin_time) : 'N/A' }}
                            </td>
                            <td class="at-cell-text">
                                {{ record.checkout_time ? formatTime(record.checkout_time) : 'N/A' }}
                            </td>
                            <td class="at-cell-text">
                                <span class="at-method-chip" :class="getMethodClass(record.method)">
                                    <v-icon size="14" class="mr-1">{{ getMethodIcon(record.method) }}</v-icon>
                                    {{ record.method }}
                                </span>
                            </td>
                            <td class="at-cell-text">
                                <span class="at-verification-chip" :class="getVerificationClass(record.verification_status)">
                                    <v-icon size="12" class="mr-1">{{ getVerificationIcon(record.verification_status) }}</v-icon>
                                    {{ record.verification_status }}
                                </span>
                            </td>
                            <td class="at-cell-action">
                                <v-btn 
                                    icon 
                                    size="small" 
                                    class="at-btn at-btn-view" 
                                    @click="viewDetails(record)"
                                    :aria-label="`View details for ${record.student_name}`"
                                >
                                    <v-icon size="18">mdi-eye</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="filteredAttendance.length > 0" class="at-pagination">
                <div class="pagination-info">
                    Showing {{ startIndex + 1 }}-{{ Math.min(startIndex + rowsPerPage, filteredAttendance.length) }} of {{ filteredAttendance.length }} records
                </div>
                <div class="pagination-controls">
                    <v-btn 
                        size="small" 
                        variant="outlined" 
                        :disabled="currentPage === 1" 
                        @click="goPrevious"
                        prepend-icon="mdi-chevron-left"
                    >
                        Previous
                    </v-btn>
                    <span class="at-page-label">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <v-btn 
                        size="small" 
                        variant="outlined" 
                        :disabled="currentPage === totalPages" 
                        @click="goNext"
                        append-icon="mdi-chevron-right"
                    >
                        Next
                    </v-btn>
                </div>
            </div>
        </v-card>

        <!-- Attendance Details Modal -->
        <v-dialog v-model="isDetailsDialogOpen" max-width="800px">
            <v-card>
                <v-card-title class="dialog-header">
                    <v-icon class="mr-2">mdi-account-details</v-icon>
                    Attendance Details
                </v-card-title>
                <v-card-text v-if="selectedRecord" class="dialog-content">
                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="detail-section">
                                <h4 class="section-title">Student Information</h4>
                                <div class="detail-item">
                                    <strong>Student ID:</strong>
                                    <span>{{ selectedRecord.student_id }}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>Student Name:</strong>
                                    <span>{{ selectedRecord.student_name }}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>Status:</strong>
                                    <span class="at-status-chip" :class="getStatusClass(selectedRecord.status)">
                                        <v-icon size="14" class="mr-1">{{ getStatusIcon(selectedRecord.status) }}</v-icon>
                                        {{ selectedRecord.status }}
                                    </span>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="detail-section">
                                <h4 class="section-title">Attendance Details</h4>
                                <div class="detail-item">
                                    <strong>Check In:</strong>
                                    <span>{{ selectedRecord.checkin_time ? formatDateTime(selectedRecord.checkin_time) : 'N/A' }}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>Check Out:</strong>
                                    <span>{{ selectedRecord.checkout_time ? formatDateTime(selectedRecord.checkout_time) : 'N/A' }}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>Method:</strong>
                                    <span class="at-method-chip" :class="getMethodClass(selectedRecord.method)">
                                        <v-icon size="14" class="mr-1">{{ getMethodIcon(selectedRecord.method) }}</v-icon>
                                        {{ selectedRecord.method }}
                                    </span>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    
                    <div v-if="selectedRecord.method === 'Face Recognition'" class="detail-section">
                        <h4 class="section-title">Verification Details</h4>
                        <div class="verification-details">
                            <div class="detail-item">
                                <strong>Verification Status:</strong>
                                <span class="at-verification-chip" :class="getVerificationClass(selectedRecord.verification_status)">
                                    <v-icon size="12" class="mr-1">{{ getVerificationIcon(selectedRecord.verification_status) }}</v-icon>
                                    {{ selectedRecord.verification_status }}
                                </span>
                            </div>
                            <div v-if="selectedRecord.similarity_score" class="detail-item">
                                <strong>Similarity Score:</strong>
                                <span class="similarity-badge">{{ Math.round(selectedRecord.similarity_score) }}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="selectedRecord.remarks" class="detail-section">
                        <h4 class="section-title">Additional Notes</h4>
                        <p class="remarks-text">{{ selectedRecord.remarks }}</p>
                    </div>
                </v-card-text>
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn color="primary" variant="flat" @click="closeDetailsDialog">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, watch } from 'vue'
import type { AttendanceRecord, AttendanceSession } from '~/types/attendance'
import { useAttendanceStore } from '~/stores/useAttendanceStore'

interface Props {
    attendanceRecords: AttendanceRecord[]
    sessionInfo?: AttendanceSession
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'refresh'): void
}>()

// Store
const attendanceStore = useAttendanceStore()

// State
const searchTerm = ref('')
const statusFilter = ref('')
const methodFilter = ref('')
const rowsPerPage = ref(25)
const currentPage = ref(1)
const filteredAttendance = ref<AttendanceRecord[]>([])
const isDetailsDialogOpen = ref(false)
const selectedRecord = ref<AttendanceRecord | null>(null)

// Filter options
const statusOptions = ['Present', 'Absent', 'Late', 'Excused']
const methodOptions = ['Face Recognition', 'Manual', 'QR Code']

// Initialize filtered records
filteredAttendance.value = props.attendanceRecords

// Computed
const statistics = computed(() => {
    const records = filteredAttendance.value
    return {
        total: records.length,
        present: records.filter(r => r.status === 'Present').length,
        absent: records.filter(r => r.status === 'Absent').length,
        late: records.filter(r => r.status === 'Late').length,
        excused: records.filter(r => r.status === 'Excused').length
    }
})

const attendanceRate = computed(() => {
    const total = statistics.value.total
    const present = statistics.value.present + statistics.value.late
    return total > 0 ? Math.round((present / total) * 100) : 0
})

const totalPages = computed(() => {
    const total = Math.ceil(filteredAttendance.value.length / rowsPerPage.value)
    return total || 1
})

const startIndex = computed(() => (currentPage.value - 1) * rowsPerPage.value)

const paginatedAttendance = computed(() =>
    filteredAttendance.value.slice(
        startIndex.value,
        startIndex.value + rowsPerPage.value
    )
)

// Methods
const filterAttendance = () => {
    let filtered = [...props.attendanceRecords]

    // Search filter
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(record => 
            record.student_name.toLowerCase().includes(term) ||
            record.student_id.toLowerCase().includes(term)
        )
    }

    // Status filter
    if (statusFilter.value) {
        const sf = statusFilter.value.toLowerCase()
        filtered = filtered.filter(record => record.status.toLowerCase() === sf)
    }

    // Method filter
    if (methodFilter.value) {
        const mf = methodFilter.value.toLowerCase()
        filtered = filtered.filter(record => record.method.toLowerCase() === mf)
    }

    // assign filtered results and reset pagination
    filteredAttendance.value = filtered
    currentPage.value = 1
}

// Filter change handlers
const onSearchChange = () => {
    attendanceStore.setSearchQuery(searchTerm.value)
    filterAttendance()
}

const onStatusChange = () => {
    attendanceStore.setStatusFilter(statusFilter.value)
    filterAttendance()
}

const onMethodChange = () => {
    attendanceStore.setMethodFilter(methodFilter.value)
    filterAttendance()
}

const refreshData = () => {
    emit('refresh')
}

// Status helpers
const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'present': return 'at-status-present'
        case 'late': return 'at-status-late'
        case 'absent': return 'at-status-absent'
        case 'excused': return 'at-status-excused'
        default: return 'at-status-default'
    }
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'present': return 'mdi-check-circle'
        case 'late': return 'mdi-clock-alert'
        case 'absent': return 'mdi-close-circle'
        case 'excused': return 'mdi-information'
        default: return 'mdi-help-circle'
    }
}

const getMethodClass = (method: string) => {
    switch (method.toLowerCase()) {
        case 'face recognition': return 'at-method-face'
        case 'manual': return 'at-method-manual'
        case 'qr code': return 'at-method-qr'
        default: return 'at-method-default'
    }
}

const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
        case 'face recognition': return 'mdi-face-recognition'
        case 'manual': return 'mdi-pencil'
        case 'qr code': return 'mdi-qrcode'
        default: return 'mdi-help'
    }
}

const getVerificationClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'verified': return 'at-verification-verified'
        case 'failed': return 'at-verification-failed'
        case 'pending': return 'at-verification-pending'
        default: return 'at-verification-default'
    }
}

const getVerificationIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'verified': return 'mdi-check'
        case 'failed': return 'mdi-close'
        case 'pending': return 'mdi-clock'
        default: return 'mdi-help'
    }
}

// Date formatting
const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    })
}

const formatDateTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Dialog methods
const viewDetails = (record: AttendanceRecord) => {
    selectedRecord.value = record
    isDetailsDialogOpen.value = true
}

const closeDetailsDialog = () => {
    isDetailsDialogOpen.value = false
    selectedRecord.value = null
}

// Pagination
const goPrevious = () => {
    if (currentPage.value > 1) currentPage.value--
}

const goNext = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

// Watch for prop changes
watch(() => props.attendanceRecords, () => {
    filterAttendance()
}, { immediate: true })
</script>

<style scoped>
.attendance-table-wrapper {
    width: 100%;
}

/* Filter Card */
.filter-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Session Info Card */
.session-info-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #3b82f6;
}

.session-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.session-title {
    color: #1e293b;
    margin: 0 0 12px 0;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.session-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.meta-item {
    color: #64748b;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
}

.session-stats {
    display: flex;
    gap: 24px;
}

.quick-stat {
    text-align: center;
    min-width: 80px;
}

.stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.stat-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 2px;
}

/* Statistics Cards */
.stat-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
}

.stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 4px;
}

/* Main Table Card */
.at-card {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    border: 1px solid #e5e7eb;
}

.at-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px 24px;
    border-bottom: 1px solid #f1f5f9;
}

.at-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
}

.at-rows-per-page {
    display: flex;
    align-items: center;
    gap: 8px;
}

.at-rows-label {
    font-size: 13px;
    color: #6b7280;
}

.at-rows-select {
    max-width: 90px;
}

.at-table-container {
    width: 100%;
    overflow-x: auto;
    padding: 0 16px;
}

.at-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #ffffff;
}

.at-table thead tr {
    background: #f8fafc;
}

.at-table th {
    padding: 16px 12px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
}

.at-table tbody tr:nth-child(even) {
    background-color: #f8fafc;
}

.at-table tbody tr:hover {
    background-color: #f1f5f9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.at-table td {
    padding: 16px 12px;
    font-size: 14px;
    color: #111827;
    border-top: 1px solid #e5e7eb;
    vertical-align: middle;
}

.at-cell-number {
    width: 60px;
    font-weight: 600;
    color: #6b7280;
}

.at-cell-action {
    width: 80px;
    text-align: center;
}

/* Student info */
.student-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.student-name {
    font-weight: 500;
}

.similarity-score {
    font-size: 0.75rem;
    color: #10b981;
    font-weight: 500;
}

/* Status chips */
.at-status-chip, .at-method-chip, .at-verification-chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
}

.at-status-present {
    background-color: #dcfce7;
    color: #166534;
}

.at-status-late {
    background-color: #fef3c7;
    color: #92400e;
}

.at-status-absent {
    background-color: #fee2e2;
    color: #b91c1c;
}

.at-status-excused {
    background-color: #dbeafe;
    color: #1e40af;
}

.at-method-face {
    background-color: #ede9fe;
    color: #6b21a8;
}

.at-method-manual {
    background-color: #f3f4f6;
    color: #374151;
}

.at-method-qr {
    background-color: #ecfdf5;
    color: #065f46;
}

.at-verification-verified {
    background-color: #dcfce7;
    color: #166534;
}

.at-verification-failed {
    background-color: #fee2e2;
    color: #b91c1c;
}

.at-verification-pending {
    background-color: #fef3c7;
    color: #92400e;
}

/* Action button */
.at-btn {
    border-radius: 8px;
    min-width: 36px;
    height: 36px;
    transition: all 0.2s;
}

.at-btn-view {
    background-color: #3b82f6;
    color: #ffffff;
}

.at-btn-view:hover {
    background-color: #2563eb;
    transform: scale(1.05);
}

/* Empty state */
.at-empty {
    text-align: center;
    padding: 48px 24px;
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.empty-icon {
    color: #9ca3af;
}

.empty-text {
    color: #4b5563;
    font-weight: 500;
    margin: 0;
}

.empty-subtext {
    color: #9ca3af;
    font-size: 0.875rem;
    margin: 0;
}

/* Pagination */
.at-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px 20px 24px;
    border-top: 1px solid #e5e7eb;
    background: #f8fafc;
}

.pagination-info {
    font-size: 13px;
    color: #4b5563;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.at-page-label {
    font-size: 13px;
    color: #4b5563;
    font-weight: 500;
}

/* Dialog styling */
.dialog-header {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    padding: 20px 24px;
}

.dialog-content {
    padding: 24px;
}

.dialog-actions {
    padding: 16px 24px 24px 24px;
    background: #f8fafc;
}

.detail-section {
    margin-bottom: 24px;
}

.section-title {
    color: #1e293b;
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

.detail-item strong {
    color: #374151;
    font-weight: 500;
    min-width: 120px;
}

.detail-item span {
    color: #111827;
    text-align: right;
}

.verification-details {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
}

.similarity-badge {
    background: #10b981;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.875rem;
}

.remarks-text {
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 16px;
    border-radius: 0 8px 8px 0;
    color: #374151;
    line-height: 1.6;
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .session-header {
        flex-direction: column;
        gap: 16px;
    }
    
    .session-stats {
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
    }
    
    .at-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 16px 20px;
    }

    .at-rows-per-page {
        align-self: flex-end;
        width: 100%;
        justify-content: flex-end;
    }
    
    .at-table th,
    .at-table td {
        padding: 12px 8px;
        font-size: 12px;
    }

    .at-pagination {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
    
    .pagination-controls {
        order: 1;
    }
    
    .pagination-info {
        order: 2;
    }

    .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    
    .detail-item span {
        text-align: left;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .at-card {
        background: #1f2937;
        border-color: #374151;
    }

    .at-table {
        background: #1f2937;
    }

    .at-table thead tr {
        background: #111827;
    }

    .at-table th {
        color: #9ca3af;
        border-bottom-color: #374151;
    }

    .at-table td {
        color: #f9fafb;
        border-top-color: #374151;
    }

    .at-table tbody tr:nth-child(even) {
        background-color: #111827;
    }

    .at-table tbody tr:hover {
        background-color: #1f2937;
    }
}
</style>