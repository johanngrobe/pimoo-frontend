<template>
  <BaseCard class="block my-5 mx-auto max-w-md">
    <BaseSpinner v-if="isLoading" />
    <form v-else @submit.prevent="onSubmit" class="">
      <div class="field">
        <label for="firstName">Vorname</label>
        <InputText
          id="firstName"
          v-model="firstName"
          class="w-full"
          :class="{ 'p-invalid': errors.firstName }"
          aria-describedby="firstName-help"
        />

        <small v-if="errors.firstName" id="firstName-help" class="p-error">{{
          errors.firstName
        }}</small>
      </div>
      <div class="field mt-4">
        <label for="lastName">Nachname</label>
        <InputText
          id="lastName"
          v-model="lastName"
          class="w-full"
          :class="{ 'p-invalid': errors.lastName }"
          aria-describedby="lastName-help"
        />
        <small v-if="errors.lastName" id="lastName-help" class="p-error">{{
          errors.lastName
        }}</small>
      </div>
      <div class="field mt-4">
        <label for="municipality">Gemeinde</label>
        <Dropdown
          id="municipality"
          v-model="municipalityId"
          :options="municipalityOptions"
          optionLabel="name"
          optionValue="id"
          class="w-full"
          :class="{ 'p-invalid': errors.municipality }"
          aria-describedby="municipality-help"
          placeholder="Gemeinde auswählen"
          disabled
        />
        <small v-if="errors.municipality" id="municipality-help" class="p-error">{{
          errors.municipality
        }}</small>
      </div>
      <div class="field mt-4">
        <label for="role">Benutzerrolle</label>
        <Dropdown
          id="role"
          v-model="role"
          :options="userRoleOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          :class="{ 'p-invalid': errors.role }"
          aria-describedby="role-help"
          placeholder="Benutzerrolle auswählen"
          disabled
        />
        <small v-if="errors.role" id="role-help" class="p-error">{{ errors.role }}</small>
      </div>
      <div class="field mt-4">
        <label for="email">E-Mail</label>
        <InputText
          id="email"
          v-model="email"
          class="w-full"
          :class="{ 'p-invalid': errors.email }"
          aria-describedby="email-help"
        />
        <small v-if="errors.email" id="email-help" class="p-error">{{ errors.email }}</small>
      </div>
      <div class="flex gap-4 mt-5">
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
