<template>
    <v-container fluid class="pa-6">
        <v-row>
            <v-col cols="12">
                <!-- Page Header -->
                <div class="d-flex justify-space-between align-center mb-6">
                    <div>
                        <h1 class="text-h4 font-weight-bold mb-2">Request Leave</h1>
                        <p class="text-grey">Manage your leave requests</p>
                    </div>
                    <v-btn color="primary" prepend-icon="mdi-plus" @click="showNewLeaveDialog = true">
                        New Request
                    </v-btn>
                </div>

                <!-- Leave Stats -->
                <v-row class="mb-6">
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="1">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey">Total Requests</div>
                                        <div class="text-h4 font-weight-bold mt-1">{{ myLeaveHistory.length }}</div>
                                    </div>
                                    <v-avatar color="blue-lighten-5" size="50">
                                        <v-icon color="primary">mdi-file-document</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="1">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey">Approved</div>
                                        <div class="text-h4 font-weight-bold mt-1 text-success">{{ approvedCount }}
                                        </div>
                                    </div>
                                    <v-avatar color="green-lighten-5" size="50">
                                        <v-icon color="success">mdi-check-circle</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="1">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey">Pending</div>
                                        <div class="text-h4 font-weight-bold mt-1 text-warning">{{ pendingCount }}</div>
                                    </div>
                                    <v-avatar color="orange-lighten-5" size="50">
                                        <v-icon color="warning">mdi-clock-outline</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="1">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey">Rejected</div>
                                        <div class="text-h4 font-weight-bold mt-1 text-error">{{ rejectedCount }}</div>
                                    </div>
                                    <v-avatar color="red-lighten-5" size="50">
                                        <v-icon color="error">mdi-close-circle</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Leave History -->
                <v-card elevation="1">
                    <v-card-title class="pa-4">
                        <span class="text-h6 font-weight-bold">My Leave History</span>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="myLeaveHeaders" :items="myLeaveHistory" :items-per-page="10"
                            class="elevation-0">
                            <template v-slot:item.status="{ item }">
                                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:item.startDate="{ item }">
                                {{ formatDate(item.startDate) }}
                            </template>
                            <template v-slot:item.endDate="{ item }">
                                {{ formatDate(item.endDate) }}
                            </template>
                            <template v-slot:item.submittedAt="{ item }">
                                {{ formatDate(item.submittedAt) }}
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- New Leave Request Dialog -->
        <v-dialog v-model="showNewLeaveDialog" max-width="600">
            <v-card>
                <v-card-title class="pa-4 bg-primary">
                    <span class="text-h6 font-weight-bold text-white">New Leave Request</span>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-form ref="form" v-model="valid">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="leaveForm.startDate" label="Start Date" type="date"
                                    :rules="[rules.required]" variant="outlined" density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="leaveForm.endDate" label="End Date" type="date"
                                    :rules="[rules.required]" variant="outlined" density="comfortable" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-select v-model="leaveForm.type" :items="leaveTypes" label="Leave Type"
                                    :rules="[rules.required]" variant="outlined" density="comfortable" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-textarea v-model="leaveForm.reason" label="Reason" :rules="[rules.required]"
                                    variant="outlined" rows="4" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="showNewLeaveDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="submitLeave" :disabled="!valid">
                        Submit Request
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

const showNewLeaveDialog = ref(false)
const valid = ref(false)
const form = ref(null)

const leaveForm = reactive({
    startDate: '',
    endDate: '',
    type: '',
    reason: ''
})

const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Medical Leave', 'Conference', 'Research', 'Vacation']

const rules = {
    required: value => !!value || 'This field is required'
}

const myLeaveHeaders = [
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Leave Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Submitted', key: 'submittedAt' }
]

const myLeaveHistory = ref([
    {
        id: 1,
        startDate: '2025-01-20',
        endDate: '2025-01-22',
        type: 'Conference',
        status: 'Approved',
        submittedAt: '2025-01-15'
    },
    {
        id: 2,
        startDate: '2025-02-10',
        endDate: '2025-02-10',
        type: 'Personal Leave',
        status: 'Pending',
        submittedAt: '2025-02-05'
    },
    {
        id: 3,
        startDate: '2024-12-15',
        endDate: '2024-12-18',
        type: 'Sick Leave',
        status: 'Approved',
        submittedAt: '2024-12-10'
    },
    {
        id: 4,
        startDate: '2024-11-05',
        endDate: '2024-11-05',
        type: 'Medical Leave',
        status: 'Rejected',
        submittedAt: '2024-11-01'
    }
])

const approvedCount = computed(() => myLeaveHistory.value.filter(l => l.status === 'Approved').length)
const pendingCount = computed(() => myLeaveHistory.value.filter(l => l.status === 'Pending').length)
const rejectedCount = computed(() => myLeaveHistory.value.filter(l => l.status === 'Rejected').length)

const submitLeave = async () => {
    if (form.value.validate()) {
        try {
            const newLeave = {
                id: myLeaveHistory.value.length + 1,
                ...leaveForm,
                status: 'Pending',
                submittedAt: new Date().toISOString().split('T')[0]
            }
            myLeaveHistory.value.unshift(newLeave)

            // Reset form
            Object.keys(leaveForm).forEach(key => {
                leaveForm[key] = ''
            })
            form.value.reset()
            showNewLeaveDialog.value = false
        } catch (error) {
            console.error('Error submitting leave:', error)
        }
    }
}

const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'success'
        case 'Rejected': return 'error'
        case 'Pending': return 'warning'
        default: return 'grey'
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>

<style scoped>
.stat-card {
    border-radius: 12px;
}
</style>
