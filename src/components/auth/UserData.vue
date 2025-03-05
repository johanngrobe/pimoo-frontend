<template>
  <BaseCard class="block my-5 mx-auto max-w-md">
    <h4 class="text-xl font-bold dark:text-white mb-4">Benutzerangaben</h4>
    <BaseSpinner v-if="isLoading" />
    <form v-else @submit.prevent="onSubmit" class="grid grid-cols-1 gap-y-4">
      <div class="field">
        <FloatLabel variant="on">
          <InputText
            id="firstName"
            v-model="firstName"
            class="w-full"
            :invalid="!!errors.firstName"
            aria-describedby="firstName-help"
          />
          <label for="firstName">Vorname</label>
        </FloatLabel>
        <small v-if="errors.firstName" id="firstName-help" class="p-error block">{{
          errors.firstName
        }}</small>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <InputText
            id="lastName"
            v-model="lastName"
            class="w-full"
            :invalid="!!errors.lastName"
            aria-describedby="lastName-help"
          />
          <label for="lastName">Nachname</label>
        </FloatLabel>
        <small v-if="errors.lastName" id="lastName-help" class="p-error block">{{
          errors.lastName
        }}</small>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <Dropdown
            id="municipality"
            v-model="municipalityId"
            :options="municipalityOptions"
            optionLabel="name"
            optionValue="id"
            class="w-full"
            :invalid="!!errors.municipality"
            aria-describedby="municipality-help"
            placeholder="Gemeinde auswählen"
            disabled
          />
          <label for="municipality">Gemeinde</label>
        </FloatLabel>
        <small v-if="errors.municipality" id="municipality-help" class="p-error block">{{
          errors.municipality
        }}</small>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <Dropdown
            id="role"
            v-model="role"
            :options="userRoleOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            :invalid="!!errors.role"
            aria-describedby="role-help"
            placeholder="Benutzerrolle auswählen"
            disabled
          />
          <label for="role">Benutzerrolle</label>
        </FloatLabel>
        <small v-if="errors.role" id="role-help" class="p-error block">{{ errors.role }}</small>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <InputText
            id="email"
            v-model="email"
            class="w-full"
            :invalid="!!errors.email"
            aria-describedby="email-help"
          />
          <label for="email">E-Mail</label>
        </FloatLabel>
        <small v-if="errors.email" id="email-help" class="p-error block">{{ errors.email }}</small>
      </div>
      <div class="flex gap-4">
        <BaseButton type="submit" class="w-full">Speichern</BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useToast } from 'primevue/usetoast'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import apiClient from '@/services/axios'
import BaseSpinner from '../ui/BaseSpinner.vue'

const municipalityOptions = ref(null)
const userRoleOptions = ref(null)

const schema = yup.object({
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail'),
  firstName: yup.string().required('Vorname ist erforderlich').label('Vorname'),
  lastName: yup.string().required('Nachname ist erforderlich').label('Nachname'),
  municipalityId: yup.number().required('Gemeinde ist erforderlich').label('Gemeinde'),
  role: yup.string().required('Rolle ist erforderlich').label('Rolle')
})

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema
})

const [email] = defineField('email')
const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [municipalityId] = defineField('municipalityId')
const [role] = defineField('role')

const authStore = useAuthStore()

const setUserValues = async () => {
  const user = await authStore.getUser()
  console.log(user)

  setFieldValue('email', user.email)
  setFieldValue('firstName', user.firstName)
  setFieldValue('lastName', user.lastName)
  setFieldValue('municipalityId', user.municipalityId)
  setFieldValue('role', user.role)
}

const fetchMunicipalityOptions = async () => {
  try {
    const response = await apiClient.get('/option/municipality')
    municipalityOptions.value = response.data
  } catch (error) {
    municipalityOptions.value = []
  }
}

const fetchUserRoleOptions = async () => {
  try {
    const response = await apiClient.get('/option/user-role')
    userRoleOptions.value = response.data
  } catch (error) {
    userRoleOptions.value = []
  }
}
onMounted(() => {
  fetchMunicipalityOptions()
  fetchUserRoleOptions()
  setUserValues()
})

const toast = useToast()

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.updateUser(values)
    toast.add({
      severity: 'success',
      summary: 'Profil erfolgreich aktualisiert',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Aktualisieren des Profils',
      life: 3000
    })
  }
})
</script>

<style></style>
