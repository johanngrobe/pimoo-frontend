<template>
  <div>
    <h1>Meine Datenbank</h1>

    <BaseTabs :tabs="tabs">
      <template #mobility-check>
        <MyMobilitySubmissionHistory />
      </template>

      <template #climate-check>
        <MyClimateSubmissionHistory />
      </template>
    </BaseTabs>
  </div>
</template>

<script setup>
import BaseTabs from '@/components/ui/BaseTabs.vue'
import MyMobilitySubmissionHistory from '@/components/history/MyMobilitySubmissionHistory.vue'
import MyClimateSubmissionHistory from '@/components/history/MyClimateSubmissionHistory.vue'

const tabs = [
  { name: 'mobility-check', label: 'Mobilitätscheck', disabled: false },
  { name: 'climate-check', label: 'Klimacheck', disabled: false }
]
</script>

<style></style>
