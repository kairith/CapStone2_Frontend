<template>
  <div class="schedules-page">
    <!-- Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-calendar-clock" size="32" color="primary" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Schedule Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Schedules</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ schedules.length }}</div>
              <div class="stat-label">Total Schedules</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ activeSchedules.length }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ groupsWithSchedule.length }}</div>
              <div class="stat-label">Groups</div>
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
              <v-list-item @click="exportSchedulesPDF" class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-pdf-box" color="error" />
                </template>
                <v-list-item-title>Export to PDF</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportSchedulesExcel" class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-excel" color="success" />
                </template>
                <v-list-item-title>Export to Excel</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
            @click="openCreateDialog" elevation="2">
            Create Schedule
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Schedule Cards Grid -->
    <div class="schedules-grid">
      <div class="schedules-container">
        <!-- Filter and Search Bar -->
        <div class="toolbar-section">
          <div class="search-section">
            <v-text-field v-model="searchQuery" placeholder="Search schedules..." prepend-inner-icon="mdi-magnify"
              variant="outlined" density="compact" hide-details class="search-input" clearable />
          </div>
          <div class="filter-section">
            <v-select v-model="generationFilter" :items="generationOptions" label="Generation" variant="outlined"
              density="compact" hide-details class="filter-select" />
            <v-select v-model="yearFilter" :items="yearOptions" label="Year" variant="outlined" density="compact"
              hide-details class="filter-select" />
            <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined" density="compact"
              hide-details class="filter-select" />
          </div>
        </div>

        <!-- Schedule Cards -->
        <div v-if="filteredSchedules.length === 0" class="empty-state">
          <v-icon icon="mdi-calendar-clock" size="64" color="grey-lighten-1" class="mb-4" />
          <h3 class="text-h6 text-grey-darken-1 mb-2">No schedules found</h3>
          <p class="text-body-2 text-grey">Create your first schedule to get started</p>
          <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
            <v-icon start>mdi-plus</v-icon>
            Create Schedule
          </v-btn>
        </div>

        <div v-else class="cards-grid">
          <v-card v-for="schedule in filteredSchedules" :key="schedule.id" class="schedule-card" elevation="2"
            @click="viewSchedule(schedule)">
            <div class="card-header">
              <div class="group-info">
                <h3 class="group-name">{{ schedule.group_name }}</h3>
                <div class="group-details">
                  <span class="group-id">{{ schedule.group_id }}</span>
                  <v-chip :color="schedule.status === 'active' ? 'success' : 'error'" size="small" variant="flat">
                    {{ schedule.status }}
                  </v-chip>
                </div>
              </div>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"
                    @click.stop></v-btn>
                </template>
                <v-list>
                  <v-list-item @click.stop="editSchedule(schedule)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-pencil" />
                    </template>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click.stop="duplicateSchedule(schedule)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-content-copy" />  
                    </template>
                    <v-list-item-title>Duplicate</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click.stop="deleteSchedule(schedule)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-delete" color="error" />
                    </template>
                    <v-list-item-title class="text-error">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <div class="card-content">
              <div class="schedule-info">
                <div class="info-row">
                  <v-icon icon="mdi-account-school" size="16" class="mr-2" />
                  <span>Generation {{ schedule.generation }} • {{ schedule.specialize }}</span>
                </div>
                <div class="info-row">
                  <v-icon icon="mdi-calendar-range" size="16" class="mr-2" />
                  <span>{{ formatDateRange(schedule.start_date, schedule.end_date) }}</span>
                </div>
                <div class="info-row">
                  <v-icon icon="mdi-book-open-page-variant" size="16" class="mr-2" />
                  <span>Semester {{ schedule.semester }} • {{ schedule.academic_year }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <span class="updated-date">Updated {{ formatDate(schedule.updated_at) }}</span>
              <v-btn variant="outlined" size="small" @click.stop="viewSchedule(schedule)">
                View Schedule
              </v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Create/Edit Schedule Dialog -->
    <v-dialog v-model="scheduleDialog" max-width="800" persistent>
      <v-card class="modern-dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">
            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" />
            {{ isEdit ? 'Edit Schedule' : 'Create New Schedule' }}
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </div>

        <v-divider />

        <v-card-text class="dialog-content">
          <v-form ref="formRef" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.group_id" :rules="groupIdRules" label="Group ID" variant="outlined"
                  density="compact" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.group_name" :rules="groupNameRules" label="Group Name"
                  variant="outlined" density="compact" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="formData.generation" :items="generationItems" label="Generation" variant="outlined"
                  density="compact" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="formData.year" :items="yearItems" label="Year" variant="outlined" density="compact"
                  :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="formData.specialize" :items="specializeItems" label="Specialization"
                  variant="outlined" density="compact" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="formData.semester" :items="semesterItems" label="Semester" variant="outlined"
                  density="compact" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.academic_year" label="Academic Year" variant="outlined"
                  density="compact" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.start_date" type="date" label="Start Date" variant="outlined"
                  density="compact" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.end_date" type="date" label="End Date" variant="outlined"
                  density="compact" :rules="requiredRules" />
              </v-col>
              <v-col cols="12">
                <v-select v-model="formData.status" :items="statusItems" label="Status" variant="outlined"
                  density="compact" :rules="requiredRules" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" @click="closeDialog" class="action-btn cancel-btn">
            <v-icon start>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="submitForm" :disabled="!formValid"
            :loading="loading" class="action-btn submit-btn">
            <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ isEdit ? 'Update Schedule' : 'Create Schedule' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Schedule Detail View Dialog -->
    <v-dialog v-model="scheduleDetailDialog" max-width="1200" persistent>
      <v-card v-if="selectedSchedule" class="schedule-detail-card">
        <div class="detail-header">
          <div class="header-info">
            <h2 class="schedule-title">{{ selectedSchedule.group_name }}</h2>
            <div class="schedule-meta">
              <v-chip color="primary" variant="flat" class="mr-2">{{ selectedSchedule.group_id }}</v-chip>
              <v-chip :color="selectedSchedule.status === 'active' ? 'success' : 'error'" variant="flat">
                {{ selectedSchedule.status }}
              </v-chip>
            </div>
          </div>
          <div class="header-actions">
            <v-btn icon="mdi-pencil" variant="outlined" @click="editScheduleFromDetail" class="mr-2" />
            <v-btn icon="mdi-close" variant="text" @click="scheduleDetailDialog = false" />
          </div>
        </div>

        <v-divider />

        <div class="schedule-content">
          <ScheduleForm 
            :schedule="selectedSchedule" 
            :editable="true"
            @update-slot="updateScheduleSlot"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="delete-dialog">
        <div class="delete-header">
          <v-icon icon="mdi-delete-alert" color="error" size="48" />
          <h2 class="delete-title">Delete Schedule</h2>
          <p class="delete-subtitle">This action cannot be undone</p>
        </div>

        <v-divider />

        <v-card-text class="delete-content">
          <div class="warning-box">
            <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
            <div class="warning-text">
              <p class="warning-message">
                You are about to permanently delete the schedule for
                <strong class="group-name">{{ scheduleToDelete?.group_name }}</strong>
              </p>
              <p class="warning-details">
                All schedule data will be removed and cannot be recovered.
              </p>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="delete-actions">
          <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false" class="action-btn cancel-btn">
            <v-icon start>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleteLoading"
            class="action-btn delete-btn">
            <v-icon start>mdi-delete</v-icon>
            Delete Schedule
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  // middleware: ['auth', 'role-admin']
})

import ScheduleForm from '@/components/admin/ScheduleForm.vue'

// Store
const scheduleStore = useScheduleStore()
const { schedules, loading } = storeToRefs(scheduleStore)

// Reactive data
const searchQuery = ref('')
const generationFilter = ref('All')
const yearFilter = ref('All')
const statusFilter = ref('All')

const scheduleDialog = ref(false)
const scheduleDetailDialog = ref(false)
const deleteDialog = ref(false)
const selectedSchedule = ref(null)
const scheduleToDelete = ref(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const deleteLoading = ref(false)

// Form data
const formData = reactive({
  group_id: '',
  group_name: '',
  generation: null,
  year: null,
  specialize: '',
  semester: null,
  academic_year: '',
  start_date: '',
  end_date: '',
  status: 'active',
  schedule_data: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  }
})

// Computed
const activeSchedules = computed(() => schedules.value.filter(s => s.status === 'active'))
const groupsWithSchedule = computed(() => [...new Set(schedules.value.map(s => s.group_id))])

const filteredSchedules = computed(() => {
  let filtered = schedules.value

  if (searchQuery.value) {
    filtered = filtered.filter(s => 
      s.group_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.group_id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (generationFilter.value !== 'All') {
    filtered = filtered.filter(s => s.generation.toString() === generationFilter.value)
  }

  if (yearFilter.value !== 'All') {
    filtered = filtered.filter(s => s.year.toString() === yearFilter.value)
  }

  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(s => s.status === statusFilter.value)
  }

  return filtered
})

// Options
const generationOptions = ['All', '8', '9', '10', '11']
const yearOptions = ['All', '2024', '2025', '2026']
const statusOptions = ['All', 'active', 'inactive']

const generationItems = [8, 9, 10, 11]
const yearItems = [2024, 2025, 2026, 2027]
const specializeItems = ['CS', 'IT', 'IS', 'SE']
const semesterItems = [1, 2]
const statusItems = ['active', 'inactive']

// Validation rules
const requiredRules = [v => !!v || 'Field is required']
const groupIdRules = [
  v => !!v || 'Group ID is required',
  v => /^[A-Z]\d{3}$/.test(v) || 'Group ID must be in format: G001'
]
const groupNameRules = [
  v => !!v || 'Group name is required',
  v => v.length >= 3 || 'Group name must be at least 3 characters'
]

// Methods
const openCreateDialog = () => {
  resetForm()
  isEdit.value = false
  scheduleDialog.value = true
}

const editSchedule = (schedule) => {
  Object.assign(formData, { ...schedule })
  isEdit.value = true
  scheduleDialog.value = true
}

const editScheduleFromDetail = () => {
  if (selectedSchedule.value) {
    scheduleDetailDialog.value = false
    editSchedule(selectedSchedule.value)
  }
}

const closeDialog = () => {
  scheduleDialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    group_id: '',
    group_name: '',
    generation: null,
    year: null,
    specialize: '',
    semester: null,
    academic_year: '',
    start_date: '',
    end_date: '',
    status: 'active',
    schedule_data: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    }
  })
  formRef.value?.resetValidation()
}

const submitForm = async () => {
  if (!formRef.value.validate()) return

  try {
    const result = isEdit.value 
      ? await scheduleStore.updateSchedule(formData.id, formData)
      : await scheduleStore.createSchedule(formData)

    if (result.success) {
      scheduleDialog.value = false
      resetForm()
      // Show success message
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const viewSchedule = (schedule) => {
  selectedSchedule.value = schedule
  scheduleDetailDialog.value = true
}

const duplicateSchedule = async (schedule) => {
  const duplicated = {
    ...schedule,
    group_id: schedule.group_id + '_COPY',
    group_name: schedule.group_name + ' (Copy)',
    status: 'inactive'
  }
  delete duplicated.id
  await scheduleStore.createSchedule(duplicated)
}

const deleteSchedule = (schedule) => {
  scheduleToDelete.value = schedule
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!scheduleToDelete.value) return

  try {
    deleteLoading.value = true
    const result = await scheduleStore.deleteSchedule(scheduleToDelete.value.id)
    
    if (result.success) {
      deleteDialog.value = false
      scheduleToDelete.value = null
    }
  } catch (error) {
    console.error('Error deleting schedule:', error)
  } finally {
    deleteLoading.value = false
  }
}

const updateScheduleSlot = async (day, timeSlot, slotData) => {
  if (!selectedSchedule.value) return
  
  const result = await scheduleStore.updateScheduleSlot(
    selectedSchedule.value.id, 
    day, 
    timeSlot, 
    slotData
  )
  
  if (result.success) {
    // Update the local selectedSchedule data
    await scheduleStore.fetchSchedules()
    selectedSchedule.value = schedules.value.find(s => s.id === selectedSchedule.value.id)
  }
}

// Export methods
const exportSchedulesPDF = () => {
  // Implementation for PDF export
  console.log('Exporting schedules to PDF...')
}

const exportSchedulesExcel = () => {
  // Implementation for Excel export
  console.log('Exporting schedules to Excel...')
}

// Utility methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString()
  const endDate = new Date(end).toLocaleDateString()
  return `${startDate} - ${endDate}`
}

// Lifecycle
onMounted(() => {
  scheduleStore.fetchSchedules()
})
</script>

<style scoped>
.schedules-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Header Styles */
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
  flex-wrap: wrap;
}

.modern-btn {
  height: 42px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.export-btn {
  border-color: #e2e8f0;
  color: #374151;
}

.export-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f8fafc;
}

.add-btn {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.add-btn:hover {
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

/* Main Content Styles */
.schedules-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-input {
  background: white;
  border-radius: 8px;
}

.filter-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  min-width: 120px;
  background: white;
  border-radius: 8px;
}

/* Cards Grid */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.schedule-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.schedule-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.group-info {
  flex: 1;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.group-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-id {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.schedule-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #64748b;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.updated-date {
  font-size: 12px;
  color: #94a3b8;
}

/* Dialog Styles */
.modern-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  margin: 0;
}

.dialog-content {
  padding: 24px !important;
}

.dialog-actions {
  padding: 16px 24px 24px !important;
  gap: 12px;
}

.action-btn {
  height: 42px;
  min-width: 120px;
  text-transform: none;
  border-radius: 8px;
  font-weight: 500;
}

.cancel-btn {
  color: #64748b;
  border-color: #e2e8f0;
}

.submit-btn {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

/* Schedule Detail Dialog */
.schedule-detail-card {
  border-radius: 16px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.header-info {
  flex: 1;
}

.schedule-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.schedule-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.schedule-content {
  flex: 1;
  overflow-y: auto;
}

/* Delete Dialog */
.delete-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.delete-header {
  text-align: center;
  padding: 32px 24px 20px;
}

.delete-title {
  font-size: 20px;
  font-weight: 600;
  color: #dc2626;
  margin: 12px 0 8px 0;
}

.delete-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.delete-content {
  padding: 20px 24px !important;
}

.warning-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fef3cd;
  border: 1px solid #f59e0b;
  border-radius: 8px;
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
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.group-name {
  color: #dc2626;
  font-weight: 600;
}

.warning-details {
  font-size: 13px;
  color: #a16207;
  margin: 0;
  line-height: 1.4;
}

.delete-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
}

.delete-btn {
  min-width: 130px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  transform: translateY(-1px);
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

  .toolbar-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section {
    justify-content: center;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}

/* Menu Styles */
.modern-menu {
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.menu-item {
  border-radius: 6px;
  margin-bottom: 4px;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  background: #f8fafc;
}

/* Animation */
.schedule-card {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>