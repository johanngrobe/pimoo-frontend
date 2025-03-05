<template>
  <BaseButton v-tooltip.top="'Bearbeiten'" class="flex gap-2 px-2 py-1">
    <IconEdit class="h-4 w-4" />
    <span v-if="props.showLabel">{{ props.label }}</span>
  </BaseButton>
</template>

<script setup>
import IconEdit from '@/assets/icons/MaterialSymbolsEditSquare.svg?component'

const props = defineProps({
  showLabel: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Bearbeiten'
  }
})
</script>

<style></style>
