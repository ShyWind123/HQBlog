import { createApp } from 'vue'
import '@/style/style.css'
import 'animate.css';
import 'vditor/dist/index.css';

import App from '@/App.vue'
import router from '@/router/router';
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})

// Pinia  
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(vuetify).use(pinia).mount('#app')
