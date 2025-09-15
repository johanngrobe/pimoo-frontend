<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-2 items-center">
      <p>
        Es handelt sich um eine physische Maßnahme oder eine Beschaffung (z.B. Begrünung, Abriss,
        Umbau, Installation, Anschaffung von Maschinen, Abholzungen / Fällungen,
        Flächennutzungsänderungen, Baumaßnahmen etc.) oder um die konkrete Planung/Konzept derer.
      </p>
      <ToggleSwitch v-model="fb1" />
      <p>
        Es handelt sich um eine Planung / ein Konzept , das indirekt physische Maßnahmen nach sich
        zieht (z.B. Bebauungsplan).
      </p>
      <ToggleSwitch v-model="fb2" />
      <p>
        Es handelt sich um eine Planung, ein Konzept, oder ein Vorhaben das das Verhalten der
        Bevölkerung oder der kommunalen Mitarbeitenden in Bezug auf Klimaaspekte beeinflusst (z.B.
        Klima-Bildungskampagne, Mobilitätsverhalten).
      </p>
      <ToggleSwitch v-model="fb3" />
      <p>
        Es handelt sich um ein Vorhaben, das nicht in eine der bisherigen Kategorien passt, aber
        dennoch klimawirksam ist. (Z.B. Reisen)
      </p>
      <ToggleSwitch v-model="fb4" />
      <p>
        Es handelt sich um eine Maßnahme, die in keiner Weise klimawirksam ist (z.B.
        Personaleinstellung, Mitgliedschaft außerhalb von Klimaschutz- /Klimaanpassung, Beantwortung
        von Anfragen, Wahlen etc.)
      </p>
      <ToggleSwitch v-model="fb5" :disabled="disableFb5" />
      <div class="flex justify-end items-center">
        <ButtonSpeichern type="submit" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/indikator.js'
import ToggleSwitch from 'primevue/toggleswitch'
import ButtonSpeichern from '@/components/ButtonSpeichern.vue'

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: schema
})

const [fb1] = defineField('fb1')
const [fb2] = defineField('fb2')
const [fb3] = defineField('fb3')
const [fb4] = defineField('fb4')
const [fb5] = defineField('fb5')

const disable1to4 = computed(() => fb5.value === true)

watch(fb5, (newVal) => {
  if (newVal === true) {
    setValues({
      fb1: false,
      fb2: false,
      fb3: false,
      fb4: false
    })
  }
})
const disable5 = computed(
  () => fb1.value === true || fb2.value === true || fb3.value === true || fb4.value === true
)

watch([fb1, fb2, fb3, fb4], ([val1, val2, val3, val4]) => {
  if (val1 || val2 || val3 || val4) {
    setValues({
      fb5: false
    })
  }
})
</script>

<style></style>
