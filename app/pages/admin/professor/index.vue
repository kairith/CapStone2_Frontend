<template>


    <!-- Body area under the header -->
    <!-- professor page template -->
    <div class="layout-body">
        <v-container fluid class="prof-page-container">
            <ProfessorTable :professors="professors" :permissions="permissions" @edit="handleEdit"
                @delete="handleDelete" @view="handleView" />
        </v-container>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import ProfessorTable from "~/components/admin/professors/ProfessorTable.vue";
definePageMeta({
    layout: "admin",
});
const router = useRouter();

const professors = ref([
    {
        id: 1,
        professor_code: "PROF-001",
        name: "Dr. John Doe",
        email: "john.doe@example.com",
        department: "Computer Science",
        phone: "012 345 678",
        status: "Active",
    },
    {
        id: 2,
        professor_code: "PROF-002",
        name: "Dr. Jane Smith",
        email: "jane.smith@example.com",
        department: "Information Technology",
        phone: "098 765 432",
        status: "On Leave",
    },
    {
        id: 3,
        professor_code: "PROF-003",
        name: "Dr. Michael Chan",
        email: "michael.chan@example.com",
        department: "Mathematics",
        phone: "010 234 567",
        status: "Active",
    },
    {
        id: 4,
        professor_code: "PROF-004",
        name: "Dr. Laura Kim",
        email: "laura.kim@example.com",
        department: "Physics",
        phone: "099 556 761",
        status: "Active",
    },
    {
        id: 5,
        professor_code: "PROF-005",
        name: "Dr. Robert Lee",
        email: "robert.lee@example.com",
        department: "Chemistry",
        phone: "093 827 364",
        status: "On Leave",
    },
    {
        id: 6,
        professor_code: "PROF-006",
        name: "Dr. Angela Rivera",
        email: "angela.rivera@example.com",
        department: "Business Administration",
        phone: "087 444 222",
        status: "Active",
    },
    {
        id: 7,
        professor_code: "PROF-007",
        name: "Dr. Samuel Park",
        email: "samuel.park@example.com",
        department: "Information Technology",
        phone: "088 221 113",
        status: "Active",
    },
    {
        id: 8,
        professor_code: "PROF-008",
        name: "Dr. Emily Watson",
        email: "emily.watson@example.com",
        department: "Nursing",
        phone: "016 558 209",
        status: "On Leave",
    },
    {
        id: 9,
        professor_code: "PROF-009",
        name: "Dr. Kevin Brown",
        email: "kevin.brown@example.com",
        department: "Engineering",
        phone: "067 322 111",
        status: "Active",
    },
    {
        id: 10,
        professor_code: "PROF-010",
        name: "Dr. Susan Hart",
        email: "susan.hart@example.com",
        department: "Architecture",
        phone: "077 990 443",
        status: "Active",
    },
    {
        id: 11,
        professor_code: "PROF-011",
        name: "Dr. Patrick Wilson",
        email: "patrick.wilson@example.com",
        department: "Computer Science",
        phone: "015 789 345",
        status: "On Leave",
    },
    {
        id: 12,
        professor_code: "PROF-012",
        name: "Dr. Harriet Moore",
        email: "harriet.moore@example.com",
        department: "Pharmacy",
        phone: "061 233 890",
        status: "Active",
    },
    {
        id: 13,
        professor_code: "PROF-013",
        name: "Dr. Anthony Scott",
        email: "anthony.scott@example.com",
        department: "Literature",
        phone: "099 887 001",
        status: "Active",
    },
    {
        id: 14,
        professor_code: "PROF-014",
        name: "Dr. Kimberly Adams",
        email: "kimberly.adams@example.com",
        department: "Human Resources",
        phone: "097 224 669",
        status: "On Leave",
    },
    {
        id: 15,
        professor_code: "PROF-015",
        name: "Dr. Victor Nguyen",
        email: "victor.nguyen@example.com",
        department: "Management",
        phone: "092 556 710",
        status: "Active",
    },
    {
        id: 16,
        professor_code: "PROF-016",
        name: "Dr. Sophia Turner",
        email: "sophia.turner@example.com",
        department: "Marketing",
        phone: "089 773 442",
        status: "Active",
    },
    {
        id: 17,
        professor_code: "PROF-017",
        name: "Dr. Daniel Cooper",
        email: "daniel.cooper@example.com",

        department: "Education",
        phone: "090 123 776",
        status: "On Leave",
    },
    {
        id: 18,
        professor_code: "PROF-018",
        name: "Dr. Maria Lopez",
        email: "maria.lopez@example.com",
        department: "Psychology",
        phone: "096 889 441",
        status: "Active",
    },
    {
        id: 19,
        professor_code: "PROF-019",
        name: "Dr. Felix Grant",
        email: "felix.grant@example.com",
        department: "Sociology",
        phone: "086 112 908",
        status: "Active",
    },
    {
        id: 20,
        professor_code: "PROF-020",
        name: "Dr. Jasmine Patel",
        email: "jasmine.patel@example.com",
        department: "Biology",
        phone: "085 443 229",
        status: "On Leave",
    },
]);

const permissions = reactive({
    add: true,
    edit: true,
    delete: true,
    list: true,
});

const handleEdit = (id: number | string) => {
    router.push(`/admin/professor/edit/${id}`);
};

const handleDelete = (id: number | string) => {
    professors.value = professors.value.filter((p) => p.id !== id);
};

const handleView = (prof: any) => {
    // extra behavior if you want
};
</script>

<style scoped>
.layout-container {
    display: flex;
    min-height: 90vh;
}

/* Left sidebar */
.layout-navbar {
    flex-shrink: 0;
}

/* Right side (header + content) */
.layout-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

/* Top header */
.layout-header {
    flex-shrink: 0;
    border-bottom: 1px solid #e0e0e0;
}

/* Body area under header */
.layout-body {
    flex-grow: 1;
}

/* Consistent spacing for the table, regardless of navbar width */
.prof-page-container {
    /* Left/right padding from the navbar & window edge */
    padding: 20px 24px;

    /* ❌ remove centering & max-width */
    max-width: none;
    margin: 0;
}
</style>
