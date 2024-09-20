<template>
  <BaseCard class="block my-5 max-w-md">
    <form @submit.prevent="onSubmit" class="">
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
          v-model="municipality"
          :options="municipalities"
          optionLabel="name"
          optionValue="id"
          class="w-full"
          :class="{ 'p-invalid': errors.municipality }"
          aria-describedby="municipality-help"
          placeholder="Gemeinde auswählen"
        />
        <small v-if="errors.municipality" id="municipality-help" class="p-error">{{
          errors.municipality
        }}</small>
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
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import municipalitiesJSON from '@/assets/municipalities.json'

const municipalities = municipalitiesJSON

const schema = yup.object({
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail'),
  firstName: yup.string().required('Vorname ist erforderlich').label('Vorname'),
  lastName: yup.string().required('Nachname ist erforderlich').label('Nachname'),
  municipality: yup.string().required('Gemeinde ist erforderlich').label('Gemeinde')
})

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema
})

const [email] = defineField('email')
const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [municipality] = defineField('municipality')

const authStore = useAuthStore()

setFieldValue('email', authStore.user.email)
setFieldValue('firstName', authStore.user.user_metadata.first_name)
setFieldValue('lastName', authStore.user.user_metadata.last_name)
setFieldValue('municipality', authStore.user.user_metadata.municipality)

const toast = useToast()

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.updateUser({
      email: values.email,
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        municipality: values.municipality
      }
    })
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
