<template>
  <div>
    <h1>Datenbank</h1>

    <BaseTabs :tabs="tabs">
      <template #mobility-check>
        <MobilitySubmissionHistory />
      </template>

      <template #climate-check>
        <ClimateSubmissionHistory />
      </template>
    </BaseTabs>
  </div>
</template>

<script setup>
import BaseTabs from '@/components/ui/BaseTabs.vue'
import MobilitySubmissionHistory from '@/components/history/MobilitySubmissionHistory.vue'
import ClimateSubmissionHistory from '@/components/history/ClimateSubmissionHistory.vue'

const tabs = [
  { name: 'mobility-check', label: 'Mobilitätscheck', disabled: false },
  { name: 'climate-check', label: 'Klimacheck', disabled: false }
]
</script>

<style></style>
