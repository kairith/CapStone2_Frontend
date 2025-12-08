<template>
    <div class="professor-detail-page">
        <!-- Header Section -->
        <div class="detail-header">
            <div class="header-container">
                <div class="header-left">
                    <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="goBack" class="back-btn" />
                    <div class="title-section">
                        <div class="breadcrumb">
                            <span class="breadcrumb-item">Admin</span>
                            <v-icon size="small" class="breadcrumb-separator">mdi-chevron-right</v-icon>
                            <span class="breadcrumb-item" @click="goBack" style="cursor: pointer;">Professors</span>
                            <v-icon size="small" class="breadcrumb-separator">mdi-chevron-right</v-icon>
                            <span class="breadcrumb-item active">Details</span>
                        </div>
                        <h1 class="page-title">Professor Details</h1>
                    </div>
                </div>
                <div class="header-actions">
                    <v-btn color="warning" variant="flat" prepend-icon="mdi-pencil" @click="handleEdit"
                        class="action-btn">
                        Edit Professor
                    </v-btn>
                    <v-btn color="error" variant="outlined" prepend-icon="mdi-delete" @click="confirmDelete"
                        class="action-btn">
                        Delete
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="detail-content" v-if="professor">
            <div class="content-container">
                <!-- Left Column -->
                <div class="left-column">
                    <!-- Profile Card -->
                    <v-card class="profile-card" elevation="2">
                        <div class="profile-header">
                            <div class="avatar-container">
                                <v-avatar size="100" color="primary">
                                    <v-icon size="60">mdi-account</v-icon>
                                </v-avatar>
                                <div class="status-badge" :class="professor.status.toLowerCase().replace(' ', '-')">
                                    {{ professor.status }}
                                </div>
                            </div>
                            <h2 class="professor-name">{{ professor.name }}</h2>
                            <p class="professor-code">{{ professor.professor_code }}</p>
                        </div>

                        <v-divider class="my-4" />

                        <div class="profile-details">
                            <div class="detail-item">
                                <div class="detail-icon">
                                    <v-icon color="primary">mdi-email</v-icon>
                                </div>
                                <div class="detail-content">
                                    <div class="detail-label">Email</div>
                                    <div class="detail-value">{{ professor.email }}</div>
                                </div>
                            </div>

                            <div class="detail-item">
                                <div class="detail-icon">
                                    <v-icon color="success">mdi-phone</v-icon>
                                </div>
                                <div class="detail-content">
                                    <div class="detail-label">Phone</div>
                                    <div class="detail-value">{{ professor.phone }}</div>
                                </div>
                            </div>

                            <div class="detail-item">
                                <div class="detail-icon">
                                    <v-icon color="info">mdi-office-building</v-icon>
                                </div>
                                <div class="detail-content">
                                    <div class="detail-label">Department</div>
                                    <div class="detail-value">{{ professor.department }}</div>
                                </div>
                            </div>
                        </div>
                    </v-card>

                    <!-- Quick Stats Card -->
                    <v-card class="stats-card" elevation="2">
                        <div class="card-title">
                            <v-icon color="primary">mdi-chart-box</v-icon>
                            <span>Quick Statistics</span>
                        </div>
                        <v-divider class="my-3" />
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-number">12</div>
                                <div class="stat-label">Classes</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">245</div>
                                <div class="stat-label">Students</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">8</div>
                                <div class="stat-label">Subjects</div>
                            </div>
                        </div>
                    </v-card>
                </div>

                <!-- Right Column -->
                <div class="right-column">
                    <!-- Classes Card -->
                    <v-card class="info-card" elevation="2">
                        <div class="card-title">
                            <v-icon color="primary">mdi-google-classroom</v-icon>
                            <span>Assigned Classes</span>
                        </div>
                        <v-divider class="my-3" />
                        <div class="classes-list">
                            <div class="class-item" v-for="i in 5" :key="i">
                                <div class="class-info">
                                    <div class="class-name">Computer Science {{ i }}</div>
                                    <div class="class-details">
                                        <v-chip size="x-small" color="primary" variant="tonal">Year {{ i }}</v-chip>
                                        <span class="dot">•</span>
                                        <span class="students-count">{{ 30 + i * 5 }} students</span>
                                    </div>
                                </div>
                                <v-btn icon="mdi-chevron-right" variant="text" size="small" />
                            </div>
                        </div>
                    </v-card>

                    <!-- Schedule Card -->
                    <v-card class="info-card" elevation="2">
                        <div class="card-title">
                            <v-icon color="success">mdi-calendar-clock</v-icon>
                            <span>Weekly Schedule</span>
                        </div>
                        <v-divider class="my-3" />
                        <div class="schedule-list">
                            <div class="schedule-item" v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']"
                                :key="day">
                                <div class="schedule-day">{{ day }}</div>
                                <div class="schedule-time">08:00 - 10:00 AM</div>
                            </div>
                        </div>
                    </v-card>

                    <!-- Recent Activity Card -->
                    <v-card class="info-card" elevation="2">
                        <div class="card-title">
                            <v-icon color="warning">mdi-history</v-icon>
                            <span>Recent Activity</span>
                        </div>
                        <v-divider class="my-3" />
                        <div class="activity-list">
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <v-icon size="small" color="success">mdi-check-circle</v-icon>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">Marked attendance for CS-101</div>
                                    <div class="activity-time">2 hours ago</div>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <v-icon size="small" color="info">mdi-file-document</v-icon>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">Uploaded assignment</div>
                                    <div class="activity-time">Yesterday</div>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <v-icon size="small" color="warning">mdi-calendar</v-icon>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">Updated schedule</div>
                                    <div class="activity-time">3 days ago</div>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else class="loading-state">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="loading-text">Loading professor details...</p>
        </div>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="420" persistent>
            <v-card class="delete-dialog" elevation="24">
                <div class="delete-header">
                    <div class="delete-icon-container">
                        <v-icon icon="mdi-delete-alert" color="error" size="48" />
                    </div>
                    <h2 class="delete-title">Delete Professor</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                Are you sure you want to delete <strong>{{ professor?.name }}</strong>?
                                All associated data will be permanently removed.
                            </p>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="delete-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false"
                        class="action-btn cancel-btn">
                        <v-icon start>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading"
                        class="action-btn delete-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete Professor
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const router = useRouter()

const professor = ref<any>(null)
const deleteDialog = ref(false)
const deleteLoading = ref(false)

// Mock data - replace with actual API call
const mockProfessors = [
    {
        id: 1,
        professor_code: "PROF-001",
        name: "Dr. John Doe",
        email: "john.doe@example.com",
        department: "Computer Science",
        phone: "012 345 678",
        status: "Active",
    },
    {
        id: 2,
        professor_code: "PROF-002",
        name: "Dr. Jane Smith",
        email: "jane.smith@example.com",
        department: "Information Technology",
        phone: "098 765 432",
        status: "On Leave",
    },
    {
        id: 3,
        professor_code: "PROF-003",
        name: "Dr. Michael Chan",
        email: "michael.chan@example.com",
        department: "Mathematics",
        phone: "010 234 567",
        status: "Active",
    },
]

onMounted(() => {
    loadProfessor()
})

const loadProfessor = () => {
    const id = parseInt(route.params.id as string)
    // Simulate API call
    setTimeout(() => {
        professor.value = mockProfessors.find(p => p.id === id)
    }, 500)
}

const goBack = () => {
    router.push('/admin/professor')
}

const handleEdit = () => {
    // Navigate to edit or open edit dialog
    router.push(`/admin/professor?edit=${professor.value.id}`)
}

const confirmDelete = () => {
    deleteDialog.value = true
}

const handleDelete = async () => {
    deleteLoading.value = true
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        // After successful deletion, navigate back
        router.push('/admin/professor')
    } catch (error) {
        console.error('Error deleting professor:', error)
    } finally {
        deleteLoading.value = false
    }
}
</script>

<style scoped>
.professor-detail-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
}

.detail-header {
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
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-btn {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
}

.title-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
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

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.action-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
}

.detail-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
}

.content-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
}

.left-column,
.right-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.profile-card {
    border-radius: 16px;
    overflow: hidden;
}

.profile-header {
    padding: 32px 24px;
    text-align: center;
    background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
}

.avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;
}

.status-badge {
    position: absolute;
    bottom: 0;
    right: -10px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: white;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge.active {
    background: #22c55e;
    color: white;
}

.status-badge.on-leave {
    background: #f59e0b;
    color: white;
}

.professor-name {
    font-size: 22px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.professor-code {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    margin: 0;
}

.profile-details {
    padding: 24px;
}

.detail-item {
    display: flex;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #f8fafc;
    border-radius: 10px;
}

.detail-content {
    flex: 1;
}

.detail-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.detail-value {
    font-size: 15px;
    color: #1e293b;
    font-weight: 500;
}

.stats-card,
.info-card {
    border-radius: 16px;
    padding: 24px;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.stat-box {
    text-align: center;
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
}

.stat-number {
    font-size: 28px;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.classes-list,
.schedule-list,
.activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.class-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8fafc;
    border-radius: 12px;
    transition: all 0.2s ease;
}

.class-item:hover {
    background: #e0e7ff;
}

.class-info {
    flex: 1;
}

.class-name {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
}

.class-details {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #64748b;
}

.dot {
    opacity: 0.5;
}

.schedule-item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: #f8fafc;
    border-radius: 12px;
}

.schedule-day {
    font-weight: 600;
    color: #1e293b;
}

.schedule-time {
    color: #64748b;
}

.activity-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 12px;
}

.activity-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 8px;
}

.activity-content {
    flex: 1;
}

.activity-text {
    font-size: 14px;
    color: #1e293b;
    font-weight: 500;
    margin-bottom: 2px;
}

.activity-time {
    font-size: 12px;
    color: #64748b;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 16px;
}

.loading-text {
    font-size: 16px;
    color: #64748b;
}

.delete-dialog {
    border-radius: 16px !important;
}

.delete-header {
    text-align: center;
    padding: 32px 24px 24px;
    background: linear-gradient(135deg, #fef7f7 0%, #fdf2f2 100%);
}

.delete-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    margin: 0 auto 16px;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}

.delete-title {
    font-size: 22px;
    font-weight: 600;
    color: #dc2626;
    margin: 0 0 4px 0;
}

.delete-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.delete-content {
    padding: 24px !important;
}

.warning-box {
    display: flex;
    gap: 12px;
    padding: 16px;
    border: 1px solid #fde047;
    border-radius: 12px;
    background: #fffbeb;
}

.warning-icon {
    flex-shrink: 0;
    margin-top: 2px;
}

.warning-text {
    flex: 1;
}

.warning-message {
    font-size: 14px;
    color: #92400e;
    margin: 0;
    line-height: 1.5;
}

.delete-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
}

.delete-btn {
    min-width: 130px;
}

@media (max-width: 1024px) {
    .content-container {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .header-actions {
        width: 100%;
    }

    .action-btn {
        flex: 1;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
