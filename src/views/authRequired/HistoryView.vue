<template>
  <h1>Verlauf</h1>

  <BaseTabs :tabs="tabs">
    <template #Mobilitätschecks>
      <MobilitySubmissionHistory />
    </template>

    <template #Klimachecks>
      <ClimateSubmissionHistory />
    </template>
  </BaseTabs>
</template>

<script setup>
import BaseTabs from '@/components/ui/BaseTabs.vue'
import MobilitySubmissionHistory from '@/components/history/MobilitySubmissionHistory.vue'
import ClimateSubmissionHistory from '@/components/history/ClimateSubmissionHistory.vue'

const tabs = [
  { name: 'Mobilitätschecks', disabled: false },
  { name: 'Klimachecks', disabled: false }
]
</script>

<style></style>
