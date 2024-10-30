<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup) // extend yup
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import apiClient from '@/services/axios'
import { useToast } from 'primevue/usetoast'

const isLoading = ref(false)
const municipalityOptions = ref(null)
const userRoleOptions = ref(null)

const toast = useToast()

// Validation schema
const schema = yup.object({
  firstName: yup.string().required('Vorname ist erforderlich').label('Vorname'),
  lastName: yup.string().required('Nachname ist erforderlich').label('Nachname'),
  role: yup.string().required('BenutzerRolle ist erforderlich').label('Benutzerrolle'),
  municipalityId: yup.number().required('Gemeinde ist erforderlich').label('Gemeinde'),
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail'),
  password: yup
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .minLowercase(1, 'Passwort muss mindestens 1 Kleinbuchstaben enthalten')
    .minUppercase(1, 'Passwort muss mindestens 1 Großbuchstaben enthalten')
    .minNumbers(1, 'Passwort muss mindestens 1 Zahl enthalten')
    .minSymbols(1, 'Passwort muss mindestens 1 Sonderzeichen enthalten')
    .required('Passwort ist erforderlich')
    .label('Passwort'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwörter müssen übereinstimmen')
    .required('Passwortwiederholung ist erforderlich')
    .label('Passwort wiederholen')
})

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

<template>
  <div>
    <BaseCard class="block mx-auto my-7 max-w-md">
      <h4 class="text-xl font-bold dark:text-white">Registrieren</h4>
      <BaseSpinner v-if="isLoading" />
      <form v-else @submit.prevent="onSubmit" class="mt-10">
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
            :class="{ 'p-invalid': errors.municipalityId }"
            aria-describedby="municipalityId-help"
            placeholder="Gemeinde auswählen"
          />
          <small v-if="errors.municipalityId" id="municipalityId-help" class="p-error">{{
            errors.municipalityId
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
        <div class="field mt-4">
          <label for="password">Passwort</label>
          <Password
            id="password"
            class="w-full"
            inputClass="w-full"
            v-model="password"
            promptLabel="Mindestanforderungen:"
            toggleMask
            :class="{ 'p-invalid': errors.password }"
            aria-describedby="password-help"
          >
            <template #header>
              <h5 class="text-lg font-bold">Passwortstärke</h5>
            </template>
            <template #footer>
              <Divider />
              <ul class="pl-2 ml-2 my-0 leading-normal list-disc">
                <li>Min. ein Kleinbuchstaben</li>
                <li>Min. ein Großbuchstaben</li>
                <li>Min eine Zahl</li>
                <li>Min. ein Sonderzeichen</li>
                <li>Min. eine Länge von 8 Zeichen</li>
              </ul>
            </template>
          </Password>

          <small v-if="errors.password" id="password-help" class="p-error">{{
            errors.password
          }}</small>
        </div>
        <div class="field mt-4">
          <label for="confirmPassword">Passwort wiederholen</label>
          <Password
            id="confirmPassword"
            class="w-full"
            inputClass="w-full"
            v-model="confirmPassword"
            toggleMask
            :feedback="false"
            :class="{ 'p-invalid': errors.confirmPassword }"
            aria-describedby="confirmPassword-help"
          />

          <small v-if="errors.confirmPassword" id="confirmPassword-help" class="p-error">{{
            errors.confirmPassword
          }}</small>
        </div>
        <BaseButton type="submit" class="w-full mt-5">Registrieren</BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

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
