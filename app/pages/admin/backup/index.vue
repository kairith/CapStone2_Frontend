<template>
    <div>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-6">System Backup</h1>
            </v-col>
        </v-row>

        <!-- Backup Actions -->
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Create Backup</v-card-title>
                    <v-card-text>
                        <p>Create a new backup of the system data including:</p>
                        <ul>
                            <li>User data</li>
                            <li>Class information</li>
                            <li>Attendance records</li>
                            <li>System settings</li>
                        </ul>
                        <v-btn color="primary" block class="mt-4" :loading="isCreatingBackup" @click="createBackup">
                            <v-icon left>mdi-backup-restore</v-icon>
                            Create Backup
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Restore from Backup</v-card-title>
                    <v-card-text>
                        <p>Restore system data from a previous backup file.</p>
                        <v-file-input v-model="backupFile" label="Select backup file" accept=".bak,.zip"
                            prepend-icon="mdi-file-upload" class="mb-4"></v-file-input>
                        <v-btn color="warning" block :disabled="!backupFile" :loading="isRestoring"
                            @click="restoreBackup">
                            <v-icon left>mdi-restore</v-icon>
                            Restore Backup
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Backup History -->
        <v-row class="mt-6">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Backup History</v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="backupHistory" :loading="loading">
                            <template v-slot:item.actions="{ item }">
                                <v-btn icon small @click="downloadBackup(item)">
                                    <v-icon>mdi-download</v-icon>
                                </v-btn>
                                <v-btn icon small color="error" @click="deleteBackup(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>

                            <template v-slot:item.size="{ item }">
                                {{ formatFileSize(item.size) }}
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'role-admin']
})

const backupFile = ref(null)
const isCreatingBackup = ref(false)
const isRestoring = ref(false)
const loading = ref(false)

const headers = [
    { title: 'Backup Name', key: 'name' },
    { title: 'Date Created', key: 'created' },
    { title: 'Size', key: 'size' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const backupHistory = ref([
    {
        id: 1,
        name: 'backup_2024_10_18_14_30.bak',
        created: '2024-10-18 14:30:00',
        size: 1024000
    },
    {
        id: 2,
        name: 'backup_2024_10_17_09_15.bak',
        created: '2024-10-17 09:15:00',
        size: 987654
    }
])

const createBackup = async () => {
    isCreatingBackup.value = true
    try {
        // TODO: Implement backup creation logic
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Add new backup to history
        const newBackup = {
            id: Date.now(),
            name: `backup_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '_')}.bak`,
            created: new Date().toLocaleString(),
            size: 1200000
        }
        backupHistory.value.unshift(newBackup)

        // Show success message
        // TODO: Add notification
    } catch (error) {
        console.error('Backup creation failed:', error)
    } finally {
        isCreatingBackup.value = false
    }
}

const restoreBackup = async () => {
    isRestoring.value = true
    try {
        // TODO: Implement backup restoration logic
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Show success message
        // TODO: Add notification
    } catch (error) {
        console.error('Backup restoration failed:', error)
    } finally {
        isRestoring.value = false
    }
}

const downloadBackup = (backup) => {
    // TODO: Implement download logic
    console.log('Download backup:', backup.name)
}

const deleteBackup = (backup) => {
    // TODO: Implement delete logic with confirmation
    const index = backupHistory.value.findIndex(b => b.id === backup.id)
    if (index > -1) {
        backupHistory.value.splice(index, 1)
    }
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>