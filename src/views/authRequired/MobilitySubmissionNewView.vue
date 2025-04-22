<template>
  <div class="max-w-6xl">
    <div class="grid grid-cols-2 w-full items-center">
      <BaseHeading>Neuer Mobilitäscheck</BaseHeading>
      <div class="flex w-full justify-end">
        <ButtonZuruecksetzen @click="refreshPage()">zurücksetzen</ButtonZuruecksetzen>
      </div>
    </div>
    <MobilitySubmissionForm :editMode="false" />
  </div>
</template>

<script setup>
import MobilitySubmissionForm from '@/components/form/MobilitySubmissionForm.vue'
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
