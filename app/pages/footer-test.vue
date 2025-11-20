<template>
    <v-app>

        <v-footer app class="footer-component">
            <v-container>
                <v-row>
                    <!-- Column 1: About -->
                    <v-col cols="12" md="3">
                        <h3 class="footer-title">About Us</h3>
                        <p class="footer-text">
                            We are committed to providing the best attendance management system for educational
                            institutions.
                        </p>
                    </v-col>

                    <!-- Column 2: Quick Links -->
                    <v-col cols="12" md="3">
                        <h3 class="footer-title">Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="/">Attendance Platform</a></li>
                            <li><a href="/about">Admin Dashboard</a></li>
                            <li><a href="/services">Lecturer Login</a></li>
                            <li><a href="/contact">Mobile App (PWA)</a></li>
                        </ul>
                    </v-col>

                    <!-- Column 3: Resources -->
                    <v-col cols="12" md="3">
                        <h3 class="footer-title">Resources</h3>
                        <ul class="footer-links">
                            <li><a href="/help">Help Center</a></li>
                            <li><a href="/docs">Documentation</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                        </ul>
                    </v-col>

                    <!-- Column 4: Contact -->
                    <v-col cols="12" md="3">
                        <h3 class="footer-title">Contact Info</h3>
                        <div class="footer-contact">
                            <p><v-icon size="small">mdi-email</v-icon> info@example.com</p>
                            <p><v-icon size="small">mdi-phone</v-icon> +855 12 345 678</p>
                            <p><v-icon size="small">mdi-map-marker</v-icon> Phnom Penh, Cambodia</p>
                        </div>
                        <div class="social-icons mt-3">
                            <v-icon>mdi-facebook</v-icon>
                            <v-icon>mdi-twitter</v-icon>
                            <v-icon>mdi-instagram</v-icon>
                            <v-icon>mdi-youtube</v-icon>
                        </div>
                    </v-col>
                </v-row>

                <!-- Bottom Copyright -->
                <v-divider class="my-4"></v-divider>
                <v-row>
                    <v-col cols="12">
                        <p class="text-center mb-0">&copy; 2024 My Application. All rights reserved.</p>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </v-app>
</template>

<script setup>
definePageMeta({
    layout: false
})
</script>

<style scoped>
.footer-component {
    background-color: #2c3e50;
    padding: 3rem 0 1rem;
    color: #ecf0f1;
}

.footer-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 1rem;
}

.footer-text {
    color: #bdc3c7;
    font-size: 14px;
    line-height: 1.6;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li {
    margin-bottom: 0.5rem;
}

.footer-links a {
    color: #bdc3c7;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: #3498db;
}

.footer-contact p {
    color: #bdc3c7;
    font-size: 14px;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.social-icons {
    display: flex;
    gap: 1rem;
}

.social-icons .v-icon {
    color: #bdc3c7;
    cursor: pointer;
    transition: color 0.3s;
}

.social-icons .v-icon:hover {
    color: #3498db;
}

.v-divider {
    background-color: #34495e;
}
</style>