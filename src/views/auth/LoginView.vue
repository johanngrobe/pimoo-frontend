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
      <h4 class="text-xl font-bold dark:text-white mb-4">Anmelden</h4>
      <BaseSpinner v-if="isLoading" />
      <form v-else @submit.prevent="onSubmit" class="grid grid-cols-1 gap-y-4">
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
              toggleMask
              :feedback="false"
              :invalid="!!errors.password"
              aria-describedby="password-help"
            />
            <label for="password">Passwort</label>
          </FloatLabel>
          <small v-if="errors.password" id="password-help" class="p-error block">{{
            errors.password
          }}</small>
        </div>
        <div class="flex gap-4">
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

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/login'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'

const isLoading = ref(false)

// Validation schema

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
