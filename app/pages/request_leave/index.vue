<template>
  <div class="leave-request-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Student Leave Requests</h1>
      <p class="page-subtitle">Submit and manage leave requests for students</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
        class="mb-4"
      >
        New Leave Request
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="stats-card pending">
          <v-card-text class="text-center">
            <v-icon size="40" color="orange" class="mb-2">mdi-clock-outline</v-icon>
            <h3 class="text-h4">{{ pendingCount }}</h3>
            <p class="text-body-2 text-grey">Pending</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card approved">
          <v-card-text class="text-center">
            <v-icon size="40" color="green" class="mb-2">mdi-check-circle</v-icon>
            <h3 class="text-h4">{{ approvedCount }}</h3>
            <p class="text-body-2 text-grey">Approved</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card rejected">
          <v-card-text class="text-center">
            <v-icon size="40" color="red" class="mb-2">mdi-close-circle</v-icon>
            <h3 class="text-h4">{{ rejectedCount }}</h3>
            <p class="text-body-2 text-grey">Rejected</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card total">
          <v-card-text class="text-center">
            <v-icon size="40" color="blue" class="mb-2">mdi-file-document</v-icon>
            <h3 class="text-h4">{{ totalCount }}</h3>
            <p class="text-body-2 text-grey">Total</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search students..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="typeFilter"
              :items="leaveTypeOptions"
              label="Leave Type"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              icon="mdi-refresh"
              variant="outlined"
              @click="refreshData"
              :loading="loading"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredRequests"
        :loading="loading"
        class="elevation-1"
        :search="searchQuery"
      >
        <template v-slot:item.student_name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-3">
              <span class="text-white">{{ item.student_name.charAt(0) }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.student_name }}</div>
              <div class="text-caption text-grey">{{ item.student_id }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.leave_type="{ item }">
          <v-chip
            :color="getLeaveTypeColor(item.leave_type)"
            size="small"
            variant="tonal"
          >
            {{ item.leave_type }}
          </v-chip>
        </template>

        <template v-slot:item.duration="{ item }">
          <div class="text-center">
            <div class="font-weight-medium">{{ item.duration_days }} days</div>
            <div class="text-caption text-grey">
              {{ formatDateRange(item.start_date, item.end_date) }}
            </div>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            :prepend-icon="getStatusIcon(item.status)"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click="viewRequest(item)"
          />
          <v-btn
            v-if="item.status === 'Pending'"
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="editRequest(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="deleteRequest(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="text-h5">
          {{ isEditing ? 'Edit Leave Request' : 'Create Leave Request' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formData.student_id"
                  :items="students"
                  item-title="name"
                  item-value="id"
                  label="Select Student"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  :rules="requiredRules"
                  @update:model-value="onStudentSelect"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar size="32" color="primary">
                          <span class="text-white">{{ item.raw.name.charAt(0) }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.id }} - {{ item.raw.group_id }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.leave_type"
                  :items="leaveTypes"
                  label="Leave Type"
                  prepend-icon="mdi-format-list-bulleted-type"
                  variant="outlined"
                  :rules="requiredRules"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.start_date"
                  label="Start Date"
                  type="date"
                  prepend-icon="mdi-calendar-start"
                  variant="outlined"
                  :rules="requiredRules"
                  @update:model-value="calculateDuration"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.end_date"
                  label="End Date"
                  type="date"
                  prepend-icon="mdi-calendar-end"
                  variant="outlined"
                  :rules="requiredRules"
                  @update:model-value="calculateDuration"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.reason"
                  label="Reason for Leave"
                  prepend-icon="mdi-text"
                  variant="outlined"
                  :rules="reasonRules"
                  counter="500"
                  rows="3"
                />
              </v-col>
              <v-col cols="12" v-if="formData.duration_days > 0">
                <v-alert type="info" variant="tonal">
                  Duration: {{ formData.duration_days }} days
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="saveRequest"
            :loading="submitting"
            :disabled="!formValid"
          >
            {{ isEditing ? 'Update' : 'Create' }} Request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'lecturer',
  middleware: ['auth']
})

// Stores
const leaveStore = useLeaveStore()
const { leaveRequests, loading } = storeToRefs(leaveStore)

// Reactive data
const dialog = ref(false)
const isEditing = ref(false)
const formValid = ref(false)
const submitting = ref(false)
const searchQuery = ref('')
const statusFilter = ref('All')
const typeFilter = ref('All')
const form = ref(null)
const selectedRequest = ref(null)

// Form data
const formData = reactive({
  student_id: '',
  student_name: '',
  gender: 'M',
  group_id: '',
  generation: 0,
  specialize: '',
  leave_type: '',
  reason: '',
  start_date: '',
  end_date: '',
  duration_days: 0,
  requested_by: 'Dr. John Smith',
  lecturer_id: 'LEC001'
})

// Mock data
const students = ref([
  { id: 'ST001', name: 'MEAN Piseth', gender: 'M', group_id: 'G001', generation: 9, specialize: 'CS' },
  { id: 'ST002', name: 'KONG Sophea', gender: 'F', group_id: 'G001', generation: 9, specialize: 'CS' },
  { id: 'ST003', name: 'LIM Dara', gender: 'M', group_id: 'G002', generation: 9, specialize: 'IT' },
  { id: 'ST004', name: 'CHAN Sreypov', gender: 'F', group_id: 'G002', generation: 9, specialize: 'IT' }
])

const leaveTypes = [
  'Sick Leave',
  'Medical Leave',
  'Personal Leave',
  'Emergency Leave',
  'Family Leave',
  'Academic Leave'
]

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected']
const leaveTypeOptions = ['All', ...leaveTypes]

// Table headers
const headers = [
  { title: 'Student', key: 'student_name', sortable: true },
  { title: 'Leave Type', key: 'leave_type', sortable: true },
  { title: 'Duration', key: 'duration', sortable: false },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: 150 }
]

// Validation rules
const requiredRules = [v => !!v || 'This field is required']
const reasonRules = [
  v => !!v || 'Reason is required',
  v => (v && v.length >= 10) || 'Reason must be at least 10 characters',
  v => (v && v.length <= 500) || 'Reason must be less than 500 characters'
]

// Computed
const filteredRequests = computed(() => {
  let filtered = [...leaveRequests.value]

  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(req => req.status === statusFilter.value)
  }

  if (typeFilter.value !== 'All') {
    filtered = filtered.filter(req => req.leave_type === typeFilter.value)
  }

  return filtered
})

const pendingCount = computed(() => leaveRequests.value.filter(r => r.status === 'Pending').length)
const approvedCount = computed(() => leaveRequests.value.filter(r => r.status === 'Approved').length)
const rejectedCount = computed(() => leaveRequests.value.filter(r => r.status === 'Rejected').length)
const totalCount = computed(() => leaveRequests.value.length)

// Methods
const openCreateDialog = () => {
  isEditing.value = false
  resetForm()
  dialog.value = true
}

const editRequest = (request) => {
  isEditing.value = true
  selectedRequest.value = request
  Object.assign(formData, request)
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    student_id: '',
    student_name: '',
    gender: 'M',
    group_id: '',
    generation: 0,
    specialize: '',
    leave_type: '',
    reason: '',
    start_date: '',
    end_date: '',
    duration_days: 0,
    requested_by: 'Dr. John Smith',
    lecturer_id: 'LEC001'
  })
  if (form.value) {
    form.value.resetValidation()
  }
}

const onStudentSelect = (studentId) => {
  const student = students.value.find(s => s.id === studentId)
  if (student) {
    formData.student_name = student.name
    formData.gender = student.gender
    formData.group_id = student.group_id
    formData.generation = student.generation
    formData.specialize = student.specialize
  }
}

const calculateDuration = () => {
  if (formData.start_date && formData.end_date) {
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)
    if (end >= start) {
      const diffTime = Math.abs(end.getTime() - start.getTime())
      formData.duration_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    } else {
      formData.duration_days = 0
    }
  }
}

const saveRequest = async () => {
  if (!form.value || !await form.value.validate()) return

  try {
    submitting.value = true
    calculateDuration()

    const result = isEditing.value
      ? await leaveStore.updateLeaveRequest(selectedRequest.value.id, formData)
      : await leaveStore.createLeaveRequest(formData)

    if (result.success) {
      dialog.value = false
      resetForm()
    }
  } catch (error) {
    console.error('Error saving leave request:', error)
  } finally {
    submitting.value = false
  }
}

const viewRequest = (request) => {
  console.log('Viewing request:', request)
}

const deleteRequest = async (request) => {
  if (confirm(`Are you sure you want to delete the leave request for ${request.student_name}?`)) {
    try {
      const result = await leaveStore.deleteLeaveRequest(request.id)
      if (result.success) {
        console.log('Leave request deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting request:', error)
    }
  }
}

const refreshData = async () => {
  try {
    await leaveStore.fetchLeaveRequests()
  } catch (error) {
    console.error('Error refreshing data:', error)
  }
}

// Helper functions
const getLeaveTypeColor = (type) => {
  const colors = {
    'Sick Leave': 'red',
    'Medical Leave': 'orange',
    'Personal Leave': 'blue',
    'Emergency Leave': 'purple',
    'Family Leave': 'green',
    'Academic Leave': 'teal'
  }
  return colors[type] || 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'orange',
    'Approved': 'green',
    'Rejected': 'red'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Pending': 'mdi-clock-outline',
    'Approved': 'mdi-check-circle',
    'Rejected': 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString()
  const endDate = new Date(end).toLocaleDateString()
  return `${startDate} - ${endDate}`
}

// Lifecycle
onMounted(async () => {
  try {
    await leaveStore.fetchLeaveRequests()
  } catch (error) {
    console.error('Error loading leave requests:', error)
  }
})
</script>

<style scoped>
.leave-request-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.stats-card {
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.action-bar {
  margin-bottom: 16px;
}
</style>
