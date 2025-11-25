import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#1867C0",
            secondary: "#5CBBF6",
          },
        },
      },
    },
    defaults: {
      global: {
        style: {
          fontFamily: "'Source Sans Pro', sans-serif",
        },
      },
      VBtn: {
        style: {
          fontFamily: "'Source Sans Pro', sans-serif",
          fontSize: "16px",
          textTransform: "none",
        },
      },
      VCard: {
        style: {
          fontFamily: "'Source Sans Pro', sans-serif",
        },
      },
      VTextField: {
        style: {
          fontFamily: "'Source Sans Pro', sans-serif",
          fontSize: "16px",
        },
      },
      VSelect: {
        style: {
          fontFamily: "'Source Sans Pro', sans-serif",
          fontSize: "16px",
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
