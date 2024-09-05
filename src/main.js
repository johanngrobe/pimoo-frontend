import '@/assets/main.css'
// import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Lara from '@/services/primevue/presets/lara' //import preset
import BaseAlert from './components/ui/BaseAlert.vue'
import BaseCard from './components/ui/BaseCard.vue'
import BaseButton from './components/ui/BaseButton.vue'
import BaseModal from './components/ui/BaseModal.vue'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

const app = createApp(App)

app.component('BaseAlert', BaseAlert)
app.component('BaseCard', BaseCard)
app.component('BaseButton', BaseButton)
app.component('BaseModal', BaseModal)
app.component('PrimeToast', Toast)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara //apply preset
})

app.mount('#app')
