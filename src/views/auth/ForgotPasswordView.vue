<template>
  <BaseCard class="block mx-auto my-7 max-w-md">
    <h4 class="text-xl font-bold dark:text-white mb-5">Passwort vergessen?</h4>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="email">E-Mail</label>
        <InputText
          id="email"
          v-model="email"
          placeholder="vergessen@email.de"
          class="w-full"
          :class="{ 'p-invalid': errors.email }"
          aria-describedby="email-help"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>
      <div class="text-right mt-2">
        <BaseButton type="submit">Passwort zurücksetzen</BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useToast } from 'primevue/usetoast'

const { resetPassword } = useAuthStore()

const schema = yup.object({
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail')
})

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema
})

const [email] = defineField('email')

const router = useRouter()
const toast = useToast()

const onSubmit = handleSubmit(async (values) => {
  try {
    await resetPassword(values.email)
    router.replace({ name: 'home' })
    toast.add({
      severity: 'success',
      summary: 'Erfolg',
      detail: 'E-Mail zum Zurücksetzen des Passworts gesendet'
    })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'E-Mail nicht gefunden' })
  }
})
</script>

<style scoped>
.p-invalid {
  @apply border-red-600;
}

.p-error {
  @apply text-red-600;
}
</style>
