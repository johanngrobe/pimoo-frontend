<template>
  <div>
    <BaseCard class="grid grid-cols-1 block mx-auto my-5 max-w-md gap-y-4">
      <h4 class="text-xl font-bold dark:text-white mb-5">Registrieren</h4>
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
              :invalid="!!errors.municipalityId"
              aria-describedby="municipalityId-help"
            />
            <label for="municipality">Gemeinde</label>
          </FloatLabel>
          <small v-if="errors.municipalityId" id="municipalityId-help" class="p-error block">{{
            errors.municipalityId
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
          <small v-if="errors.email" id="email-help" class="p-error block">{{
            errors.email
          }}</small>
        </div>

        <div class="field">
          <FloatLabel variant="on">
            <Password
              id="password"
              class="w-full"
              inputClass="w-full"
              v-model="password"
              promptLabel="Mindestanforderungen:"
              toggleMask
              :invalid="!!errors.password"
              aria-describedby="password-help"
            >
              <template #header>
                <h5 class="text-lg font-bold">Passwortstärke</h5>
              </template>
              <template #footer>
                <Divider />
                <ul class="pl-2 ml-2 my-0 leading-normal list-disc">
                  <li>Mindestens einen Kleinbuchstaben</li>
                  <li>Mindestens einen Großbuchstaben</li>
                  <li>Mindestens eine Ziffer</li>
                  <li>Mindestens ein Sonderzeichen</li>
                  <li>Mindestens 8 Zeichen</li>
                </ul>
              </template>
            </Password>
            <label for="password">Passwort</label>
          </FloatLabel>
          <small v-if="errors.password" id="password-help" class="p-error block">{{
            errors.password
          }}</small>
        </div>

        <div class="field">
          <FloatLabel variant="on">
            <Password
              id="confirmPassword"
              class="w-full"
              inputClass="w-full"
              v-model="confirmPassword"
              toggleMask
              :feedback="false"
              :invalid="!!errors.confirmPassword"
              aria-describedby="confirmPassword-help"
            />
            <label for="confirmPassword">Passwort wiederholen</label>
          </FloatLabel>
          <small v-if="errors.confirmPassword" id="confirmPassword-help" class="p-error block">{{
            errors.confirmPassword
          }}</small>
        </div>

        <BaseButton type="submit" class="w-full">Registrieren</BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/register'

import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import apiClient from '@/services/axios'
import { useToast } from 'primevue/usetoast'

const isLoading = ref(false)
const municipalityOptions = ref(null)
const userRoleOptions = ref(null)

const toast = useToast()

// Validation schema

// Form setup
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [role] = defineField('role')
const [municipalityId] = defineField('municipalityId')
const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')

const router = useRouter()
const { register } = useAuthStore()

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
})

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await register(values)
    router.replace({ name: 'verify-account', query: { verify: 'check-mail' } })
  } catch (error) {
    console.log(error)
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'Registrierung fehlgeschlagen',
      life: 3000
    })
  }
  isLoading.value = false
})
</script>

<style scoped>
.p-button {
  text-decoration: none;
}

.p-invalid {
  @apply border-red-600;
}

.p-error {
  @apply text-red-600;
}
</style>
