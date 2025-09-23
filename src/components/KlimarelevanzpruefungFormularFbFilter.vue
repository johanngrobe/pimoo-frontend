<template>
  <div>
    <BaseSubheading>Auswahlfragen</BaseSubheading>
    <form @submit.prevent="onSubmit" class="mt-4">
      <ol class="grid grid-cols-[11fr_1fr] gap-x-2 gap-y-6 items-center list-outside list-decimal">
        <li>
          Es handelt sich um eine <strong>physische Maßnahme oder eine Beschaffung </strong> oder um
          die <strong>konkrete Planung/Konzept derer</strong>.<br />
          <small
            >(z.B. Begrünung, Abriss, Umbau, Installation, Anschaffung von Maschinen, Abholzungen /
            Fällungen, Flächennutzungsänderungen, Baumaßnahmen etc.)</small
          >
        </li>
        <ToggleSwitch v-model="fb1" :disbaled="disableFb1to4" />
        <li>
          Es handelt sich um eine Planung / ein Konzept , das<strong>
            indirekt physische Maßnahmen nach sich zieht.</strong
          ><br /><small> (z.B. Bebauungsplan)</small>
        </li>
        <ToggleSwitch v-model="fb2" :disbaled="disableFb1to4" />
        <li>
          Es handelt sich um eine Planung, ein Konzept, oder ein Vorhaben, die
          <strong
            >das Verhalten der Bevölkerung oder der kommunalen Mitarbeitenden in Bezug auf
            Klimaaspekte beeinflusst.</strong
          ><br />
          <small> (z.B. Klima-Bildungskampagne, Mobilitätsverhalten)</small>
        </li>
        <ToggleSwitch v-model="fb3" :disbaled="disableFb1to4" />
        <li>
          Es handelt sich um ein Vorhaben, das
          <strong>nicht in eine der bisherigen Kategorien passt</strong>, aber dennoch klimawirksam
          ist.<br />
          <small>(z.B. Reisen)</small>
        </li>
        <ToggleSwitch v-model="fb4" :disbaled="disableFb1to4" />
        <li>
          Es handelt sich um eine Maßnahme, die <strong>in keiner Weise klimawirksam</strong> ist.
          <br />
          <small>
            (z.B. Personaleinstellung, Mitgliedschaft außerhalb von Klimaschutz- /Klimaanpassung,
            Beantwortung von Anfragen, Wahlen etc.)</small
          >
        </li>
        <ToggleSwitch v-model="fb5" :disabled="disableFb5" />
      </ol>
      <div class="flex justify-end items-center mt-8">
        <ButtonSpeichern type="submit" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/indikator.js'
import ToggleSwitch from 'primevue/toggleswitch'
import ButtonSpeichern from '@/components/ButtonSpeichern.vue'

const { defineField, handleSubmit, setValues } = useForm({
  validationSchema: schema
})

const [fb1] = defineField('fb1')
const [fb2] = defineField('fb2')
const [fb3] = defineField('fb3')
const [fb4] = defineField('fb4')
const [fb5] = defineField('fb5')

const disableFb1to4 = computed(() => fb5.value === true)

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
const disableFb5 = computed(
  () => fb1.value === true || fb2.value === true || fb3.value === true || fb4.value === true
)

watch([fb1, fb2, fb3, fb4], ([val1, val2, val3, val4]) => {
  if (val1 || val2 || val3 || val4) {
    setValues({
      fb5: false
    })
  }
})

const onSubmit = handleSubmit((values) => {
  console.log('Form Values:', values)
})
</script>

<style></style>
