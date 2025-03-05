<template>
  <div class="max-w-6xl">
    <div class="flex">
      <h1
        class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        Neuer Mobilitätscheck
      </h1>
      <div class="text-right ms-auto mt-3">
        <ButtonZuruecksetzen @click="refreshPage()" />
      </div>
    </div>
    <Toast position="top-center" />
    <MobilityForm />
  </div>
</template>

<script setup>
import MobilityForm from '@/components/form/MobilityForm.vue'
import Toast from 'primevue/toast'
import ButtonZuruecksetzen from '@/components/ui/ButtonZuruecksetzen.vue'
import { useRouter } from 'vue-router'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'

const mobilityStore = useMobilitySubmissionStore()

mobilityStore.$reset()

const router = useRouter()

const refreshPage = () => {
  router.go() // Reloads the current route
}
</script>

<style></style>
