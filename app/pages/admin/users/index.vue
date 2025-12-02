<template>
    <v-app>
        <v-main>
            <div class="user-management-container">
                <!-- Header Section -->
                <div class="page-header mb-6">
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <h1 class="text-h5 font-weight-bold mb-2">User Management</h1>
                            <p class="text-body-2 text-grey-darken-1">Manage students, lecturers, and admin accounts</p>
                        </div>
                        <v-btn color="primary" prepend-icon="mdi-plus" class="text-none" @click="navigateToAddUser">
                            Add New User
                        </v-btn>
                    </div>
                </div>

                <!-- Stats Cards -->
                <v-row class="mb-6">
                    <v-col cols="12" md="3">
                        <v-card elevation="1">
                            <v-card-text class="pa-4">
                                <div class="text-caption text-grey-darken-1 mb-1">Total Users</div>
                                <div class="text-h4 font-weight-bold">{{ allUsers.length }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card elevation="1">
                            <v-card-text class="pa-4">
                                <div class="text-caption text-grey-darken-1 mb-1">Students</div>
                                <div class="text-h4 font-weight-bold">{{ studentCount }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card elevation="1">
                            <v-card-text class="pa-4">
                                <div class="text-caption text-grey-darken-1 mb-1">Lecturers</div>
                                <div class="text-h4 font-weight-bold">{{ lecturerCount }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card elevation="1">
                            <v-card-text class="pa-4">
                                <div class="text-caption text-grey-darken-1 mb-1">Admins</div>
                                <div class="text-h4 font-weight-bold">{{ adminCount }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Filters Section -->
                <v-card elevation="2" class="mb-6 filter-card">
                    <v-card-title class="bg-grey-lighten-4 py-4">
                        <v-icon class="mr-2" color="indigo">mdi-filter-variant</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">Filter Users</span>
                    </v-card-title>
                    <v-card-text class="pa-5">
                        <v-row class="mb-4">
                            <v-col cols="12" md="3">
                                <v-select v-model="filters.userRole" :items="userRoleOptions" label="User Role"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-account-circle" bg-color="white" color="indigo" />
                            </v-col>

                            <v-col cols="12" md="3" v-if="filters.userRole === 'Student'">
                                <v-select v-model="filters.generation" :items="generationOptions" label="Generation"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-school" bg-color="white" color="indigo" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-select v-model="filters.year" :items="yearOptions" label="Academic Year"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-calendar" bg-color="white" color="indigo" />
                            </v-col>

                            <v-col cols="12" md="3" v-if="filters.userRole === 'Student'">
                                <v-select v-model="filters.group" :items="groupOptions" label="Group" variant="outlined"
                                    density="comfortable" hide-details prepend-inner-icon="mdi-account-group"
                                    bg-color="white" color="indigo" />
                            </v-col>

                            <v-col cols="12" md="3" v-if="filters.userRole === 'Student'">
                                <v-select v-model="filters.specialize" :items="specializeOptions" label="Specialization"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-book-education" bg-color="white" color="indigo" />
                            </v-col>

                            <v-col cols="12" md="3" v-if="filters.userRole === 'Lecturer'">
                                <v-select v-model="filters.department" :items="departmentOptions" label="Department"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-domain" bg-color="white" color="indigo" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-select v-model="filters.status" :items="statusOptions" label="Status"
                                    variant="outlined" density="comfortable" hide-details
                                    prepend-inner-icon="mdi-toggle-switch" bg-color="white" color="indigo" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" class="d-flex justify-space-between align-center">
                                <div class="d-flex ga-3">
                                    <v-btn color="indigo" variant="flat" prepend-icon="mdi-magnify" size="large"
                                        class="text-none font-weight-medium">
                                        Apply Filters
                                    </v-btn>
                                    <v-btn color="grey-darken-1" variant="outlined" prepend-icon="mdi-refresh"
                                        size="large" @click="resetFilters" class="text-none font-weight-medium">
                                        Reset
                                    </v-btn>
                                </div>
                                <div class="d-flex ga-3">
                                    <v-btn color="green-darken-1" variant="tonal" prepend-icon="mdi-file-import"
                                        size="large" class="text-none font-weight-medium">
                                        Import Users
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="tonal" prepend-icon="mdi-file-export"
                                        size="large" class="text-none font-weight-medium">
                                        Export Data
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <!-- User Information Table -->
                <v-card elevation="1" class="data-table-card">
                    <v-card-title class="pa-4">
                        <div class="d-flex justify-space-between align-center w-100">
                            <span class="text-h6 font-weight-bold">{{ tableTitle }}</span>
                            <div class="d-flex align-center ga-3">
                                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Search..."
                                    variant="outlined" density="compact" hide-details style="min-width: 250px" />
                                <v-select v-model="tableOrder" :items="['A-Z', 'Z-A']" label="Sort" variant="outlined"
                                    density="compact" hide-details style="max-width: 120px" />
                            </div>
                        </div>
                    </v-card-title>

                    <v-card-text class="pa-0">
                        <v-table class="user-table">
                            <thead>
                                <tr class="table-header">
                                    <th class="text-center\" style="width: 60px">#</th>
                                    <th class="text-left" style="min-width: 180px">Full Name</th>
                                    <th class="text-center" style="width: 100px">Role</th>
                                    <th class="text-left" style="min-width: 180px">Email</th>
                                    <th class="text-center" style="width: 130px">Phone</th>
                                    <th class="text-center" style="width: 150px">{{ dynamicColumnHeader }}</th>
                                    <th class="text-center" style="width: 100px">Status</th>
                                    <th class="text-center" style="width: 120px">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="table-row">
                                    <td class="text-center">
                                        <span class="text-body-2 text-grey-darken-1">
                                            {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                                        </span>
                                    </td>
                                    <td class="text-left">
                                        <div class="d-flex align-center ga-3 py-2">
                                            <v-avatar color="grey-darken-2" size="36">
                                                <span class="text-white font-weight-medium">{{ user.name.charAt(0)
                                                }}</span>
                                            </v-avatar>
                                            <div>
                                                <div class="font-weight-medium">{{ user.name }}</div>
                                                <div class="text-caption text-grey">{{ getUserId(user) }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <v-chip size="small" variant="outlined">
                                            {{ user.role }}
                                        </v-chip>
                                    </td>
                                    <td class="text-left">
                                        <div class="d-flex align-center">
                                            <v-icon size="16" class="mr-2" color="grey-darken-1">mdi-email</v-icon>
                                            {{ user.email }}
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="d-flex align-center justify-center">
                                            <v-icon size="16" class="mr-2" color="grey-darken-1">mdi-phone</v-icon>
                                            {{ user.phone }}
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <v-chip size="small" variant="outlined">
                                            {{ getDynamicColumnValue(user) }}
                                        </v-chip>
                                    </td>
                                    <td class="text-center">
                                        <v-chip :color="user.status === 'Active' ? 'success' : 'default'" size="small"
                                            variant="flat">
                                            {{ user.status }}
                                        </v-chip>
                                    </td>
                                    <td class="text-center">
                                        <div class="d-flex justify-center ga-1">
                                            <v-btn icon size="small" variant="text" @click="editUser(user)">
                                                <v-icon>mdi-pencil</v-icon>
                                                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                            </v-btn>

                                            <v-btn icon size="small" variant="text" @click="toggleUserStatus(user)">
                                                <v-icon>
                                                    {{ user.status === 'Active' ? 'mdi-account-off' :
                                                        'mdi-account-check' }}
                                                </v-icon>
                                                <v-tooltip activator="parent" location="top">
                                                    {{ user.status === 'Active' ? 'Deactivate' : 'Activate' }}
                                                </v-tooltip>
                                            </v-btn>

                                            <v-btn icon size="small" variant="text" color="error"
                                                @click="deleteUser(user)">
                                                <v-icon>mdi-delete</v-icon>
                                                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                            </v-btn>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="filteredUsers.length === 0">
                                    <td colspan="8" class="text-center py-8">
                                        <v-icon size="64" color="grey-lighten-1">mdi-account-off-outline</v-icon>
                                        <p class="text-h6 text-grey-darken-1 mt-3">No users found</p>
                                        <p class="text-body-2 text-grey">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>

                        <!-- Pagination -->
                        <v-divider></v-divider>
                        <div class="d-flex justify-space-between align-center pa-4\">
                            <span class="text-body-2 text-grey-darken-1">
                                Showing {{ paginatedUsers.length }} of {{ filteredUsers.length }} users
                            </span>
                            <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" size="small"
                                rounded="circle">
                            </v-pagination>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
// definePageMeta({
//     layout: false
// })

const router = useRouter()

// Filters
const filters = ref({
    userRole: 'All',
    generation: '9',
    year: '2025',
    group: 'G1',
    specialize: 'CS',
    department: 'Computer Science',
    status: 'All'
})

const userRoleOptions = ['All', 'Student', 'Lecturer', 'Admin']
const generationOptions = ['9', '10', '11', '12']
const yearOptions = ['2023', '2024', '2025', '2026']
const groupOptions = ['G1', 'G2', 'G3', 'G4']
const specializeOptions = ['CS', 'IT', 'IS', 'SE']
const departmentOptions = ['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems']
const statusOptions = ['All', 'Active', 'Inactive']

// Search and sorting
const search = ref('')
const tableOrder = ref('A-Z')
const currentPage = ref(1)
const itemsPerPage = 10

// All users data (Students, Lecturers, Admins)
const allUsers = ref([
    // Students
    { id: 1, name: 'MEAN Piseth', role: 'Student', email: 'piseth@example.com', phone: '+855 12 345 678', gender: 'M', dob: 'Sep 01, 2004', studentId: 'IDTB090121', generation: '9', group: 'G1', specialize: 'CS', status: 'Active' },
    { id: 2, name: 'CHIM Vine', role: 'Student', email: 'vine@example.com', phone: '+855 12 345 679', gender: 'M', dob: 'Aug 15, 2004', studentId: 'IDTB090122', generation: '9', group: 'G1', specialize: 'IT', status: 'Active' },
    { id: 3, name: 'SOK Vathana', role: 'Student', email: 'vathana@example.com', phone: '+855 12 345 680', gender: 'M', dob: 'Jul 20, 2004', studentId: 'IDTB090123', generation: '9', group: 'G2', specialize: 'CS', status: 'Active' },
    { id: 4, name: 'LIM Sreymom', role: 'Student', email: 'sreymom@example.com', phone: '+855 12 345 681', gender: 'F', dob: 'Jun 10, 2004', studentId: 'IDTB090124', generation: '10', group: 'G1', specialize: 'SE', status: 'Inactive' },
    { id: 5, name: 'KONG Sophea', role: 'Student', email: 'sophea@example.com', phone: '+855 12 345 682', gender: 'F', dob: 'May 05, 2004', studentId: 'IDTB090125', generation: '10', group: 'G2', specialize: 'IS', status: 'Active' },

    // Lecturers
    { id: 6, name: 'Dr. CHAN Rithy', role: 'Lecturer', email: 'rithy@example.com', phone: '+855 11 234 567', department: 'Computer Science', employeeId: 'EMP001', specialization: 'Data Science', status: 'Active' },
    { id: 7, name: 'Prof. LY Dara', role: 'Lecturer', email: 'dara@example.com', phone: '+855 11 234 568', department: 'Information Technology', employeeId: 'EMP002', specialization: 'Network Security', status: 'Active' },
    { id: 8, name: 'Dr. HEM Sokha', role: 'Lecturer', email: 'sokha@example.com', phone: '+855 11 234 569', department: 'Software Engineering', employeeId: 'EMP003', specialization: 'Web Development', status: 'Active' },
    { id: 9, name: 'Prof. PHEAP Sothea', role: 'Lecturer', email: 'sothea@example.com', phone: '+855 11 234 570', department: 'Computer Science', employeeId: 'EMP004', specialization: 'AI & Machine Learning', status: 'Inactive' },

    // Admins
    { id: 10, name: 'PHENG Ratanak', role: 'Admin', email: 'ratanak@example.com', phone: '+855 10 123 456', adminRole: 'Super Admin', adminId: 'ADM001', department: 'Administration', status: 'Active' },
    { id: 11, name: 'CHHAY Bopha', role: 'Admin', email: 'bopha@example.com', phone: '+855 10 123 457', adminRole: 'System Admin', adminId: 'ADM002', department: 'IT Department', status: 'Active' }
])

// Computed properties
const tableTitle = computed(() => {
    if (filters.value.userRole === 'All') return 'All Users'
    return `${filters.value.userRole} Information`
})

const dynamicColumnHeader = computed(() => {
    switch (filters.value.userRole) {
        case 'Student':
            return 'Student ID'
        case 'Lecturer':
            return 'Department'
        case 'Admin':
            return 'Admin Role'
        default:
            return 'ID / Department'
    }
})

// Filtered users
const filteredUsers = computed(() => {
    let result = allUsers.value

    // Filter by user role
    if (filters.value.userRole !== 'All') {
        result = result.filter(u => u.role === filters.value.userRole)
    }

    // Filter by status
    if (filters.value.status !== 'All') {
        result = result.filter(u => u.status === filters.value.status)
    }

    // Filter students by generation, group, specialize
    if (filters.value.userRole === 'Student') {
        if (filters.value.generation) {
            result = result.filter(u => !u.generation || u.generation === filters.value.generation)
        }
        if (filters.value.group) {
            result = result.filter(u => !u.group || u.group === filters.value.group)
        }
        if (filters.value.specialize) {
            result = result.filter(u => !u.specialize || u.specialize === filters.value.specialize)
        }
    }

    // Filter lecturers by department
    if (filters.value.userRole === 'Lecturer' && filters.value.department) {
        result = result.filter(u => !u.department || u.department === filters.value.department)
    }

    // Search filter
    if (search.value) {
        result = result.filter(u =>
            u.name.toLowerCase().includes(search.value.toLowerCase()) ||
            u.email.toLowerCase().includes(search.value.toLowerCase()) ||
            (u.studentId && u.studentId.toLowerCase().includes(search.value.toLowerCase())) ||
            (u.employeeId && u.employeeId.toLowerCase().includes(search.value.toLowerCase())) ||
            (u.adminId && u.adminId.toLowerCase().includes(search.value.toLowerCase()))
        )
    }

    // Sort by name
    if (tableOrder.value === 'Z-A') {
        result = [...result].reverse()
    }

    return result
})

const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredUsers.value.slice(start, end)
})

const studentCount = computed(() => {
    return allUsers.value.filter(u => u.role === 'Student').length
})

const lecturerCount = computed(() => {
    return allUsers.value.filter(u => u.role === 'Lecturer').length
})

const adminCount = computed(() => {
    return allUsers.value.filter(u => u.role === 'Admin').length
})

// Helper functions
const getRoleColor = (role) => {
    switch (role) {
        case 'Student':
            return 'blue-darken-1'
        case 'Lecturer':
            return 'green-darken-1'
        case 'Admin':
            return 'purple-darken-1'
        default:
            return 'grey'
    }
}

const getRoleIcon = (role) => {
    switch (role) {
        case 'Student':
            return 'mdi-school'
        case 'Lecturer':
            return 'mdi-account-tie'
        case 'Admin':
            return 'mdi-shield-account'
        default:
            return 'mdi-account'
    }
}

const getUserId = (user) => {
    return user.studentId || user.employeeId || user.adminId || 'N/A'
}

const getDynamicColumnValue = (user) => {
    switch (user.role) {
        case 'Student':
            return user.studentId
        case 'Lecturer':
            return user.department
        case 'Admin':
            return user.adminRole
        default:
            return 'N/A'
    }
}

const resetFilters = () => {
    filters.value = {
        userRole: 'All',
        generation: '9',
        year: '2025',
        group: 'G1',
        specialize: 'CS',
        department: 'Computer Science',
        status: 'All'
    }
}

// Navigation
const navigateToAddUser = () => {
    router.push('/admin/users/add-user')
}

// Actions
const editUser = (user) => {
    console.log('Edit user:', user)
    // TODO: Navigate to edit page or open edit dialog
    router.push(`/admin/users/edit-user/${user.id}`)
}

const deleteUser = (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        console.log('Delete user:', user)
        // TODO: Call API to delete user
        const index = allUsers.value.findIndex(u => u.id === user.id)
        if (index > -1) {
            allUsers.value.splice(index, 1)
        }
        alert(`${user.name} has been deleted successfully!`)
    }
}

const toggleUserStatus = (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    user.status = newStatus
    console.log(`User ${user.name} status changed to: ${newStatus}`)
    alert(`${user.name} is now ${newStatus}`)
}
</script>

<style scoped>
.user-management-container {
    padding: 24px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.page-header {
    margin-bottom: 24px;
}

.data-table-card {
    border-radius: 8px;
    overflow: hidden;
}

.user-table {
    width: 100%;
}

.table-header {
    background-color: #f5f5f5;
}

.table-header th {
    font-weight: 600 !important;
    padding: 16px !important;
    color: #616161 !important;
}

.user-table tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid #e0e0e0;
}

.table-row:hover {
    background-color: #fafafa !important;
}
</style>