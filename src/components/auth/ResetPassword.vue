<script setup>
import { defineProps, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup) // extend yup
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  changePassword: {
    type: Boolean,
    default: false
  }
})

const label = computed(() => (props.changePassword ? 'Passwort ändern' : 'Passwort zurücksetzen'))

// Validation schema
const schema = yup.object({
  password: yup
    .string()
    .min(12, 'Passwort muss mindestens 12 Zeichen lang sein')
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

const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')

const router = useRouter()
const { updateUser } = useAuthStore()

const toast = useToast()

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateUser({ password: values.password })
    toast.add({
      severity: 'success',
      summary: 'Passwort erfolgreich geändert',
      life: 3000
    })
    if (!props.changePassword) {
      router.replace('/')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Ändern des Passworts',
      life: 3000
    })
  }
})
</script>

<template>
  <div>
    <BaseCard class="block my-7 max-w-md">
      <h4 class="text-xl font-bold dark:text-white">{{ label }}</h4>
      <form @submit.prevent="onSubmit" class="mt-10">
        <div class="field">
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
                <li>Min. eine Länge von 12 Zeichen</li>
              </ul>
            </template>
          </Password>

          <small v-if="errors.password" id="password-help" class="p-error">{{
            errors.password
          }}</small>
        </div>
        <div class="field mt-5">
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
        <div class="flex gap-4 mt-5">
          <BaseButton type="submit" class="w-full">{{ label }}</BaseButton>
        </div>
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
