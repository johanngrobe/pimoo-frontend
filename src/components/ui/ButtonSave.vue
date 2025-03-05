<template>
  <BaseButton v-tooltip.top="'Speichern'" class="flex gap-2 p-1" :color="props.color">
    <IconSave class="h-4 w-4" /><span v-if="showLabel">{{ props.label }}</span>
  </BaseButton>
</template>

<script setup>
import IconSave from '@/assets/icons/MaterialSymbolsSave.svg?component'

const props = defineProps({
  color: {
    type: String,
    default: 'blue'
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Speichern'
  }
})
</script>

<style></style>
