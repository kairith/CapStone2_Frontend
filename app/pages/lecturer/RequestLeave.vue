<template>
    <v-container fluid class="pa-6 page-container">
        <!-- Page Header -->
        <div class="page-header mb-8">
            <div class="d-flex align-center mb-3">
                <v-avatar color="indigo" size="48" class="mr-4">
                    <v-icon color="white" size="28">mdi-calendar-check</v-icon>
                </v-avatar>
                <div>
                    <h1 class="text-h4 font-weight-bold text-grey-darken-3">Leave Management</h1>
                    <p class="text-body-2 text-grey-darken-1 mb-0 mt-1">
                        <v-icon size="16" class="mr-1">mdi-information-outline</v-icon>
                        Approve student requests and manage your own leave applications
                    </p>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <v-card class="mb-6 tab-card" elevation="2">
            <v-tabs v-model="activeTab" color="indigo" bg-color="white" slider-color="indigo" height="64">
                <v-tab value="student-requests" class="text-none font-weight-medium">
                    <v-icon start size="22">mdi-account-group</v-icon>
                    Student Requests
                    <v-badge v-if="pendingStudentRequests > 0" :content="pendingStudentRequests" color="error" inline
                        class="ml-2" floating></v-badge>
                </v-tab>
                <v-tab value="my-requests" class="text-none font-weight-medium">
                    <v-icon start size="22">mdi-account-edit</v-icon>
                    My Leave Requests
                </v-tab>
            </v-tabs>
        </v-card>

        <v-window v-model="activeTab">
            <!-- Student Requests Tab -->
            <v-window-item value="student-requests">
                <!-- Stats Cards -->
                <v-row class="mb-6">
                    <v-col cols="12" md="3">
                        <v-card class="stat-card stat-card-blue" elevation="3" hover>
                            <v-card-text class="pa-5">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-blue-grey-darken-1 font-weight-medium mb-2">Total
                                            Requests</div>
                                        <div class="text-h3 font-weight-bold text-indigo-darken-2">{{
                                            studentLeaveRequests.length }}</div>
                                        <div class="text-caption text-grey-darken-1 mt-1">All submissions</div>
                                    </div>
                                    <v-avatar color="indigo-lighten-5" size="56" class="stat-icon">
                                        <v-icon color="indigo" size="30">mdi-file-document-multiple</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card stat-card-orange" elevation="3" hover>
                            <v-card-text class="pa-5">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-orange-darken-1 font-weight-medium mb-2">Pending
                                            Review</div>
                                        <div class="text-h3 font-weight-bold text-orange-darken-2">{{
                                            pendingStudentRequests }}</div>
                                        <div class="text-caption text-grey-darken-1 mt-1">Awaiting action</div>
                                    </div>
                                    <v-avatar color="orange-lighten-5" size="56" class="stat-icon">
                                        <v-icon color="orange-darken-1" size="30">mdi-clock-alert-outline</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card stat-card-green" elevation="3" hover>
                            <v-card-text class="pa-5">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-green-darken-1 font-weight-medium mb-2">Approved
                                        </div>
                                        <div class="text-h3 font-weight-bold text-green-darken-2">{{
                                            approvedStudentRequests }}</div>
                                        <div class="text-caption text-grey-darken-1 mt-1">Accepted requests</div>
                                    </div>
                                    <v-avatar color="green-lighten-5" size="56" class="stat-icon">
                                        <v-icon color="green-darken-1" size="30">mdi-check-circle</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card class="stat-card stat-card-red" elevation="3" hover>
                            <v-card-text class="pa-5">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-red-darken-1 font-weight-medium mb-2">Rejected
                                        </div>
                                        <div class="text-h3 font-weight-bold text-red-darken-2">{{
                                            rejectedStudentRequests }}</div>
                                        <div class="text-caption text-grey-darken-1 mt-1">Declined requests</div>
                                    </div>
                                    <v-avatar color="red-lighten-5" size="56" class="stat-icon">
                                        <v-icon color="red-darken-1" size="30">mdi-close-circle</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Filter -->
                <v-card elevation="2" class="mb-6 filter-card">
                    <v-card-title class="bg-grey-lighten-4 py-3">
                        <v-icon class="mr-2" color="indigo">mdi-filter-variant</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">Filter Requests</span>
                    </v-card-title>
                    <v-card-text class="pa-5">
                        <v-row align="center">
                            <v-col cols="12" md="4">
                                <v-text-field v-model="studentSearchQuery" prepend-inner-icon="mdi-magnify"
                                    label="Search by student name or ID..." variant="outlined" density="comfortable"
                                    hide-details clearable bg-color="white" color="indigo"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-select v-model="studentStatusFilter" :items="statusFilterOptions"
                                    label="Filter by Status" variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-format-list-bulleted" bg-color="white"
                                    color="indigo"></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-select v-model="studentClassFilter" :items="classFilterOptions"
                                    label="Filter by Class" variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-google-classroom" bg-color="white"
                                    color="indigo"></v-select>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-btn color="indigo" variant="tonal" block @click="resetStudentFilters" size="large"
                                    prepend-icon="mdi-refresh">
                                    Reset
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <!-- Student Requests Table -->
                <v-card elevation="2" class="data-table-card">
                    <v-card-title class="bg-indigo-lighten-5 py-4">
                        <v-icon class="mr-2" color="indigo">mdi-account-group</v-icon>
                        <span class="text-h6 font-weight-bold text-indigo-darken-2">Student Leave Requests</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="studentRequestHeaders" :items="filteredStudentRequests"
                            :items-per-page="10" class="modern-table" hover>
                            <template v-slot:item.student="{ item }">
                                <div class="d-flex align-center py-3">
                                    <v-avatar color="indigo" size="44" class="mr-3 elevation-1">
                                        <span class="text-white font-weight-bold">{{ item.student.charAt(0) }}</span>
                                    </v-avatar>
                                    <div>
                                        <div class="font-weight-bold text-grey-darken-3">{{ item.student }}</div>
                                        <div class="text-caption text-grey-darken-1">
                                            <v-icon size="12" class="mr-1">mdi-identifier</v-icon>{{ item.studentId }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-slot:item.class="{ item }">
                                <v-chip size="small" variant="flat" color="indigo-lighten-4"
                                    class="font-weight-medium text-indigo-darken-2">
                                    <v-icon start size="14">mdi-book-open-variant</v-icon>
                                    {{ item.class }}
                                </v-chip>
                            </template>
                            <template v-slot:item.dates="{ item }">
                                <div>
                                    <div>{{ formatDate(item.startDate) }}</div>
                                    <div class="text-caption text-grey">to {{ formatDate(item.endDate) }}</div>
                                </div>
                            </template>
                            <template v-slot:item.duration="{ item }">
                                {{ calculateDuration(item.startDate, item.endDate) }} days
                            </template>
                            <template v-slot:item.type="{ item }">
                                <v-chip size="small" variant="outlined">{{ item.type }}</v-chip>
                            </template>
                            <template v-slot:item.status="{ item }">
                                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat"
                                    class="font-weight-bold">
                                    <v-icon start size="14">{{ getStatusIcon(item.status) }}</v-icon>
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <div class="d-flex align-center gap-1">
                                    <v-btn icon size="small" variant="tonal" color="indigo"
                                        @click="viewStudentRequest(item)">
                                        <v-icon size="18">mdi-eye</v-icon>
                                        <v-tooltip activator="parent" location="top">View Details</v-tooltip>
                                    </v-btn>
                                    <v-btn v-if="item.status === 'Pending'" icon size="small" variant="tonal"
                                        color="success" @click="approveRequest(item)">
                                        <v-icon size="18">mdi-check-bold</v-icon>
                                        <v-tooltip activator="parent" location="top">Approve Request</v-tooltip>
                                    </v-btn>
                                    <v-btn v-if="item.status === 'Pending'" icon size="small" variant="tonal"
                                        color="error" @click="rejectRequest(item)">
                                        <v-icon size="18">mdi-close-thick</v-icon>
                                        <v-tooltip activator="parent" location="top">Reject Request</v-tooltip>
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- My Requests Tab -->
            <v-window-item value="my-requests">
                <!-- My Stats -->
                <v-row class="mb-6">
                    <v-col cols="12" md="3">
                        <v-card class="stat-card" elevation="1">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-caption text-grey">Total Requests</div>
                                        <div class="text-h4 font-weight-bold mt-1">{{ myLeaveRequests.length }}</div>
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
                                        <div class="text-h4 font-weight-bold mt-1 text-success">{{ approvedMyRequests }}
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
                                        <div class="text-h4 font-weight-bold mt-1 text-warning">{{ pendingMyRequests }}
                                        </div>
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
                                        <div class="text-h4 font-weight-bold mt-1 text-error">{{ rejectedMyRequests }}
                                        </div>
                                    </div>
                                    <v-avatar color="red-lighten-5" size="50">
                                        <v-icon color="error">mdi-close-circle</v-icon>
                                    </v-avatar>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <!-- New Request Button -->
                <div class="text-right mb-6">
                    <v-btn color="indigo" prepend-icon="mdi-plus-circle" size="x-large" elevation="2"
                        class="text-none font-weight-bold px-6" @click="showNewLeaveDialog = true">
                        Submit New Leave Request
                    </v-btn>
                </div>

                <!-- My Requests Table -->
                <v-card elevation="2" class="data-table-card">
                    <v-card-title class="bg-indigo-lighten-5 py-4">
                        <v-icon class="mr-2" color="indigo">mdi-history</v-icon>
                        <span class="text-h6 font-weight-bold text-indigo-darken-2">My Leave History</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="myRequestHeaders" :items="myLeaveRequests" :items-per-page="10"
                            class="modern-table" hover>
                            <template v-slot:item.dates="{ item }">
                                <div>
                                    <div>{{ formatDate(item.startDate) }}</div>
                                    <div class="text-caption text-grey">to {{ formatDate(item.endDate) }}</div>
                                </div>
                            </template>
                            <template v-slot:item.duration="{ item }">
                                {{ calculateDuration(item.startDate, item.endDate) }} days
                            </template>
                            <template v-slot:item.type="{ item }">
                                <v-chip size="small" variant="outlined">{{ item.type }}</v-chip>
                            </template>
                            <template v-slot:item.status="{ item }">
                                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:item.submittedAt="{ item }">
                                {{ formatDate(item.submittedAt) }}
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn icon size="small" variant="text" @click="viewMyRequest(item)">
                                    <v-icon>mdi-eye</v-icon>
                                    <v-tooltip activator="parent" location="top">View Details</v-tooltip>
                                </v-btn>
                                <v-btn v-if="item.status === 'Pending'" icon size="small" variant="text" color="error"
                                    @click="cancelMyRequest(item)">
                                    <v-icon>mdi-delete</v-icon>
                                    <v-tooltip activator="parent" location="top">Cancel Request</v-tooltip>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-window-item>
        </v-window>

        <!-- New Leave Request Dialog -->
        <v-dialog v-model="showNewLeaveDialog" max-width="650">
            <v-card elevation="8" class="rounded-lg">
                <v-card-title class="pa-5 bg-gradient-indigo">
                    <div class="d-flex align-center">
                        <v-icon color="white" size="28" class="mr-3">mdi-calendar-plus</v-icon>
                        <span class="text-h6 font-weight-bold text-white">Submit Leave Request to Admin</span>
                    </div>
                    <v-card-text class="pa-7">
                        <v-form ref="leaveForm" v-model="leaveFormValid">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="leaveFormData.startDate" label="Start Date*" type="date"
                                        :rules="[rules.required]" variant="outlined" density="comfortable"
                                        color="indigo" prepend-inner-icon="mdi-calendar-start"
                                        bg-color="grey-lighten-5" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="leaveFormData.endDate" label="End Date*" type="date"
                                        :rules="[rules.required, rules.endDateAfterStart]" variant="outlined"
                                        density="comfortable" color="indigo" prepend-inner-icon="mdi-calendar-end"
                                        bg-color="grey-lighten-5" />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-select v-model="leaveFormData.type" :items="leaveTypes" label="Leave Type*"
                                        :rules="[rules.required]" variant="outlined" density="comfortable"
                                        color="indigo" prepend-inner-icon="mdi-format-list-bulleted-type"
                                        bg-color="grey-lighten-5" />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-textarea v-model="leaveFormData.reason" label="Detailed Reason*"
                                        :rules="[rules.required]" variant="outlined" rows="5" color="indigo"
                                        bg-color="grey-lighten-5" prepend-inner-icon="mdi-text-box-outline"
                                        placeholder="Please provide a comprehensive explanation for your leave request. Include any relevant details that support your application..." />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-file-input v-model="leaveFormData.attachment"
                                        label="Supporting Documents (Optional)" variant="outlined" density="comfortable"
                                        prepend-icon="mdi-paperclip" accept=".pdf,.doc,.docx,.jpg,.png"
                                        hint="Attach medical certificates, conference invitations, etc. (PDF, DOC, or Image files)"
                                        persistent-hint color="indigo" bg-color="grey-lighten-5" />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="pa-5">
                        <v-spacer />
                        <v-btn variant="outlined" size="large" @click="closeLeaveDialog" class="text-none px-6">
                            Cancel
                        </v-btn>
                        <v-btn color="indigo" size="large" @click="submitLeaveRequest" :disabled="!leaveFormValid"
                            class="text-none px-8 font-weight-bold" prepend-icon="mdi-send">
                            Submit Request
                        </v-btn>
                    </v-card-actions>
                </v-card-title>
            </v-card>
        </v-dialog>

        <!-- View Student Request Dialog -->
        <v-dialog v-model="viewStudentDialog" max-width="750">
            <v-card v-if="selectedStudentRequest" elevation="8" class="rounded-lg">
                <v-card-title class="pa-5 bg-gradient-indigo">
                    <div class="d-flex justify-space-between align-center">
                        <div class="d-flex align-center">
                            <v-icon color="white" size="28" class="mr-3">mdi-file-document-outline</v-icon>
                            <span class="text-h6 font-weight-bold text-white">Student Leave Request Details</span>
                        </div>
                        <v-btn icon="mdi-close" variant="text" color="white" @click="viewStudentDialog = false"></v-btn>
                    </div>
                </v-card-title>
                <v-card-text class="pa-7">
                    <v-row>
                        <v-col cols="12">
                            <div class="student-info-card pa-4 mb-5">
                                <div class="d-flex align-center">
                                    <v-avatar color="indigo" size="72" class="mr-4 elevation-3">
                                        <span class="text-h4 text-white font-weight-bold">{{
                                            selectedStudentRequest.student.charAt(0) }}</span>
                                    </v-avatar>
                                    <div>
                                        <div class="text-h5 font-weight-bold text-grey-darken-3 mb-1">{{
                                            selectedStudentRequest.student }}</div>
                                        <div class="text-body-1 text-grey-darken-1 mb-2">
                                            <v-icon size="16" class="mr-1">mdi-identifier</v-icon>{{
                                                selectedStudentRequest.studentId }}
                                        </div>
                                        <v-chip size="small" variant="flat" color="indigo-lighten-4"
                                            class="font-weight-medium text-indigo-darken-2">
                                            <v-icon start size="14">mdi-book-open-variant</v-icon>
                                            {{ selectedStudentRequest.class }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <v-row>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Leave Type</div>
                                <div class="font-weight-bold">{{ selectedStudentRequest.type }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Status</div>
                                <v-chip :color="getStatusColor(selectedStudentRequest.status)" size="small">
                                    {{ selectedStudentRequest.status }}
                                </v-chip>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Start Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedStudentRequest.startDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">End Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedStudentRequest.endDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Duration</div>
                                <div class="font-weight-bold">{{ calculateDuration(selectedStudentRequest.startDate,
                                    selectedStudentRequest.endDate) }} days</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3">
                                <div class="text-caption text-grey mb-2">Reason</div>
                                <div>{{ selectedStudentRequest.reason }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pa-4" v-if="selectedStudentRequest.status === 'Pending'">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" @click="viewStudentDialog = false">Close</v-btn>
                    <v-btn color="error" variant="outlined" prepend-icon="mdi-close"
                        @click="rejectRequest(selectedStudentRequest)">
                        Reject
                    </v-btn>
                    <v-btn color="success" variant="flat" prepend-icon="mdi-check"
                        @click="approveRequest(selectedStudentRequest)">
                        Approve
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- View My Request Dialog -->
        <v-dialog v-model="viewMyRequestDialog" max-width="700">
            <v-card v-if="selectedMyRequest">
                <v-card-title class="pa-4 bg-grey-lighten-4">
                    <div class="d-flex justify-space-between align-center">
                        <span class="text-h6 font-weight-bold">My Leave Request Details</span>
                        <v-btn icon="mdi-close" variant="text" @click="viewMyRequestDialog = false"></v-btn>
                    </div>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Leave Type</div>
                                <div class="font-weight-bold">{{ selectedMyRequest.type }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Status</div>
                                <v-chip :color="getStatusColor(selectedMyRequest.status)" size="small">
                                    {{ selectedMyRequest.status }}
                                </v-chip>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Start Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedMyRequest.startDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">End Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedMyRequest.endDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Duration</div>
                                <div class="font-weight-bold">{{ calculateDuration(selectedMyRequest.startDate,
                                    selectedMyRequest.endDate) }} days</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Submitted Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedMyRequest.submittedAt) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3">
                                <div class="text-caption text-grey mb-2">Reason</div>
                                <div>{{ selectedMyRequest.reason }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12" v-if="selectedMyRequest.adminComment">
                            <div class="info-box pa-3 bg-blue-lighten-5">
                                <div class="text-caption text-grey mb-2">Admin Comment</div>
                                <div>{{ selectedMyRequest.adminComment }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" @click="viewMyRequestDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Reject Reason Dialog -->
        <v-dialog v-model="rejectDialog" max-width="550">
            <v-card elevation="8" class="rounded-lg">
                <v-card-title class="pa-5 bg-gradient-red">
                    <div class="d-flex align-center">
                        <v-icon color="white" size="28" class="mr-3">mdi-close-circle-outline</v-icon>
                        <span class="text-h6 font-weight-bold text-white">Reject Leave Request</span>
                    </div>
                </v-card-title>
                <v-card-text class="pa-7">
                    <p class="text-body-1 text-grey-darken-1 mb-4">Please provide a detailed explanation for
                        rejecting
                        this request. This will help the student understand your decision.</p>
                    <v-textarea v-model="rejectReason" label="Reason for Rejection*" variant="outlined" rows="5"
                        placeholder="Enter a clear and constructive reason for declining this leave request..."
                        :rules="[rules.required]" color="error" bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-text-box-outline" />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-5">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" size="large" @click="rejectDialog = false" class="text-none px-6">
                        Cancel
                    </v-btn>
                    <v-btn color="error" variant="flat" size="large" @click="confirmReject"
                        class="text-none px-8 font-weight-bold" prepend-icon="mdi-close-thick">
                        Confirm Rejection
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> <!-- Success Snackbar -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarMessage }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

// State
const activeTab = ref('student-requests')
const showNewLeaveDialog = ref(false)
const viewStudentDialog = ref(false)
const viewMyRequestDialog = ref(false)
const rejectDialog = ref(false)
const leaveFormValid = ref(false)
const selectedStudentRequest = ref(null)
const selectedMyRequest = ref(null)
const rejectReason = ref('')
const requestToReject = ref(null)

// Filters
const studentSearchQuery = ref('')
const studentStatusFilter = ref('All')
const studentClassFilter = ref('All Classes')

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Form Data
const leaveFormData = reactive({
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
    attachment: null
})

// Options
const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Medical Leave', 'Conference', 'Research', 'Vacation', 'Family Emergency']
const statusFilterOptions = ['All', 'Pending', 'Approved', 'Rejected']
const classFilterOptions = ['All Classes', 'CS201', 'CS303', 'CS405', 'CS407', 'CS501']

// Validation Rules
const rules = {
    required: value => !!value || 'This field is required',
    endDateAfterStart: value => {
        if (!leaveFormData.startDate || !value) return true
        return new Date(value) >= new Date(leaveFormData.startDate) || 'End date must be after start date'
    }
}

// Student Leave Requests (Mock Data)
const studentLeaveRequests = ref([
    {
        id: 1,
        student: 'CHAN Sok',
        studentId: 'e20210001',
        class: 'CS201',
        startDate: '2025-02-15',
        endDate: '2025-02-17',
        type: 'Sick Leave',
        reason: 'I have been diagnosed with flu and need to rest for recovery.',
        status: 'Pending',
        submittedAt: '2025-02-10'
    },
    {
        id: 2,
        student: 'LIM Dara',
        studentId: 'e20210002',
        class: 'CS303',
        startDate: '2025-02-20',
        endDate: '2025-02-20',
        type: 'Personal Leave',
        reason: 'Family commitment that requires my presence.',
        status: 'Pending',
        submittedAt: '2025-02-12'
    },
    {
        id: 3,
        student: 'SREY Pov',
        studentId: 'e20210003',
        class: 'CS201',
        startDate: '2025-01-10',
        endDate: '2025-01-12',
        type: 'Medical Leave',
        reason: 'Medical appointment and checkup.',
        status: 'Approved',
        submittedAt: '2025-01-05'
    },
    {
        id: 4,
        student: 'KIM Sreynich',
        studentId: 'e20210004',
        class: 'CS405',
        startDate: '2025-01-20',
        endDate: '2025-01-21',
        type: 'Emergency Leave',
        reason: 'Family emergency.',
        status: 'Rejected',
        rejectionReason: 'Insufficient documentation provided.',
        submittedAt: '2025-01-18'
    },
    {
        id: 5,
        student: 'PHON Ratanak',
        studentId: 'e20210005',
        class: 'CS407',
        startDate: '2025-02-25',
        endDate: '2025-02-26',
        type: 'Sick Leave',
        reason: 'Fever and headache.',
        status: 'Pending',
        submittedAt: '2025-02-14'
    }
])

// My Leave Requests (Mock Data)
const myLeaveRequests = ref([
    {
        id: 1,
        startDate: '2025-03-15',
        endDate: '2025-03-17',
        type: 'Conference',
        reason: 'Attending International Computer Science Conference in Bangkok.',
        status: 'Approved',
        submittedAt: '2025-02-20',
        adminComment: 'Approved. Please submit conference report upon return.'
    },
    {
        id: 2,
        startDate: '2025-04-10',
        endDate: '2025-04-10',
        type: 'Personal Leave',
        reason: 'Personal matters to attend to.',
        status: 'Pending',
        submittedAt: '2025-02-22'
    },
    {
        id: 3,
        startDate: '2025-01-05',
        endDate: '2025-01-07',
        type: 'Sick Leave',
        reason: 'Medical treatment required.',
        status: 'Approved',
        submittedAt: '2024-12-28',
        adminComment: 'Get well soon.'
    },
    {
        id: 4,
        startDate: '2024-12-20',
        endDate: '2024-12-21',
        type: 'Research',
        reason: 'Field research for ongoing project.',
        status: 'Rejected',
        submittedAt: '2024-12-10',
        adminComment: 'Please reschedule as this conflicts with final exam period.'
    }
])

// Table Headers
const studentRequestHeaders = [
    { title: 'Student', key: 'student' },
    { title: 'Class', key: 'class' },
    { title: 'Dates', key: 'dates' },
    { title: 'Duration', key: 'duration' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const myRequestHeaders = [
    { title: 'Dates', key: 'dates' },
    { title: 'Duration', key: 'duration' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Submitted', key: 'submittedAt' },
    { title: 'Actions', key: 'actions', sortable: false }
]

// Computed
const filteredStudentRequests = computed(() => {
    let result = studentLeaveRequests.value

    // Filter by search
    if (studentSearchQuery.value) {
        const query = studentSearchQuery.value.toLowerCase()
        result = result.filter(r =>
            r.student.toLowerCase().includes(query) ||
            r.studentId.toLowerCase().includes(query)
        )
    }

    // Filter by status
    if (studentStatusFilter.value !== 'All') {
        result = result.filter(r => r.status === studentStatusFilter.value)
    }

    // Filter by class
    if (studentClassFilter.value !== 'All Classes') {
        result = result.filter(r => r.class === studentClassFilter.value)
    }

    return result
})

const pendingStudentRequests = computed(() =>
    studentLeaveRequests.value.filter(r => r.status === 'Pending').length
)

const approvedStudentRequests = computed(() =>
    studentLeaveRequests.value.filter(r => r.status === 'Approved').length
)

const rejectedStudentRequests = computed(() =>
    studentLeaveRequests.value.filter(r => r.status === 'Rejected').length
)

const approvedMyRequests = computed(() =>
    myLeaveRequests.value.filter(r => r.status === 'Approved').length
)

const pendingMyRequests = computed(() =>
    myLeaveRequests.value.filter(r => r.status === 'Pending').length
)

const rejectedMyRequests = computed(() =>
    myLeaveRequests.value.filter(r => r.status === 'Rejected').length
)

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
}

const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'success'
        case 'Rejected': return 'error'
        case 'Pending': return 'warning'
        default: return 'grey'
    }
}

const getStatusIcon = (status) => {
    switch (status) {
        case 'Approved': return 'mdi-check-circle'
        case 'Rejected': return 'mdi-close-circle'
        case 'Pending': return 'mdi-clock-outline'
        default: return 'mdi-help-circle'
    }
}

const resetStudentFilters = () => {
    studentSearchQuery.value = ''
    studentStatusFilter.value = 'All'
    studentClassFilter.value = 'All Classes'
}

const viewStudentRequest = (request) => {
    selectedStudentRequest.value = request
    viewStudentDialog.value = true
}

const viewMyRequest = (request) => {
    selectedMyRequest.value = request
    viewMyRequestDialog.value = true
}

const approveRequest = (request) => {
    const index = studentLeaveRequests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
        studentLeaveRequests.value[index].status = 'Approved'
        showSnackbar('Leave request approved successfully', 'success')
        viewStudentDialog.value = false
    }
}

const rejectRequest = (request) => {
    requestToReject.value = request
    rejectDialog.value = true
    viewStudentDialog.value = false
}

const confirmReject = () => {
    if (requestToReject.value && rejectReason.value) {
        const index = studentLeaveRequests.value.findIndex(r => r.id === requestToReject.value.id)
        if (index !== -1) {
            studentLeaveRequests.value[index].status = 'Rejected'
            studentLeaveRequests.value[index].rejectionReason = rejectReason.value
            showSnackbar('Leave request rejected', 'error')
        }
        rejectDialog.value = false
        rejectReason.value = ''
        requestToReject.value = null
    }
}

const submitLeaveRequest = () => {
    const newRequest = {
        id: myLeaveRequests.value.length + 1,
        ...leaveFormData,
        status: 'Pending',
        submittedAt: new Date().toISOString().split('T')[0]
    }
    myLeaveRequests.value.unshift(newRequest)
    showSnackbar('Leave request submitted successfully', 'success')
    closeLeaveDialog()
}

const closeLeaveDialog = () => {
    showNewLeaveDialog.value = false
    Object.keys(leaveFormData).forEach(key => {
        leaveFormData[key] = key === 'attachment' ? null : ''
    })
}

const cancelMyRequest = (request) => {
    myLeaveRequests.value = myLeaveRequests.value.filter(r => r.id !== request.id)
    showSnackbar('Leave request cancelled', 'info')
}

const showSnackbar = (message, color) => {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
}
</script>

<style scoped>
.page-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    min-height: 100vh;
}

.page-header {
    animation: fadeInDown 0.6s ease-out;
}

.stat-card {
    border-radius: 16px;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.stat-card-blue {
    border-left-color: #3949AB;
}

.stat-card-orange {
    border-left-color: #F57C00;
}

.stat-card-green {
    border-left-color: #388E3C;
}

.stat-card-red {
    border-left-color: #D32F2F;
}

.stat-icon {
    transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
    transform: scale(1.1) rotate(5deg);
}

.tab-card {
    border-radius: 16px;
    overflow: hidden;
}

.filter-card {
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.data-table-card {
    border-radius: 16px;
    overflow: hidden;
}

.modern-table {
    background-color: white;
}

.modern-table :deep(thead) {
    background-color: #f5f5f5;
}

.modern-table :deep(th) {
    font-weight: 700 !important;
    color: #424242 !important;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
}

.modern-table :deep(tbody tr) {
    transition: background-color 0.2s ease;
}

.modern-table :deep(tbody tr:hover) {
    background-color: #f8f9fa !important;
}

.bg-gradient-indigo {
    background: linear-gradient(135deg, #3949AB 0%, #5C6BC0 100%);
}

.bg-gradient-red {
    background: linear-gradient(135deg, #D32F2F 0%, #E57373 100%);
}

.info-box {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    border-radius: 12px;
    border-left: 3px solid #3949AB;
}

.student-info-card {
    background: linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%);
    border-radius: 16px;
    border: 2px solid #3949AB;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.rounded-lg {
    border-radius: 16px;
}
</style>