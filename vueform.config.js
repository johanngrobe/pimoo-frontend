// vueform.config.(js|ts)

import de from '@vueform/vueform/locales/de'
import bootstrap from '@vueform/vueform/dist/bootstrap'
import { defineConfig } from '@vueform/vueform'

export default defineConfig({
  theme: bootstrap,
  locales: { de },
  locale: 'de'
})
