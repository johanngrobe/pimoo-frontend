<template>
  <div class="max-w-6xl">
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      Neuer Mobilitätscheck
    </h1>
    <Toast position="top-center" />
    <MobilityForm />

    <!-- {{ mobilityStore.mobilityObjectiveForm }} -->
  </div>
</template>

<script setup>
import MobilityForm from '@/components/form/MobilityForm.vue'
import Toast from 'primevue/toast'
// import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'

// const mobilityStore = useMobilitySubmissionStore()
</script>

<style></style>
