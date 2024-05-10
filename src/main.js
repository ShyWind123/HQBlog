import { createApp } from 'vue'
import '@/style/style.css'
import 'animate.css';

import App from '@/App.vue'
import router from '@/router/router';
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTreeview } from 'vuetify/labs/VTreeview'

const vuetify = createVuetify({
  components: {
    VTreeview,
  },
  directives,
})

// Pinia  
import { createPinia } from 'pinia';
const pinia = createPinia()

createApp(App).use(router).use(vuetify).use(pinia).mount('#app')
