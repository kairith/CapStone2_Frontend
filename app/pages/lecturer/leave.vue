
<template>
  <div class="leave-page">
    <!-- Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-calendar-remove" size="32" color="primary" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Student Leave Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Lecturer</span>
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Leave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <div class="leave-content">
      <v-card class="leave-card" elevation="2">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Student Leave Requests</span>
          <v-btn color="primary" class="modern-btn" @click="dialog = true">
            <v-icon left>mdi-plus</v-icon>
            Request Leave
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table :headers="studentLeaveHeaders" :items="studentLeaveRequests"
            :items-per-page="10" class="modern-table">
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark small>
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn v-if="item.status === 'Pending'" color="green" size="small"
                @click="approveLeave(item.id)" class="mr-2 modern-btn">
                Approve
              </v-btn>
              <v-btn v-if="item.status === 'Pending'" color="red" size="small"
                @click="rejectLeave(item.id)" class="modern-btn">
                Reject
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Request Leave Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>Request Student Leave</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="studentLeaveForm.studentName" label="Student Name" :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="studentLeaveForm.startDate" label="Start Date" type="date" :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="studentLeaveForm.endDate" label="End Date" type="date" :rules="[rules.required]" />
                </v-col>
                <v-col cols="12">
                  <v-select v-model="studentLeaveForm.type" :items="leaveTypes" label="Leave Type" :rules="[rules.required]" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="studentLeaveForm.reason" label="Reason" :rules="[rules.required]" rows="3" />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="submitStudentLeave" :disabled="!valid">
              Submit Request
            </v-btn>
            <v-btn text @click="dialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>


<script setup>
definePageMeta({
  // middleware: ['auth', 'role-lecturer'],
  layout: 'lecturer'
})

const dialog = ref(false)
const valid = ref(false)
const form = ref(null)

const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Medical Leave', 'Conference', 'Research']

const rules = {
  required: value => !!value || 'This field is required'
}

const studentLeaveHeaders = [
  { title: 'Student', key: 'studentName' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const studentLeaveRequests = ref([
  {
    id: 1,
    studentName: 'John Doe',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    type: 'Sick Leave',
    status: 'Pending',
    submittedAt: '2024-01-20',
    reason: 'Fever and cold'
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    startDate: '2024-02-01',
    endDate: '2024-02-01',
    type: 'Personal Leave',
    status: 'Approved',
    submittedAt: '2024-01-28',
    reason: 'Family event'
  }
])

const studentLeaveForm = reactive({
  studentName: '',
  startDate: '',
  endDate: '',
  type: '',
  reason: ''
})

const submitStudentLeave = async () => {
  if (form.value.validate()) {
    try {
      studentLeaveRequests.value.push({
        id: Date.now(),
        studentName: studentLeaveForm.studentName,
        startDate: studentLeaveForm.startDate,
        endDate: studentLeaveForm.endDate,
        type: studentLeaveForm.type,
        status: 'Pending',
        submittedAt: new Date().toISOString().slice(0, 10),
        reason: studentLeaveForm.reason
      })
      Object.keys(studentLeaveForm).forEach(key => {
        studentLeaveForm[key] = ''
      })
      form.value.reset()
      dialog.value = false
    } catch (error) {
      console.error('Error submitting student leave:', error)
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

<style scoped>
.leave-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
.modern-header {
  background: white;
  padding: 32px 0;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
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
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.title-content h1.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumb-item {
  font-size: 14px;
  color: #64748b;
}
.breadcrumb-item.active {
  color: #3b82f6;
  font-weight: 500;
}
.leave-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}
.leave-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.modern-tabs {
  margin-bottom: 18px;
  border-radius: 8px;
  background: #f7f8fa;
}
.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
.form-card, .history-card, .student-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
}
.modern-table {
  border-radius: 8px;
  background: #fafbfc;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
}
.modern-btn {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
}
</style>