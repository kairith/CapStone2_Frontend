<template>
    <v-app>
        <v-main>
            <div class="add-user-container">
                <!-- Header Section -->
                <v-row class="mb-6" align="center">
                    <v-col cols="12">
                        <div class="d-flex align-center ga-3 mb-2">
                            <v-btn icon variant="text" @click="goBack">
                                <v-icon>mdi-arrow-left</v-icon>
                            </v-btn>
                            <h1 class="text-h4 font-weight-bold">Add New User</h1>
                        </div>
                        <p class="text-subtitle-2 text-grey ml-14">Create a new student, teacher, or admin account</p>
                    </v-col>
                </v-row>

                <!-- Form Card -->
                <v-card elevation="2" class="pa-6">
                    <v-form ref="userForm">
                        <v-row>
                            <!-- User Type Selection -->
                            <v-col cols="12" md="6">
                                <v-select v-model="newUser.userType" :items="userTypeOptions" label="User Type *"
                                    variant="outlined" density="comfortable" prepend-inner-icon="mdi-account-circle"
                                    :rules="[v => !!v || 'User type is required']"></v-select>
                            </v-col>

                            <!-- Full Name -->
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newUser.fullName" label="Full Name *" variant="outlined"
                                    density="comfortable" prepend-inner-icon="mdi-account"
                                    :rules="[v => !!v || 'Full name is required']"></v-text-field>
                            </v-col>

                            <!-- Email -->
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newUser.email" label="Email *" type="email" variant="outlined"
                                    density="comfortable" prepend-inner-icon="mdi-email" :rules="[
                                        v => !!v || 'Email is required',
                                        v => /.+@.+\..+/.test(v) || 'Email must be valid'
                                    ]"></v-text-field>
                            </v-col>

                            <!-- Phone Number -->
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newUser.phone" label="Phone Number" variant="outlined"
                                    density="comfortable" prepend-inner-icon="mdi-phone"></v-text-field>
                            </v-col>

                            <!-- Gender -->
                            <v-col cols="12" md="6">
                                <v-select v-model="newUser.gender" :items="['M', 'F', 'Other']" label="Gender *"
                                    variant="outlined" density="comfortable" prepend-inner-icon="mdi-gender-male-female"
                                    :rules="[v => !!v || 'Gender is required']"></v-select>
                            </v-col>

                            <!-- Date of Birth -->
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newUser.dob" label="Date of Birth *" type="date"
                                    variant="outlined" density="comfortable" prepend-inner-icon="mdi-calendar"
                                    :rules="[v => !!v || 'Date of birth is required']"></v-text-field>
                            </v-col>

                            <!-- Student-specific fields -->
                            <template v-if="newUser.userType === 'Student'">
                                <v-col cols="12">
                                    <v-divider class="my-4"></v-divider>
                                    <h3 class="text-h6 mb-4">Student Information</h3>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.studentId" label="Student ID *" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-card-account-details"
                                        :rules="[v => !!v || 'Student ID is required']"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.generation" :items="['9', '10', '11', '12']"
                                        label="Generation *" variant="outlined" density="comfortable"
                                        prepend-inner-icon="mdi-school"
                                        :rules="[v => !!v || 'Generation is required']"></v-select>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.group" :items="['G1', 'G2', 'G3', 'G4']" label="Group *"
                                        variant="outlined" density="comfortable" prepend-inner-icon="mdi-account-group"
                                        :rules="[v => !!v || 'Group is required']"></v-select>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.specialize" :items="['CS', 'IT', 'IS', 'SE']"
                                        label="Specialize *" variant="outlined" density="comfortable"
                                        prepend-inner-icon="mdi-book-education"
                                        :rules="[v => !!v || 'Specialize is required']"></v-select>
                                </v-col>
                            </template>

                            <!-- Teacher-specific fields -->
                            <template v-if="newUser.userType === 'Teacher'">
                                <v-col cols="12">
                                    <v-divider class="my-4"></v-divider>
                                    <h3 class="text-h6 mb-4">Teacher Information</h3>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.department"
                                        :items="['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems']"
                                        label="Department *" variant="outlined" density="comfortable"
                                        prepend-inner-icon="mdi-domain"
                                        :rules="[v => !!v || 'Department is required']"></v-select>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.employeeId" label="Employee ID *" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-badge-account"
                                        :rules="[v => !!v || 'Employee ID is required']"></v-text-field>
                                </v-col>
                            </template>

                            <!-- Admin-specific fields -->
                            <template v-if="newUser.userType === 'Admin'">
                                <v-col cols="12">
                                    <v-divider class="my-4"></v-divider>
                                    <h3 class="text-h6 mb-4">Admin Information</h3>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="newUser.adminRole"
                                        :items="['Super Admin', 'System Admin', 'Department Admin']"
                                        label="Admin Role *" variant="outlined" density="comfortable"
                                        prepend-inner-icon="mdi-shield-account"
                                        :rules="[v => !!v || 'Admin role is required']"></v-select>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="newUser.adminId" label="Admin ID *" variant="outlined"
                                        density="comfortable" prepend-inner-icon="mdi-badge-account"
                                        :rules="[v => !!v || 'Admin ID is required']"></v-text-field>
                                </v-col>
                            </template>

                            <!-- Password Section -->
                            <v-col cols="12">
                                <v-divider class="my-4"></v-divider>
                                <h3 class="text-h6 mb-4">Account Security</h3>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="newUser.password" label="Password *"
                                    :type="showPassword ? 'text' : 'password'" variant="outlined" density="comfortable"
                                    prepend-inner-icon="mdi-lock"
                                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showPassword = !showPassword" :rules="[
                                        v => !!v || 'Password is required',
                                        v => v.length >= 6 || 'Password must be at least 6 characters'
                                    ]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="newUser.confirmPassword" label="Confirm Password *"
                                    :type="showConfirmPassword ? 'text' : 'password'" variant="outlined"
                                    density="comfortable" prepend-inner-icon="mdi-lock-check"
                                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showConfirmPassword = !showConfirmPassword" :rules="[
                                        v => !!v || 'Please confirm password',
                                        v => v === newUser.password || 'Passwords must match'
                                    ]"></v-text-field>
                            </v-col>

                            <!-- Action Buttons -->
                            <v-col cols="12" class="mt-6">
                                <div class="d-flex justify-end ga-3">
                                    <v-btn color="grey" variant="outlined" size="large" @click="goBack">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="primary" variant="elevated" size="large" @click="saveUser">
                                        Create User
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-form>
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
const userTypeOptions = ['Student', 'Teacher', 'Admin']

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
</style>