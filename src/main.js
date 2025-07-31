import '@/assets/main.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { localeDe } from './utils/translation'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import BaseAlert from './components/BaseAlert.vue'
import BaseCard from './components/BaseCard.vue'
import BaseButton from './components/BaseButton.vue'
import BaseModal from './components/BaseModal.vue'
import BaseSpinner from './components/BaseSpinner.vue'
import BaseHeading from './components/BaseHeading.vue'
import BaseSubheading from './components/BaseSubheading.vue'
import ToastService from 'primevue/toastservice'
import { setupToast } from '@/services/toast'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)

app.directive('tooltip', Tooltip)

app.component('BaseAlert', BaseAlert)
app.component('BaseCard', BaseCard)
app.component('BaseButton', BaseButton)
app.component('BaseModal', BaseModal)
app.component('BaseSpinner', BaseSpinner)
app.component('BaseHeading', BaseHeading)
app.component('BaseSubheading', BaseSubheading)

app.use(createPinia())
app.use(ToastService)
setupToast(app, app.config.globalProperties.$toast)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none'
    }
  },
  locale: localeDe
})

app.mount('#app')
