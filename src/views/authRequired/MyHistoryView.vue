<template>
  <div>
    <BaseHeading>Meine Datenbank</BaseHeading>

    <BaseTabs :tabs="tabs">
      <template #mobility-check>
        <MobilitySubmissionList :filter="setFilter()" />
      </template>

      <template #climate-check>
        <ClimateSubmissionList :filter="setFilter()" />
      </template>
    </BaseTabs>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import MobilitySubmissionList from '@/components/history/MobilitySubmissionList.vue'
import ClimateSubmissionList from '@/components/history/ClimateSubmissionList.vue'

const authStore = useAuthStore()

const setFilter = () => {
  let filter = {}

  switch (authStore.userRole) {
    case 'administration':
      filter.userRole = true
      break
    case 'politician':
      filter.userId = true
      break
  }
  return filter
}

const tabs = [
  { name: 'mobility-check', label: 'Mobilitätscheck', disabled: false },
  { name: 'climate-check', label: 'Klimacheck', disabled: false }
]
</script>

<style></style>
