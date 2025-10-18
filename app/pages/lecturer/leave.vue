<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-icon left>mdi-calendar-remove</v-icon>
                        Leave Management
                    </v-card-title>

                    <v-card-text>
                        <v-tabs v-model="tab">
                            <v-tab>My Leave Requests</v-tab>
                            <v-tab>Student Requests</v-tab>
                        </v-tabs>

                        <v-tabs-window v-model="tab">
                            <!-- My Leave Requests -->
                            <v-tabs-window-item>
                                <v-card class="mt-4">
                                    <v-card-title>Request New Leave</v-card-title>
                                    <v-card-text>
                                        <v-form ref="form" v-model="valid">
                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model="leaveForm.startDate" label="Start Date"
                                                        type="date" :rules="[rules.required]" outlined />
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model="leaveForm.endDate" label="End Date"
                                                        type="date" :rules="[rules.required]" outlined />
                                                </v-col>
                                            </v-row>

                                            <v-row>
                                                <v-col cols="12">
                                                    <v-select v-model="leaveForm.type" :items="leaveTypes"
                                                        label="Leave Type" :rules="[rules.required]" outlined />
                                                </v-col>
                                            </v-row>

                                            <v-row>
                                                <v-col cols="12">
                                                    <v-textarea v-model="leaveForm.reason" label="Reason"
                                                        :rules="[rules.required]" outlined rows="3" />
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer />
                                        <v-btn color="primary" @click="submitLeave" :disabled="!valid">
                                            Submit Request
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>

                                <v-card class="mt-4">
                                    <v-card-title>My Leave History</v-card-title>
                                    <v-card-text>
                                        <v-data-table :headers="myLeaveHeaders" :items="myLeaveHistory"
                                            :items-per-page="10">
                                            <template v-slot:item.status="{ item }">
                                                <v-chip :color="getStatusColor(item.status)" dark small>
                                                    {{ item.status }}
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-tabs-window-item>

                            <!-- Student Requests -->
                            <v-tabs-window-item>
                                <v-card class="mt-4">
                                    <v-card-title>Student Leave Requests</v-card-title>
                                    <v-card-text>
                                        <v-data-table :headers="studentLeaveHeaders" :items="studentLeaveRequests"
                                            :items-per-page="10">
                                            <template v-slot:item.status="{ item }">
                                                <v-chip :color="getStatusColor(item.status)" dark small>
                                                    {{ item.status }}
                                                </v-chip>
                                            </template>
                                            <template v-slot:item.actions="{ item }">
                                                <v-btn v-if="item.status === 'Pending'" color="green" size="small"
                                                    @click="approveLeave(item.id)" class="mr-2">
                                                    Approve
                                                </v-btn>
                                                <v-btn v-if="item.status === 'Pending'" color="red" size="small"
                                                    @click="rejectLeave(item.id)">
                                                    Reject
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

const tab = ref(0)
const valid = ref(false)
const form = ref(null)

const leaveForm = reactive({
    startDate: '',
    endDate: '',
    type: '',
    reason: ''
})

const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Medical Leave', 'Conference', 'Research']

const rules = {
    required: value => !!value || 'This field is required'
}

const myLeaveHeaders = [
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Submitted', key: 'submittedAt' }
]

const studentLeaveHeaders = [
    { title: 'Student', key: 'studentName' },
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const myLeaveHistory = ref([
    {
        id: 1,
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        type: 'Conference',
        status: 'Approved',
        submittedAt: '2024-01-15'
    },
    {
        id: 2,
        startDate: '2024-02-10',
        endDate: '2024-02-10',
        type: 'Personal Leave',
        status: 'Pending',
        submittedAt: '2024-02-05'
    }
])

const studentLeaveRequests = ref([
    {
        id: 1,
        studentName: 'John Doe',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        type: 'Sick Leave',
        status: 'Pending',
        submittedAt: '2024-01-20'
    },
    {
        id: 2,
        studentName: 'Jane Smith',
        startDate: '2024-02-01',
        endDate: '2024-02-01',
        type: 'Personal Leave',
        status: 'Approved',
        submittedAt: '2024-01-28'
    }
])

const submitLeave = async () => {
    if (form.value.validate()) {
        try {
            console.log('Submitting leave:', leaveForm)
            // Reset form
            Object.keys(leaveForm).forEach(key => {
                leaveForm[key] = ''
            })
            form.value.reset()
        } catch (error) {
            console.error('Error submitting leave:', error)
        }
    }
}

const approveLeave = async (id) => {
    try {
        const request = studentLeaveRequests.value.find(r => r.id === id)
        if (request) {
            request.status = 'Approved'
        }
        console.log('Approved leave request:', id)
    } catch (error) {
        console.error('Error approving leave:', error)
    }
}

const rejectLeave = async (id) => {
    try {
        const request = studentLeaveRequests.value.find(r => r.id === id)
        if (request) {
            request.status = 'Rejected'
        }
        console.log('Rejected leave request:', id)
    } catch (error) {
        console.error('Error rejecting leave:', error)
    }
}

const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'green'
        case 'Rejected': return 'red'
        case 'Pending': return 'orange'
        default: return 'grey'
    }
}
</script>