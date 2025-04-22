<template>
  <BaseTabs :tabs="tabs" :disableUrlAltering="props.disableUrlAltering">
    <template #general>
      <MobilitySubmissionForm :editMode="props.editMode" :item="props.item" />
    </template>
    <template #objectives>
      test
      <!-- <MobilityObjectiveForm :editMode="props.editMode" :item="props.item.objectives" /> -->
    </template>
  </BaseTabs>
</template>

<script setup>
import BaseTabs from '@/components/ui/BaseTabs.vue'
import MobilitySubmissionForm from '@/components/form/MobilitySubmissionForm.vue'
// import MobilityObjectiveForm from '@/components/form/MobilityObjectiveForm.vue'

const props = defineProps({
  editMode: {
    type: Boolean,
    required: false,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  disableUrlAltering: {
    type: Boolean,
    default: false
  }
})

const tabs = [
  { name: 'general', disabled: false, label: 'Allgemein' },
  { name: 'objectives', disabled: false, label: 'Leitziele' }
]
</script>

<style scoped></style>
