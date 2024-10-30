<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const isLoading = ref(false)

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail'),
  password: yup
    .string()
    .required('Passwort ist erforderlich')
    .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
    .label('Passwort')
})

// Form setup
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema
})

const [email] = defineField('email')
const [password] = defineField('password')

const route = useRoute()

const sessionExpired = computed(() => {
  if (route.query.redirect === 'sessionExpired') {
    return true
  }
  return false
})

const { login } = useAuthStore()

const loginFailed = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await login(values)
    loginFailed.value = false
    isLoading.value = false
  } catch (error) {
    loginFailed.value = true
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <BaseAlert
      v-if="sessionExpired"
      type="warning"
      title="Sitzung ist abgelaufen!"
      message="Ihr Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
    ></BaseAlert>
    <BaseAlert
      v-if="loginFailed"
      type="warning"
      title="Anmeldung fehlgeschlagen!"
      message="E-Mail oder Passwort falsch. Überprüfen Sie Ihre Angaben."
    ></BaseAlert>
    <BaseCard class="block mx-auto my-7 max-w-md">
      <h4 class="text-xl font-bold dark:text-white">Anmelden</h4>
      <BaseSpinner v-if="isLoading" />
      <form v-else @submit.prevent="onSubmit" class="mt-10">
        <div class="field">
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
            toggleMask
            :feedback="false"
            :class="{ 'p-invalid': errors.password }"
            aria-describedby="password-help"
          />
          <small v-if="errors.password" id="password-help" class="p-error">{{
            errors.password
          }}</small>
        </div>
        <div class="flex gap-4 mt-5">
          <BaseButton outline class="w-full" tag="RouterLink" to="/register">
            Registrieren
          </BaseButton>
          <BaseButton type="submit" class="w-full">Anmelden</BaseButton>
        </div>
      </form>
      <RouterLink class="hover:underline" to="/forgot-password">Passwort vergessen?</RouterLink>
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
