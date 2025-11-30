<template>
    <v-app>
        <v-main>
            <div class="add-user-container">
                <!-- Header Section -->
                <div class="page-header mb-6">
                    <v-btn icon variant="text" @click="goBack" class="mb-4">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <h1 class="text-h5 font-weight-bold mb-2">Add New User</h1>
                    <p class="text-body-2 text-grey-darken-1">Create a new student, lecturer, or admin account</p>
                </div>

                <!-- Form Card -->
                <v-card elevation="1" class="form-card">
                    <v-card-text class="pa-6">
                        <v-form ref="userForm">
                            <!-- Basic Information Section -->
                            <div class="section-header mb-4">
                                <span class="text-subtitle-1 font-weight-bold">Basic Information</span>
                            </div>

                            <v-row>
                                <!-- User Type Selection -->
                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.userType" :items="userTypeOptions" label="User Type *"
                                        variant="outlined" density="comfortable" prepend-inner-icon="mdi-account-circle"
                                        :rules="[v => !!v || 'User type is required']">
                                    </v-select>
                                </v-col>

                                <!-- Full Name -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.fullName" label="Full Name *" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-account"
                                        :rules="[v => !!v || 'Full name is required']">
                                    </v-text-field>
                                </v-col>

                                <!-- Email -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.email" label="Email Address *" type="email"
                                        variant="outlined" density="comfortable" prepend-inner-icon="mdi-email" :rules="[
                                            v => !!v || 'Email is required',
                                            v => /.+@.+\..+/.test(v) || 'Email must be valid'
                                        ]">
                                    </v-text-field>
                                </v-col>

                                <!-- Phone Number -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.phone" label="Phone Number" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-phone">
                                    </v-text-field>
                                </v-col>

                                <!-- Gender -->
                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.gender" :items="['M', 'F', 'Other']" label="Gender *"
                                        variant="outlined" density="comfortable"
                                        prepend-inner-icon="mdi-gender-male-female"
                                        :rules="[v => !!v || 'Gender is required']">
                                    </v-select>
                                </v-col>

                                <!-- Date of Birth -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.dob" label="Date of Birth *" type="date"
                                        variant="outlined" density="comfortable" prepend-inner-icon="mdi-calendar"
                                        :rules="[v => !!v || 'Date of birth is required']">
                                    </v-text-field>
                                </v-col>

                                <!-- Student-specific fields -->
                                <template v-if="newUser.userType === 'Student'">
                                    <v-col cols="12">
                                        <v-divider class="my-6"></v-divider>
                                        <div class="section-header mb-5">
                                            <v-icon color="blue-darken-1" class="mr-2">mdi-school</v-icon>
                                            <span class="text-h6 font-weight-bold text-blue-darken-2">Student
                                                Information</span>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="newUser.studentId" label="Student ID *"
                                            variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-card-account-details" color="blue-darken-1"
                                            bg-color="blue-lighten-5" :rules="[v => !!v || 'Student ID is required']">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="newUser.generation" :items="['9', '10', '11', '12']"
                                            label="Generation *" variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-school" color="blue-darken-1"
                                            bg-color="blue-lighten-5" :rules="[v => !!v || 'Generation is required']">
                                        </v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="newUser.group" :items="['G1', 'G2', 'G3', 'G4']"
                                            label="Group *" variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-account-group" color="blue-darken-1"
                                            bg-color="blue-lighten-5" :rules="[v => !!v || 'Group is required']">
                                        </v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="newUser.specialize" :items="['CS', 'IT', 'IS', 'SE']"
                                            label="Specialization *" variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-book-education" color="blue-darken-1"
                                            bg-color="blue-lighten-5"
                                            :rules="[v => !!v || 'Specialization is required']">
                                        </v-select>
                                    </v-col>
                                </template>

                                <!-- Lecturer-specific fields -->
                                <template v-if="newUser.userType === 'Lecturer'">
                                    <v-col cols="12">
                                        <v-divider class="my-6"></v-divider>
                                        <div class="section-header mb-5">
                                            <v-icon color="green-darken-1" class="mr-2">mdi-account-tie</v-icon>
                                            <span class="text-h6 font-weight-bold text-green-darken-2">Lecturer
                                                Information</span>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="newUser.department"
                                            :items="['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems']"
                                            label="Department *" variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-domain" color="green-darken-1"
                                            bg-color="green-lighten-5" :rules="[v => !!v || 'Department is required']">
                                        </v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="newUser.employeeId" label="Employee ID *"
                                            variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-badge-account" color="green-darken-1"
                                            bg-color="green-lighten-5" :rules="[v => !!v || 'Employee ID is required']">
                                        </v-text-field>
                                    </v-col>
                                </template>

                                <!-- Admin-specific fields -->
                                <template v-if="newUser.userType === 'Admin'">
                                    <v-col cols="12">
                                        <v-divider class="my-6"></v-divider>
                                        <div class="section-header mb-5">
                                            <v-icon color="purple-darken-1" class="mr-2">mdi-shield-account</v-icon>
                                            <span class="text-h6 font-weight-bold text-purple-darken-2">Admin
                                                Information</span>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="newUser.adminRole"
                                            :items="['Super Admin', 'System Admin', 'Department Admin']"
                                            label="Admin Role *" variant="outlined" density="comfortable"
                                            prepend-inner-icon="mdi-shield-account"
                                            :rules="[v => !!v || 'Admin role is required']">
                                        </v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="newUser.adminId" label="Admin ID *" variant="outlined"
                                            density="comfortable" prepend-inner-icon="mdi-badge-account"
                                            :rules="[v => !!v || 'Admin ID is required']">
                                        </v-text-field>
                                    </v-col>
                                </template>

                                <!-- Password Section -->
                                <v-col cols="12">
                                    <v-divider class="my-5"></v-divider>
                                    <div class="section-header mb-4">
                                        <span class="text-subtitle-1 font-weight-bold">Account Security</span>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.password" label="Password *"
                                        :type="showPassword ? 'text' : 'password'" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-lock"
                                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPassword = !showPassword" :rules="[
                                            v => !!v || 'Password is required',
                                            v => v.length >= 6 || 'Password must be at least 6 characters'
                                        ]">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.confirmPassword" label="Confirm Password *"
                                        :type="showConfirmPassword ? 'text' : 'password'" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-lock-check"
                                        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showConfirmPassword = !showConfirmPassword" :rules="[
                                            v => !!v || 'Please confirm password',
                                            v => v === newUser.password || 'Passwords must match'
                                        ]">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <!-- Action Buttons -->
                    <v-divider></v-divider>
                    <v-card-actions class="pa-5">
                        <v-spacer></v-spacer>
                        <v-btn variant="outlined" size="large" @click="goBack" class="text-none px-6">
                            Cancel
                        </v-btn>
                        <v-btn color="primary" variant="flat" size="large" @click="saveUser" class="text-none px-8">
                            Create User
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
definePageMeta({
    layout: false
})

const router = useRouter()
const userForm = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// User type options
const userTypeOptions = ['Student', 'Lecturer', 'Admin']

// New user form data
const newUser = ref({
    userType: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    studentId: '',
    generation: '',
    group: '',
    specialize: '',
    department: '',
    employeeId: '',
    adminRole: '',
    adminId: '',
    password: '',
    confirmPassword: ''
})

// Navigation
const goBack = () => {
    router.push('/admin/users/user-management')
}

// Save user
const saveUser = async () => {
    const { valid } = await userForm.value.validate()

    if (valid) {
        console.log('Saving user:', newUser.value)

        // TODO: Send data to API
        // Example: await userStore.createUser(newUser.value)

        // Show success message
        alert(`${newUser.value.userType} "${newUser.value.fullName}" created successfully!`)

        // Navigate back to user management
        goBack()
    }
}
</script>

<style scoped>
.add-user-container {
    padding: 24px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.page-header {
    margin-bottom: 24px;
}

.form-card {
    border-radius: 8px;
}

.section-header {
    padding-bottom: 8px;
    border-bottom: 2px solid #e0e0e0;
}
</style>