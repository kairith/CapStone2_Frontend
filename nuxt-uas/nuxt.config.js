// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Disable TypeScript
  typescript: false,

  // Add Vuetify module
  modules: ["vuetify/nuxt"],

  // Vuetify configuration
  vuetify: {
    moduleOptions: {
      /* vuetify options */
      styles: { configFile: "assets/settings.scss" },
    },
    vuetifyOptions: {
      // Vuetify options
      theme: {
        defaultTheme: "light",
      },
    },
  },
});
