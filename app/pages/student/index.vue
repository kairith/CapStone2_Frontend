<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container>
       
        <!-- Add your student page content here -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '~/components/ui/Navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>

<style scoped>
.v-main {
  padding: 20px;
}
</style>