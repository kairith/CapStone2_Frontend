<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-icon left>mdi-calendar-remove</v-icon>
            Leave Request
          </v-card-title>
          
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="leaveForm.startDate"
                    label="Start Date"
                    type="date"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="leaveForm.endDate"
                    label="End Date"
                    type="date"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="leaveForm.type"
                    :items="leaveTypes"
                    label="Leave Type"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="leaveForm.reason"
                    label="Reason"
                    :rules="[rules.required]"
                    outlined
                    rows="4"
                  />
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
      </v-col>
    </v-row>
    
    <!-- Leave History -->
    <v-row class="mt-4">
      <v-col>
        <v-card>
          <v-card-title>Leave History</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="leaveHistory"
              :items-per-page="10"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  dark
                  small
                >
                  {{ item.status }}
                </v-chip>
              </template>
</v-data-table>
</v-card-text>
</v-card>
</v-col>
</v-row>
</v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-student'],
    layout: 'student'
})

const valid = ref(false)
const form = ref(null)

const leaveForm = reactive({
    startDate: '',
    endDate: '',
    type: '',
    reason: ''
})

const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Medical Leave']

const rules = {
    required: value => !!value || 'This field is required'
}

const headers = [
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Submitted', key: 'submittedAt' }
]

const leaveHistory = ref([
    {
        id: 1,
        startDate: '2024-01-15',
        endDate: '2024-01-16',
        type: 'Sick Leave',
        status: 'Approved',
        submittedAt: '2024-01-10'
    },
    {
        id: 2,
        startDate: '2024-02-20',
        endDate: '2024-02-20',
        type: 'Personal Leave',
        status: 'Pending',
        submittedAt: '2024-02-15'
    }
])

const submitLeave = async () => {
    if (form.value.validate()) {
        try {
            // Submit leave request logic here
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

const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'green'
        case 'Rejected': return 'red'
        case 'Pending': return 'orange'
        default: return 'grey'
    }
}
</script>