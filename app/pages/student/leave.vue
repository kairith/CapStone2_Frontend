<template>
  <v-app>
    <div class="layout-container">
      <!-- Left sidebar -->
      <Navbar class="layout-navbar" />

      <!-- Right: header + content -->
      <div class="layout-content">
        <AppHeader class="layout-header" />

        <v-main>
          <v-container class="pa-4 leave-page" fluid>
            <div class="lr-wrapper">
              <v-card class="lr-card" elevation="1">
                <!-- HEADER BAR (similar style to professor table) -->
                <div class="lr-header">
                  <div>
                    <h1 class="lr-title">
                      Student Leave Request
                    </h1>
                    <p class="lr-subtitle">
                      Submit a request for an excused absence from scheduled classes.
                    </p>
                  </div>

                  <div class="lr-header-chips">
                    <v-chip color="primary" variant="flat" class="mr-2 mb-2">
                      Attendance status:
                      <strong class="ml-1">excused</strong>
                    </v-chip>
                    <v-chip color="grey-darken-1" variant="tonal" class="mb-2">
                      Method:
                      <strong class="ml-1">manual</strong>
                    </v-chip>
                  </div>
                </div>

                <v-divider />

                <!-- FORM BODY -->
                <div class="lr-body">
                  <v-form ref="formRef" @submit.prevent="onSubmit">
                    <!-- ======================
                         1. STUDENT INFORMATION
                    ======================= -->
                    <section class="lr-section">
                      <h2 class="section-title">
                        Student & Program Information
                      </h2>

                      <v-row>
                        <!-- Student selector (students table) -->
                        <v-col cols="12" md="6">
                          <v-autocomplete v-model="form.studentId" :items="studentOptions" item-title="label"
                            item-value="id" label="Student*" variant="outlined" density="comfortable" clearable required
                            persistent-hint hint="Bind to students.id" />
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-text-field v-model="currentStudent.student_code" label="Student code" variant="outlined"
                            density="comfortable" readonly persistent-hint hint="students.student_code" />
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-select v-model="currentStudent.gender" :items="genderOptions" label="Gender"
                            variant="outlined" density="comfortable" readonly persistent-hint hint="gender_enum" />
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-text-field v-model="currentStudent.generation" label="Generation" variant="outlined"
                            density="comfortable" readonly persistent-hint hint="generations.generation" />
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-text-field v-model="currentStudent.group" label="Group" variant="outlined"
                            density="comfortable" readonly persistent-hint hint="groups.group_name" />
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-text-field v-model="currentStudent.email" label="Email" variant="outlined"
                            density="comfortable" readonly persistent-hint hint="students.email" />
                        </v-col>
                      </v-row>
                    </section>

                    <v-divider class="my-4" />

                    <!-- ======================
                         2. COURSE / SESSION
                    ======================= -->
                    <section class="lr-section">
                      <h2 class="section-title">
                        Course & Session Information
                      </h2>

                      <v-row>
                        <!-- Term (terms table) -->
                        <v-col cols="12" md="4">
                          <v-select v-model="form.termId" :items="termOptions" item-title="label" item-value="id"
                            label="Term*" variant="outlined" density="comfortable" clearable required persistent-hint
                            hint="terms.id" />
                        </v-col>

                        <!-- Subject (subjects table) -->
                        <v-col cols="12" md="4">
                          <v-autocomplete v-model="form.subjectId" :items="subjectOptions" item-title="label"
                            item-value="id" label="Subject*" variant="outlined" density="comfortable" clearable required
                            persistent-hint hint="subjects.id" />
                        </v-col>

                        <!-- Course offering (course_offerings table) -->
                        <v-col cols="12" md="4">
                          <v-autocomplete v-model="form.offeringId" :items="offeringOptions" item-title="label"
                            item-value="id" label="Course offering*" variant="outlined" density="comfortable" clearable
                            required persistent-hint hint="course_offerings.id" />
                        </v-col>

                        <!-- Leave scope -->
                        <v-col cols="12" md="4">
                          <label class="text-body-2 font-weight-medium mb-1 d-block">
                            Leave scope*
                          </label>
                          <v-radio-group v-model="form.scope" inline density="comfortable">
                            <v-radio label="Specific sessions" value="sessions" />
                            <v-radio label="Full day(s)" value="days" />
                          </v-radio-group>
                        </v-col>

                        <!-- Specific sessions (sessions table) -->
                        <v-col cols="12" md="8" v-if="form.scope === 'sessions'">
                          <v-autocomplete v-model="form.sessionIds" :items="sessionOptions" item-title="label"
                            item-value="id" label="Affected sessions*" variant="outlined" density="comfortable" multiple
                            chips clearable required persistent-hint hint="sessions.id (start_datetime, room_id)" />
                        </v-col>

                        <!-- Date range when using 'days' -->
                        <template v-else>
                          <v-col cols="12" md="4">
                            <v-text-field v-model="form.startDate" label="Start date*" type="date" variant="outlined"
                              density="comfortable" required />
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field v-model="form.endDate" label="End date*" type="date" variant="outlined"
                              density="comfortable" required />
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-select v-model="form.preferredSessions" :items="preferredSessionOptions"
                              label="Covers which sessions?" variant="outlined" density="comfortable" multiple chips />
                          </v-col>
                        </template>
                      </v-row>
                    </section>

                    <v-divider class="my-4" />

                    <!-- ======================
                         3. LEAVE DETAILS
                    ======================= -->
                    <section class="lr-section">
                      <h2 class="section-title">Leave Details</h2>

                      <v-row>
                        <v-col cols="12" md="4">
                          <v-select v-model="form.leaveType" :items="leaveTypeOptions" label="Reason category*"
                            variant="outlined" density="comfortable" required />
                        </v-col>

                        <v-col cols="12" md="8">
                          <v-text-field v-model="form.contactPhone" label="Contact phone during leave"
                            variant="outlined" density="comfortable" />
                        </v-col>

                        <v-col cols="12">
                          <v-textarea v-model="form.reason" label="Detailed explanation*" variant="outlined"
                            density="comfortable" rows="4" auto-grow required persistent-hint
                            hint="Will be stored in remarks or in a dedicated leave_requests table." />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field v-model="form.attachmentUrl" label="Supporting document (URL, optional)"
                            variant="outlined" density="comfortable" placeholder="e.g. link to medical certificate" />
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-text-field v-model="form.requestDate" label="Request date" type="date" variant="outlined"
                            density="comfortable" />
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-select v-model="form.requestedBy" :items="requestedByOptions" label="Requested by"
                            variant="outlined" density="comfortable" />
                        </v-col>
                      </v-row>
                    </section>

                    <!-- SUBMIT -->
                    <div class="lr-footer">
                      <p class="lr-footer-text">
                        When approved, attendance for those sessions should be
                        marked as <strong>excused</strong> with method
                        <strong>manual</strong>.
                      </p>
                      <v-btn type="submit" color="primary" size="large" :loading="isSubmitting">
                        Submit request
                      </v-btn>
                    </div>
                  </v-form>
                </div>
              </v-card>
            </div>
          </v-container>
        </v-main>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, reactive } from "vue";
import Navbar from "~/components/ui/Navbar.vue";
import AppHeader from "~/components/ui/AppHeader.vue";

const formRef = ref(null);
const isSubmitting = ref(false);

/**
 * All these arrays are EMPTY on purpose.
 * You will fetch real data from your API and fill them.
 */
const studentOptions = ref([]);          // students
const termOptions = ref([]);             // terms
const subjectOptions = ref([]);          // subjects
const offeringOptions = ref([]);         // course_offerings
const sessionOptions = ref([]);          // sessions
const genderOptions = ref([]);           // gender_enum
const preferredSessionOptions = ref([]); // e.g. morning/afternoon
const leaveTypeOptions = ref([]);        // your own categories
const requestedByOptions = ref([]);      // e.g. ['Student','Parent']

// Read-only student info bound from selected student (fill from API)
const currentStudent = reactive({
  student_code: "",
  generation: "",
  group: "",
  email: "",
  gender: "",
});

// Main form model (all empty / null by default)
const form = reactive({
  studentId: null,        // students.id
  termId: null,           // terms.id
  subjectId: null,        // subjects.id
  offeringId: null,       // course_offerings.id

  scope: "sessions",      // 'sessions' | 'days'
  sessionIds: [],         // sessions.id[]
  startDate: "",
  endDate: "",
  preferredSessions: [],

  leaveType: "",
  reason: "",
  contactPhone: "",
  attachmentUrl: "",
  requestDate: "",
  requestedBy: "",
});

const onSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isSubmitting.value = true;
  try {
    console.log("Leave request form:", JSON.parse(JSON.stringify(form)));
    // hook to API later
  } finally {
    isSubmitting.value = false;
  }
};

definePageMeta({
    middleware: ['auth'],
    layout: 'student'
})
</script>

<style scoped>
/* ===== Layout (same pattern as other pages) ===== */
.layout-container {
  display: flex;
  min-height: 90vh;
}

.layout-navbar {
  flex-shrink: 0;
}

.layout-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.layout-header {
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
}

.v-main {
  flex-grow: 1;
}

/* ===== Wrapper & card (similar to professor table) ===== */
.leave-page {
  background: #f5f5f7;
}

.lr-wrapper {
  width: 100%;
}

.lr-card {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
}

/* Header bar */
.lr-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 12px 20px;
  gap: 12px;
}

.lr-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.lr-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.lr-header-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Body */
.lr-body {
  padding: 16px 20px 20px 20px;
}

/* Sections */
.lr-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e88e5;
  margin-bottom: 12px;
}

/* Footer */
.lr-footer {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.lr-footer-text {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Responsive header */
@media (max-width: 960px) {
  .lr-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .lr-header-chips {
    justify-content: flex-start;
  }
}
</style>
