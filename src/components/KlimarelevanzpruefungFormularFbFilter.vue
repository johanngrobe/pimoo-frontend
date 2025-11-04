<template>
  <div>
    <BaseSubheading>Auswahlfragen</BaseSubheading>
    <form @submit.prevent="onSubmit" class="mt-4">
      <div class="mb-4">
        <FloatLabel variant="on">
          <InputText
            id="name"
            v-model="name"
            aria-describedby="name-help"
            :invalid="!!errors.name"
            class="w-full"
            inputClass="w-full"
          />
          <label for="name">Name der Klimarelevanzprüfung</label>
        </FloatLabel>
        <small v-if="errors.name" id="name-help" class="p-error block">{{ errors.name }}</small>
      </div>
      <ol class="grid grid-cols-[11fr_1fr] gap-2 items-center list-outside list-decimal">
        <li @click="fb1 = !fb1">
          Es handelt sich um eine <strong>physische Maßnahme oder eine Beschaffung </strong> oder um
          die <strong>konkrete Planung/Konzept derer</strong>.<br />
          <small
            >(z.B. Begrünung, Abriss, Umbau, Installation, Anschaffung von Maschinen, Abholzungen /
            Fällungen, Flächennutzungsänderungen, Baumaßnahmen etc.)</small
          >
        </li>
        <ToggleSwitch v-model="fb1" :disbaled="disableFb1to4" :invalied="!!errors.fb1" />
        <Divider class="col-span-2" />
        <li @click="fb2 = !fb2">
          Es handelt sich um eine Planung / ein Konzept , das<strong>
            indirekt physische Maßnahmen nach sich zieht.</strong
          ><br /><small> (z.B. Bebauungsplan)</small>
        </li>
        <ToggleSwitch v-model="fb2" :disbaled="disableFb1to4" :invalied="!!errors.fb2" />

        <Divider class="col-span-2" />
        <li @click="fb3 = !fb3">
          Es handelt sich um eine Planung, ein Konzept, oder ein Vorhaben, die
          <strong
            >das Verhalten der Bevölkerung oder der kommunalen Mitarbeitenden in Bezug auf
            Klimaaspekte beeinflusst.</strong
          ><br />
          <small> (z.B. Klima-Bildungskampagne, Mobilitätsverhalten)</small>
        </li>
        <ToggleSwitch v-model="fb3" :disbaled="disableFb1to4" :invalied="!!errors.fb3" />

        <Divider class="col-span-2" />
        <li @click="fb4 = !fb4">
          Es handelt sich um ein Vorhaben, das
          <strong>nicht in eine der bisherigen Kategorien passt</strong>, aber dennoch klimawirksam
          ist.<br />
          <small>(z.B. Reisen)</small>
        </li>
        <ToggleSwitch v-model="fb4" :disbaled="disableFb1to4" :invalied="!!errors.fb4" />

        <Divider class="col-span-2" />
        <li @click="fb5 = !fb5">
          Es handelt sich um eine Maßnahme, die <strong>in keiner Weise klimawirksam</strong> ist.
          <br />
          <small>
            (z.B. Personaleinstellung, Mitgliedschaft außerhalb von Klimaschutz- /Klimaanpassung,
            Beantwortung von Anfragen, Wahlen etc.)</small
          >
        </li>
        <ToggleSwitch v-model="fb5" :disabled="disableFb5" :invalied="!!errors.fb5" />
        <small v-if="errors.fb5" id="fb5-help" class="p-error col-span-2">{{ errors.fb5 }}</small>
      </ol>
      <div class="flex justify-end items-center mt-8">
        <Button icon="pi pi-angle-right" label="weiter" type="submit" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/klimarelevanzpruefungFbFilter'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import ToggleSwitch from 'primevue/toggleswitch'
import Divider from 'primevue/divider'

const { defineField, handleSubmit, setValues, errors } = useForm({
  validationSchema: schema
})

const [name] = defineField('name')
const [fb1] = defineField('fb1')
const [fb2] = defineField('fb2')
const [fb3] = defineField('fb3')
const [fb4] = defineField('fb4')
const [fb5] = defineField('fb5')

setValues({
  fb1: false,
  fb2: false,
  fb3: false,
  fb4: false,
  fb5: false
})

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

const emit = defineEmits(['submit'])

const onSubmit = handleSubmit((values) => {
  console.log('Form Values:', values)
  emit('submit', values)
})
</script>

<style scoped>
.p-invalid {
  @apply border-red-600 text-red-600;
}

.p-error {
  @apply text-red-600;
}
</style>
