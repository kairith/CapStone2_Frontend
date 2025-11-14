<template>
  <div class="lecturer-dashboard">
    <!-- Modern Header -->
    <div class="modern-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="welcome-section">
          <div class="greeting-card">
            <div class="greeting-icon">
              <v-icon icon="mdi-account-tie" size="32" />
            </div>
            <div class="greeting-content">
              <h1 class="greeting-title">Welcome back, {{ lecturerName }}!</h1>
              <p class="greeting-subtitle">{{ department }} • {{ getCurrentDate() }}</p>
              <div class="greeting-stats">
                <div class="quick-stat">
                  <v-icon icon="mdi-calendar-today" size="16" class="mr-1" />
                  {{ todaySessions }} classes today
                </div>
                <div class="quick-stat">
                  <v-icon icon="mdi-account-group" size="16" class="mr-1" />
                  {{ totalStudents }} students
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="quick-actions">
            <v-btn
              color="white"
              variant="flat"
              size="large"
              prepend-icon="mdi-qrcode-scan"
              class="action-btn"
              rounded="xl"
            >
              Take Attendance
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              prepend-icon="mdi-calendar-plus"
              class="action-btn secondary"
              rounded="xl"
            >
              Schedule Class
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Stats Cards -->
    <div class="stats-section">
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stat-card classes">
            <div class="stat-icon">
              <v-icon icon="mdi-school" size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalClasses }}</div>
              <div class="stat-label">My Classes</div>
              <div class="stat-change positive">
                <v-icon icon="mdi-trending-up" size="12" />
                +2 this semester
              </div>
            </div>
          </div>

          <div class="stat-card students">
            <div class="stat-icon">
              <v-icon icon="mdi-account-group" size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalStudents }}</div>
              <div class="stat-label">Total Students</div>
              <div class="stat-change positive">
                <v-icon icon="mdi-trending-up" size="12" />
                +15 this year
              </div>
            </div>
          </div>

          <div class="stat-card sessions">
            <div class="stat-icon">
              <v-icon icon="mdi-calendar-today" size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ todaySessions }}</div>
              <div class="stat-label">Today's Sessions</div>
              <div class="stat-change neutral">
                <v-icon icon="mdi-clock-outline" size="12" />
                2 remaining
              </div>
            </div>
          </div>

          <div class="stat-card attendance">
            <div class="stat-icon">
              <v-icon icon="mdi-chart-line" size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ avgAttendance }}%</div>
              <div class="stat-label">Avg Attendance</div>
              <div class="stat-change positive">
                <v-icon icon="mdi-trending-up" size="12" />
                +3% vs last month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-container">
        <div class="content-grid">
          <!-- Today's Classes -->
          <div class="content-card classes-card">
            <div class="card-header">
              <h2 class="card-title">
                <v-icon icon="mdi-calendar-today" size="20" class="mr-2" />
                Today's Classes
              </h2>
              <v-btn
                variant="text"
                size="small"
                append-icon="mdi-chevron-right"
                to="/lecturer/classes"
                class="view-all-btn"
              >
                View All
              </v-btn>
            </div>
            
            <div class="classes-list">
              <div 
                v-for="class_item in todayClasses" 
                :key="class_item.id" 
                class="class-item"
                :class="{ 'completed': class_item.status === 'completed' }"
              >
                <div class="class-time">
                  <div class="time">{{ formatTime(class_item.time) }}</div>
                  <div class="duration">{{ getDuration(class_item.time) }}</div>
                </div>
                
                <div class="class-details">
                  <div class="class-main">
                    <h3 class="class-subject">{{ class_item.subject }}</h3>
                    <div class="class-meta">
                      <span class="class-group">{{ class_item.group }}</span>
                      <span class="class-room">{{ class_item.room }}</span>
                      <span class="class-students">{{ class_item.students }} students</span>
                    </div>
                  </div>
                </div>
                
                <div class="class-actions">
                  <div class="class-status">
                    <v-chip
                      :color="class_item.status === 'completed' ? 'success' : 'primary'"
                      size="small"
                      variant="tonal"
                      rounded="lg"
                    >
                      <v-icon 
                        :icon="class_item.status === 'completed' ? 'mdi-check' : 'mdi-clock-outline'" 
                        size="14" 
                        class="mr-1"
                      />
                      {{ class_item.status === 'completed' ? 'Completed' : 'Upcoming' }}
                    </v-chip>
                  </div>
                  
                  <v-btn
                    :color="class_item.status === 'completed' ? 'success' : 'primary'"
                    variant="flat"
                    size="small"
                    :to="`/lecturer/classes/${class_item.id}`"
                    class="class-action-btn"
                    rounded="lg"
                  >
                    <v-icon 
                      :icon="class_item.status === 'completed' ? 'mdi-eye' : 'mdi-qrcode-scan'" 
                      size="16"
                      class="mr-1"
                    />
                    {{ class_item.status === 'completed' ? 'View' : 'Take Attendance' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Leave Requests -->
          <div class="content-card leave-card">
            <div class="card-header">
              <h2 class="card-title">
                <v-icon icon="mdi-calendar-remove" size="20" class="mr-2" />
                Recent Leave Requests
              </h2>
              <v-btn
                variant="text"
                size="small"
                append-icon="mdi-chevron-right"
                to="/lecturer/leave"
                class="view-all-btn"
              >
                View All
              </v-btn>
            </div>
            
            <div class="leave-list">
              <div 
                v-for="leave in recentLeaves" 
                :key="leave.id" 
                class="leave-item"
              >
                <div class="student-info">
                  <v-avatar size="40" class="student-avatar">
                    <span>{{ leave.student.charAt(0) }}</span>
                  </v-avatar>
                  <div class="student-details">
                    <h3 class="student-name">{{ leave.student }}</h3>
                    <div class="leave-meta">
                      <span class="leave-date">{{ formatDate(leave.date) }}</span>
                      <span class="leave-reason">{{ leave.reason }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="leave-actions">
                  <v-chip
                    :color="getLeaveStatusColor(leave.status)"
                    size="small"
                    variant="tonal"
                    rounded="lg"
                    class="status-chip"
                  >
                    <v-icon 
                      :icon="getLeaveStatusIcon(leave.status)" 
                      size="14" 
                      class="mr-1"
                    />
                    {{ capitalizeStatus(leave.status) }}
                  </v-chip>
                  
                  <v-menu v-if="leave.status === 'pending'">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-dots-vertical"
                        size="small"
                        variant="text"
                        class="action-menu-btn"
                      />
                    </template>
                    <v-list class="action-menu" rounded="lg">
                      <v-list-item @click="approveLeave(leave.id)">
                        <template v-slot:prepend>
                          <v-icon icon="mdi-check" color="success" />
                        </template>
                        <v-list-item-title>Approve</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="rejectLeave(leave.id)">
                        <template v-slot:prepend>
                          <v-icon icon="mdi-close" color="error" />
                        </template>
                        <v-list-item-title>Reject</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <v-btn
                color="primary"
                variant="tonal"
                block
                to="/lecturer/leave"
                rounded="lg"
                class="view-all-leave-btn"
              >
                <v-icon start>mdi-calendar-remove</v-icon>
                View All Leave Requests
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
    layout: 'lecturer',
    middleware: ['auth', 'role-lecturer']
})

const lecturerName = ref('Dr. Jane Smith')
const department = ref('Computer Science Department')
const totalClasses = ref(6)
const totalStudents = ref(120)
const todaySessions = ref(3)
const avgAttendance = ref(85)

const todayClasses = ref([
    {
        id: 1,
        subject: 'Data Structures',
        group: 'CS-A',
        time: '09:00 - 11:00',
        room: 'Lab 101',
        students: 30,
        status: 'completed'
    },
    {
        id: 2,
        subject: 'Algorithms',
        group: 'CS-B',
        time: '14:00 - 16:00',
        room: 'Room 205',
        students: 25,
        status: 'upcoming'
    },
    {
        id: 3,
        subject: 'Database Systems',
        group: 'CS-C',
        time: '16:30 - 18:30',
        room: 'Lab 102',
        students: 28,
        status: 'upcoming'
    }
])

const recentLeaves = ref([
    {
        id: 1,
        student: 'John Doe',
        date: '2024-10-20',
        reason: 'Medical',
        status: 'pending'
    },
    {
        id: 2,
        student: 'Alice Johnson',
        date: '2024-10-19',
        reason: 'Family emergency',
        status: 'approved'
    },
    {
        id: 3,
        student: 'Bob Wilson',
        date: '2024-10-18',
        reason: 'Personal',
        status: 'pending'
    }
])

// Helper methods
const getCurrentDate = () => {
  const now = new Date()
  return now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatTime = (timeRange) => {
  return timeRange.split(' - ')[0]
}

const getDuration = (timeRange) => {
  const [start, end] = timeRange.split(' - ')
  const startTime = new Date(`1970-01-01T${start}:00`)
  const endTime = new Date(`1970-01-01T${end}:00`)
  const duration = (endTime - startTime) / (1000 * 60 * 60)
  return `${duration}h`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const getLeaveStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'pending': return 'warning'
    default: return 'grey'
  }
}

const getLeaveStatusIcon = (status) => {
  switch (status) {
    case 'approved': return 'mdi-check-circle'
    case 'rejected': return 'mdi-close-circle'
    case 'pending': return 'mdi-clock-outline'
    default: return 'mdi-help-circle'
  }
}

const capitalizeStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const approveLeave = (leaveId) => {
  console.log('Approving leave:', leaveId)
  // Implementation for approving leave
}

const rejectLeave = (leaveId) => {
  console.log('Rejecting leave:', leaveId)
  // Implementation for rejecting leave
}
</script>

<style scoped>
/* Modern Lecturer Dashboard Styles */
.lecturer-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Modern Header */
.modern-header {
  position: relative;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.05;
}

.header-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.greeting-card {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.greeting-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25);
  flex-shrink: 0;
}

.greeting-content {
  flex: 1;
}

.greeting-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.greeting-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.greeting-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.quick-stat {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
}

.quick-actions {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.action-btn {
  height: 48px;
  padding: 0 24px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.25);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
}

.action-btn.secondary {
  background: transparent;
  color: #667eea;
  border-color: #667eea;
  box-shadow: none;
}

.action-btn.secondary:hover {
  background: rgba(102, 126, 234, 0.05);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.15);
}

/* Stats Section */
.stats-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 32px 0;
}

.stats-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-gradient);
}

.stat-card.classes {
  --card-gradient: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.stat-card.students {
  --card-gradient: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.stat-card.sessions {
  --card-gradient: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.stat-card.attendance {
  --card-gradient: linear-gradient(90deg, #06b6d4 0%, #0891b2 100%);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-card.classes .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.students .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-card.sessions .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-card.attendance .stat-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 8px;
}

.stat-change.positive {
  color: #059669;
  background: #ecfdf5;
}

.stat-change.neutral {
  color: #d97706;
  background: #fffbeb;
}

/* Main Content */
.main-content {
  padding: 32px 0;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.content-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.view-all-btn {
  color: #667eea;
  text-transform: none;
  font-weight: 500;
}

/* Classes List */
.classes-list {
  padding: 8px 0;
}

.class-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.class-item:hover {
  background: #f8fafc;
}

.class-item:last-child {
  border-bottom: none;
}

.class-item.completed {
  opacity: 0.7;
}

.class-time {
  text-align: center;
  min-width: 80px;
}

.time {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.duration {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  margin-top: 2px;
}

.class-details {
  flex: 1;
}

.class-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.class-subject {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.class-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.class-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.class-action-btn {
  text-transform: none;
  font-weight: 500;
  height: 32px;
  min-width: 120px;
}

/* Leave List */
.leave-list {
  padding: 8px 0;
}

.leave-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.leave-item:hover {
  background: #f8fafc;
}

.leave-item:last-child {
  border-bottom: none;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.student-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.student-details {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.leave-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #64748b;
}

.leave-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-chip {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-menu-btn {
  color: #64748b;
}

.action-menu {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 8px;
}

.card-footer {
  padding: 16px 24px;
  background: #fafbfc;
  border-top: 1px solid #f1f5f9;
}

.view-all-leave-btn {
  text-transform: none;
  font-weight: 600;
  height: 44px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    gap: 24px;
  }

  .greeting-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .greeting-title {
    font-size: 24px;
  }

  .quick-actions {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .class-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .class-time {
    text-align: left;
    min-width: auto;
  }

  .class-actions {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .leave-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .leave-actions {
    width: 100%;
    justify-content: space-between;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card,
.content-card {
  animation: fadeInUp 0.6s ease-out;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.content-card:nth-child(1) { animation-delay: 0.5s; }
.content-card:nth-child(2) { animation-delay: 0.6s; }
</style>