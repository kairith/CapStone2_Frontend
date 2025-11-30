<template>
  <v-container fluid class="bg-grey-lighten-5 fill-height align-start pa-6">
    <div class="w-100" style="max-width: 1400px; margin: 0 auto;">

      <!-- Header Section -->
      <v-row class="mb-8 align-center">
        <v-col cols="12" md="8">
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">Hello, Admin 👋</h1>
          <p class="text-subtitle-1 text-grey-darken-1 mt-1">Here's what's happening with your students today.</p>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-md-end">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Search anything..."
            variant="outlined" density="comfortable" bg-color="white" hide-details rounded="lg" class="search-field"
            style="max-width: 300px; width: 100%;"></v-text-field>
        </v-col>
      </v-row>

      <!-- Filters Section -->
      <v-card flat rounded="lg" class="mb-8 border-thin">
        <v-card-text class="pa-4">
          <div class="d-flex align-center flex-wrap gap-4">
            <div class="d-flex align-center mr-4">
              <v-icon icon="mdi-filter-variant" class="mr-2 text-primary"></v-icon>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-2">Filters</span>
            </div>

            <v-select v-model="filters.generation" :items="generationOptions" label="Generation" variant="outlined"
              density="compact" hide-details bg-color="white" class="filter-select"></v-select>

            <v-select v-model="filters.year" :items="yearOptions" label="Year" variant="outlined" density="compact"
              hide-details bg-color="white" class="filter-select"></v-select>

            <v-select v-model="filters.group" :items="groupOptions" label="Group" variant="outlined" density="compact"
              hide-details bg-color="white" class="filter-select"></v-select>

            <v-select v-model="filters.specialize" :items="specializeOptions" label="Specialize" variant="outlined"
              density="compact" hide-details bg-color="white" class="filter-select"></v-select>

            <v-spacer></v-spacer>

            <v-select v-model="filters.order" :items="orderOptions" label="Sort By" prepend-inner-icon="mdi-sort"
              variant="outlined" density="compact" hide-details bg-color="white" class="filter-select"
              style="min-width: 140px;"></v-select>
          </div>
        </v-card-text>
      </v-card>

      <!-- Stats Cards -->
      <v-row class="mb-8">
        <v-col cols="12" md="4">
          <v-card flat rounded="lg" class="h-100 border-thin card-hover">
            <v-card-text class="d-flex align-center justify-space-between pa-6">
              <div>
                <div class="text-caption text-uppercase font-weight-bold text-blue mb-1">Total Students</div>
                <div class="text-h3 font-weight-bold text-grey-darken-3">45</div>
                <div class="d-flex align-center mt-2 text-caption text-grey-darken-1">
                  <v-icon size="small" icon="mdi-gender-female" class="mr-1"></v-icon> 23
                  <v-divider vertical class="mx-2"></v-divider>
                  <v-icon size="small" icon="mdi-gender-male" class="mr-1"></v-icon> 22
                </div>
              </div>
              <v-avatar size="64" color="blue-lighten-5" rounded="lg">
                <v-icon size="32" color="blue-darken-1">mdi-account-group</v-icon>
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card flat rounded="lg" class="h-100 border-thin card-hover">
            <v-card-text class="d-flex align-center justify-space-between pa-6">
              <div>
                <div class="text-caption text-uppercase font-weight-bold text-orange mb-1">Present Today</div>
                <div class="text-h3 font-weight-bold text-grey-darken-3">45</div>
                <div class="d-flex align-center mt-2 text-caption text-grey-darken-1">
                  <span class="text-success font-weight-bold">100%</span>&nbsp;attendance rate
                </div>
              </div>
              <v-avatar size="64" color="orange-lighten-5" rounded="lg">
                <v-icon size="32" color="orange-darken-1">mdi-account-check</v-icon>
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card flat rounded="lg" class="h-100 border-thin card-hover">
            <v-card-text class="d-flex align-center justify-space-between pa-6">
              <div>
                <div class="text-caption text-uppercase font-weight-bold text-red mb-1">Absent Today</div>
                <div class="text-h3 font-weight-bold text-grey-darken-3">0</div>
                <div class="d-flex align-center mt-2 text-caption text-grey-darken-1">
                  Needs attention
                </div>
              </div>
              <v-avatar size="64" color="red-lighten-5" rounded="lg">
                <v-icon size="32" color="red-darken-1">mdi-account-remove</v-icon>
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section -->
      <v-row class="mb-8">
        <v-col cols="12" md="8">
          <v-card flat rounded="lg" class="h-100 border-thin">
            <v-card-item class="pa-6 pb-2">
              <v-card-title class="text-h6 font-weight-bold text-grey-darken-3">Weekly Attendance Average</v-card-title>
              <v-card-subtitle>Overview of student presence over the last 12 weeks</v-card-subtitle>
            </v-card-item>
            <v-card-text class="pa-6">
              <div class="bar-chart-container">
                <div v-for="(week, index) in weeklyData" :key="index" class="bar-item">
                  <div class="bar-wrapper">
                    <div class="bar" :style="{ height: (week.value / maxWeeklyValue * 100) + '%' }"
                      v-tooltip="`Week ${index + 1}: ${week.value} students`"></div>
                  </div>
                  <div class="bar-label">W{{ index + 1 }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card flat rounded="lg" class="h-100 border-thin">
            <v-card-item class="pa-6 pb-2">
              <v-card-title class="text-h6 font-weight-bold text-grey-darken-3">Attendance Status</v-card-title>
              <v-card-subtitle>Current distribution</v-card-subtitle>
            </v-card-item>
            <v-card-text class="d-flex flex-column align-center justify-center pa-6">
              <div class="position-relative mb-6">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#e0f2fe" stroke-width="30"></circle>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#1e3a8a" stroke-width="30"
                    :stroke-dasharray="`${calculateDashArray(62.5)} ${calculateDashArray(37.5)}`" stroke-dashoffset="25"
                    transform="rotate(-90 100 100)"></circle>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#f97316" stroke-width="30"
                    :stroke-dasharray="`${calculateDashArray(12.5)} ${calculateDashArray(87.5)}`"
                    :stroke-dashoffset="`${25 - calculateDashArray(62.5)}`" transform="rotate(-90 100 100)"></circle>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#22c55e" stroke-width="30"
                    :stroke-dasharray="`${calculateDashArray(25)} ${calculateDashArray(75)}`"
                    :stroke-dashoffset="`${25 - calculateDashArray(62.5) - calculateDashArray(12.5)}`"
                    transform="rotate(-90 100 100)"></circle>
                </svg>
                <div class="chart-center-text">
                  <div class="text-h4 font-weight-bold">100%</div>
                  <div class="text-caption text-grey">Total</div>
                </div>
              </div>

              <div class="d-flex justify-center gap-6 w-100">
                <div class="text-center">
                  <div class="d-flex align-center justify-center mb-1">
                    <v-icon icon="mdi-circle-small" color="blue-darken-3" class="mr-1"></v-icon>
                    <span class="text-caption font-weight-bold text-grey-darken-2">Present</span>
                  </div>
                  <div class="text-h6 font-weight-bold">62.5%</div>
                </div>
                <div class="text-center">
                  <div class="d-flex align-center justify-center mb-1">
                    <v-icon icon="mdi-circle-small" color="orange" class="mr-1"></v-icon>
                    <span class="text-caption font-weight-bold text-grey-darken-2">Leave</span>
                  </div>
                  <div class="text-h6 font-weight-bold">12.5%</div>
                </div>
                <div class="text-center">
                  <div class="d-flex align-center justify-center mb-1">
                    <v-icon icon="mdi-circle-small" color="green" class="mr-1"></v-icon>
                    <span class="text-caption font-weight-bold text-grey-darken-2">Absence</span>
                  </div>
                  <div class="text-h6 font-weight-bold">25%</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Student Lists Table -->
      <v-card flat rounded="lg" class="border-thin">
        <v-card-item class="pa-6 border-bottom">
          <div class="d-flex justify-space-between align-center flex-wrap gap-4">
            <div>
              <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 pa-0">Student Attendance
                Records</v-card-title>
              <v-card-subtitle class="pa-0 mt-1">Detailed daily logs for all students</v-card-subtitle>
            </div>
            <div class="d-flex align-center gap-3">
              <v-text-field v-model="studentSearch" prepend-inner-icon="mdi-magnify" placeholder="Search student..."
                variant="outlined" density="compact" hide-details bg-color="grey-lighten-5"
                style="width: 250px"></v-text-field>
              <v-btn variant="outlined" color="grey-darken-1" prepend-icon="mdi-download" class="text-capitalize">
                Export
              </v-btn>
            </div>
          </div>
        </v-card-item>

        <v-card-text class="pa-0">
          <v-table class="attendance-table" hover>
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="text-left font-weight-bold text-grey-darken-3 py-4" style="min-width: 200px;">Student Name
                </th>
                <th class="text-center font-weight-bold text-grey-darken-3">Gender</th>
                <th class="text-center font-weight-bold text-grey-darken-3">Gen</th>
                <th class="text-center font-weight-bold text-grey-darken-3" style="min-width: 100px;">DOB</th>
                <th class="text-center font-weight-bold text-grey-darken-3">Status</th>
                <!-- Complex Header Structure Simplified Visually -->
                <th class="text-center font-weight-bold text-grey-darken-3 px-0" colspan="14">
                  <div class="d-flex w-100 border-bottom">
                    <div class="flex-grow-1 text-center py-1 border-right text-caption font-weight-bold text-blue-grey">
                      Week 1</div>
                    <div class="flex-grow-1 text-center py-1 border-right text-caption font-weight-bold text-blue-grey">
                      Week 2</div>
                    <div class="flex-grow-1 text-center py-1 text-caption font-weight-bold text-blue-grey">Week 3</div>
                  </div>
                  <div class="d-flex w-100">
                    <div v-for="i in 5" :key="'w1d' + i" class="flex-grow-1 text-center py-1 text-caption text-grey"
                      style="width: 30px">D{{ i }}</div>
                    <div class="border-right mx-1"></div>
                    <div v-for="i in 5" :key="'w2d' + i" class="flex-grow-1 text-center py-1 text-caption text-grey"
                      style="width: 30px">D{{ i }}</div>
                    <div class="border-right mx-1"></div>
                    <div v-for="i in 2" :key="'w3d' + i" class="flex-grow-1 text-center py-1 text-caption text-grey"
                      style="width: 30px">D{{ i }}</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id" class="student-row">
                <td class="font-weight-medium text-body-2">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="grey-lighten-3" class="mr-3">
                      <span class="text-caption font-weight-bold text-primary">{{ student.name.charAt(0) }}</span>
                    </v-avatar>
                    {{ student.name }}
                  </div>
                </td>
                <td class="text-center text-caption text-grey-darken-1">{{ student.gender }}</td>
                <td class="text-center text-caption text-grey-darken-1">{{ student.generation }}</td>
                <td class="text-center text-caption text-grey-darken-1">{{ student.dob }}</td>
                <td class="text-center">
                  <v-chip :color="student.status === 'Active' ? 'success' : 'default'" size="x-small" variant="flat"
                    class="font-weight-bold">
                    {{ student.status }}
                  </v-chip>
                </td>
                <td colspan="14" class="pa-0">
                  <div class="d-flex align-center justify-center h-100 py-2">
                    <div v-for="(attendance, index) in student.attendanceRecord" :key="index"
                      class="d-flex justify-center" style="flex: 1;">
                      <div :class="['attendance-dot', getAttendanceClass(attendance)]"
                        v-tooltip="`Day ${index + 1}: ${getAttendanceLabel(attendance)}`">
                        {{ attendance }}
                      </div>
                      <div v-if="index === 4 || index === 9" class="mx-1 border-right" style="height: 20px;"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions class="justify-center pa-4 border-top">
          <v-pagination v-model="page" :length="3" rounded="circle" density="comfortable"
            active-color="primary"></v-pagination>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// Nuxt Page Meta
definePageMeta({
  layout: 'admin',
  title: 'Dashboard'
})

// State
const search = ref('')
const studentSearch = ref('')
const studentOrder = ref('A-Z')
const page = ref(1)

const filters = ref({
  generation: '9',
  year: '2025',
  group: 'G1',
  specialize: 'CS',
  order: 'A-Z'
})

// Options
const generationOptions = ['9', '10', '11', '12']
const yearOptions = ['2023', '2024', '2025', '2026']
const groupOptions = ['G1', 'G2', 'G3', 'G4']
const specializeOptions = ['CS', 'IT', 'IS', 'SE']
const orderOptions = ['A-Z', 'Z-A']

// Weekly Data for Bar Chart
const weeklyData = ref([
  { value: 45 },
  { value: 43 },
  { value: 44 },
  { value: 42 },
  { value: 45 },
  { value: 44 },
  { value: 43 },
  { value: 45 },
  { value: 44 },
  { value: 45 },
  { value: 44 },
  { value: 45 }
])

const maxWeeklyValue = computed(() => Math.max(...weeklyData.value.map(w => w.value)))

// Mock Data
const students = ref([
  {
    id: 1,
    name: 'MEAN Piseth',
    gender: 'M',
    generation: '9',
    dob: 'Sep 01, 2004',
    status: 'Active',
    attendanceRecord: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
  },
  {
    id: 2,
    name: 'SOK Dara',
    gender: 'M',
    generation: '9',
    dob: 'Aug 15, 2004',
    status: 'Active',
    attendanceRecord: ['P', 'P', 'P', 'A', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
  },
  {
    id: 3,
    name: 'CHAN Thida',
    gender: 'F',
    generation: '9',
    dob: 'Jul 22, 2004',
    status: 'Active',
    attendanceRecord: ['P', 'P', 'L', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
  },
  {
    id: 4,
    name: 'KEO Vanna',
    gender: 'F',
    generation: '9',
    dob: 'Oct 10, 2004',
    status: 'Active',
    attendanceRecord: ['P', 'P', 'P', 'P', 'P', 'A', 'A', 'P', 'P', 'P', 'P', 'P']
  }
])

const filteredStudents = computed(() => {
  let result = students.value
  if (studentSearch.value) {
    result = result.filter(s =>
      s.name.toLowerCase().includes(studentSearch.value.toLowerCase())
    )
  }
  if (filters.value.order === 'Z-A') {
    result = [...result].reverse()
  }
  return result
})

// Helpers
const getAttendanceClass = (attendance) => {
  if (attendance === 'P') return 'status-present'
  if (attendance === 'A') return 'status-absent'
  if (attendance === 'L') return 'status-leave'
  return ''
}

const getAttendanceLabel = (code) => {
  const map = { 'P': 'Present', 'A': 'Absent', 'L': 'Leave' }
  return map[code] || code
}

// Donut Chart Helper
const calculateDashArray = (percentage) => {
  const circumference = 2 * Math.PI * 80
  return (percentage / 100) * circumference
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.gap-3 {
  gap: 12px;
}

.gap-6 {
  gap: 24px;
}

.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.filter-select {
  max-width: 140px;
  min-width: 120px;
}

.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.05) !important;
}

/* Bar Chart Styles */
.bar-chart-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 300px;
  padding: 20px 0;
  gap: 8px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar-wrapper {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 70%;
  background: linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  min-height: 4px;
}

.bar:hover {
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
  transform: scaleY(1.05);
}

.bar-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  font-weight: 500;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.attendance-dot {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  cursor: default;
}

.status-present {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-absent {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-leave {
  background-color: #ffedd5;
  color: #c2410c;
}

/* Custom Scrollbar for table if needed */
.v-table__wrapper::-webkit-scrollbar {
  height: 8px;
}

.v-table__wrapper::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 4px;
}
</style>