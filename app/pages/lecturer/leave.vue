
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
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ studentLeaveRequests.length }}</div>
              <div class="stat-label">Total Requests</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ studentLeaveRequests.filter(r => r.status === 'Pending').length }}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ studentLeaveRequests.filter(r => r.status === 'Approved').length }}</div>
              <div class="stat-label">Approved</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ studentLeaveRequests.filter(r => r.status === 'Rejected').length }}</div>
              <div class="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn export-btn" prepend-icon="mdi-upload" variant="outlined" v-bind="props">
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

          <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
              @click="dialog = true" elevation="2">
              Request Leave
          </v-btn>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <div class="modern-table-section">
      <div class="table-container">
        <!-- Table Header -->
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="table-title">
              <v-icon icon="mdi-table" size="20" class="mr-2" />
              Student Leave Requests
            </h2>
            <div class="table-subtitle">Manage and review student leave applications</div>
          </div>
          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field 
                placeholder="Search requests..." 
                prepend-inner-icon="mdi-magnify"
                variant="outlined" 
                density="comfortable" 
                hide-details 
                clearable 
                class="search-input" />
            </div>
          </div>
        </div>

        <v-card elevation="2" class="modern-table-card">
          <v-data-table 
            :headers="studentLeaveHeaders" 
            :items="studentLeaveRequests"
            :items-per-page="10" 
            class="modern-data-table elevation-0"
            item-key="id">
            
            <!-- Status chip -->
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                {{ item.status }}
              </v-chip>
            </template>
            
            <!-- Student name with avatar -->
            <template v-slot:item.studentName="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" class="mr-3" color="primary">
                  <span class="text-white text-sm font-weight-bold">
                    {{ item.studentName.split(' ').map(n => n[0]).join('') }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.studentName }}</div>
                  <div class="text-caption text-grey">Student ID: {{ item.id.toString().padStart(4, '0') }}</div>
                </div>
              </div>
            </template>
            
            <!-- Leave type chip -->
            <template v-slot:item.type="{ item }">
              <v-chip color="info" size="small" variant="tonal">
                {{ item.type }}
              </v-chip>
            </template>
            
            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-group">
                <v-btn 
                  v-if="item.status === 'Pending'" 
                  icon="mdi-check" 
                  color="success" 
                  variant="text" 
                  size="small" 
                  @click="approveLeave(item.id)"
                  class="action-btn">
                </v-btn>
                <v-btn 
                  v-if="item.status === 'Pending'" 
                  icon="mdi-close" 
                  color="error" 
                  variant="text" 
                  size="small" 
                  @click="rejectLeave(item.id)"
                  class="action-btn">
                </v-btn>
                <v-btn 
                  icon="mdi-eye" 
                  variant="text" 
                  size="small" 
                  @click="viewDetails(item)"
                  class="action-btn">
                </v-btn>
              </div>
            </template>

            <!-- Empty state -->
            <template v-slot:no-data>
              <div class="modern-empty-state text-center py-8">
                <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-calendar-remove-outline</v-icon>
                <h3 class="text-h6 text-grey mb-2">No leave requests found</h3>
                <p class="text-body-2 text-grey">No student leave requests to display.</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>

      <!-- Request Leave Dialog -->
      <v-dialog v-model="dialog" max-width="600" persistent>
        <v-card class="modern-dialog" elevation="24">
          <!-- Dialog Header -->
          <div class="dialog-header">
            <div class="header-content">
              <div class="header-icon">
                <v-icon icon="mdi-calendar-plus" color="primary" size="24" />
              </div>
              <div class="header-text">
                <h2 class="dialog-title">Request Student Leave</h2>
                <p class="dialog-subtitle">Submit a leave request for a student</p>
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false" class="close-btn" />
          </div>

          <v-divider />

          <!-- Dialog Content -->
          <v-card-text class="dialog-content">
            <v-form ref="form" v-model="valid" @submit.prevent="submitStudentLeave">
              <div class="form-group">
                <label class="form-label">Student Name</label>
                <v-text-field 
                  v-model="studentLeaveForm.studentName" 
                  :rules="[rules.required]" 
                  variant="outlined"
                  density="comfortable" 
                  hide-details="auto" 
                  class="form-field" />
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <v-text-field 
                      v-model="studentLeaveForm.startDate" 
                      type="date" 
                      :rules="[rules.required]" 
                      variant="outlined"
                      density="comfortable" 
                      hide-details="auto" 
                      class="form-field" />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">End Date</label>
                    <v-text-field 
                      v-model="studentLeaveForm.endDate" 
                      type="date" 
                      :rules="[rules.required]" 
                      variant="outlined"
                      density="comfortable" 
                      hide-details="auto" 
                      class="form-field" />
                  </div>
                </v-col>
              </v-row>

              <div class="form-group">
                <label class="form-label">Leave Type</label>
                <v-select 
                  v-model="studentLeaveForm.type" 
                  :items="leaveTypes" 
                  :rules="[rules.required]" 
                  variant="outlined"
                  density="comfortable" 
                  hide-details="auto" 
                  class="form-field" />
              </div>

              <div class="form-group">
                <label class="form-label">Reason</label>
                <v-textarea 
                  v-model="studentLeaveForm.reason" 
                  :rules="[rules.required]" 
                  rows="3" 
                  variant="outlined"
                  density="comfortable" 
                  hide-details="auto" 
                  class="form-field" />
              </div>
            </v-form>
          </v-card-text>

          <v-divider />

          <!-- Dialog Actions -->
          <v-card-actions class="dialog-actions">
            <v-btn variant="outlined" color="grey-darken-1" @click="dialog = false" class="action-btn cancel-btn">
              <v-icon start>mdi-close</v-icon>
              Cancel
            </v-btn>

            <v-btn color="primary" variant="flat" @click="submitStudentLeave" :disabled="!valid" class="action-btn submit-btn">
              <v-icon start>mdi-plus</v-icon>
              Submit Request
            </v-btn>
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

const viewDetails = (item) => {
  // View details functionality
  console.log('View details for:', item)
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 0;
}

/* Modern Header Styles */
.modern-header {
  background: white;
  padding: 32px 0;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
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
  color: #1976d2;
  font-weight: 500;
}

.stats-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: center;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modern-btn {
  border-radius: 10px;
  font-weight: 500;
  letter-spacing: 0.25px;
  text-transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-btn {
  background: linear-gradient(135deg, #1976d2, #2196f3) !important;
  color: white !important;
}

.modern-menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

/* Modern Table Section */
.modern-table-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
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
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-container {
  min-width: 300px;
}

.search-input :deep(.v-field) {
  border-radius: 8px;
}

.modern-table-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.modern-data-table {
  border-radius: 16px;
  font-size: 1rem;
  background: white;
}

.modern-empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.action-group {
  display: flex;
  gap: 4px;
  justify-content: flex-start;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Modern Dialog Styles */
.modern-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
  flex: 1;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.dialog-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

.close-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.04);
}

.dialog-content {
  padding: 24px !important;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-field {
  margin-bottom: 0 !important;
}

.form-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-field :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.form-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dialog-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
}

.action-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px;
  transition: all 0.2s ease;
}

.cancel-btn {
  min-width: 100px;
}

.submit-btn {
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

/* Animation for dialogs */
.modern-dialog {
  animation: dialogSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .title-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stats-cards {
    justify-content: center;
  }

  .action-section {
    align-self: stretch;
    justify-content: center;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .toolbar-right {
    justify-content: stretch;
  }

  .search-container {
    min-width: auto;
  }
}
</style>