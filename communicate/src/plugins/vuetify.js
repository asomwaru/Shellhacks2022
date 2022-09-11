// Styles
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  },
    theme: {
        dark: true,
        options: {
            customProperties: true,
            variations: true,
        },
    },
});

export default vuetify;
