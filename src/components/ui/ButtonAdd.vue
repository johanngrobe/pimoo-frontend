<template>
  <BaseButton v-tooltip.top="props.tooltip" class="flex gap-2 px-2 py-1">
    <IconAdd class="h-4 w-4" /><slot></slot>
  </BaseButton>
</template>

<script setup>
import IconAdd from '@/assets/icons/MaterialSymbolsAdd.svg?component'

const props = defineProps({
  tooltip: {
    type: String,
    default: 'Hinzufügen'
  }
})
</script>

<style></style>
