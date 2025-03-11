<template>
  <BaseButton v-tooltip.top="'Speichern'" class="flex gap-2 p-1" :color="props.color">
    <IconSave class="h-4 w-4" /><span><slot></slot></span>
  </BaseButton>
</template>

<script setup>
import IconSave from '@/assets/icons/MaterialSymbolsSave.svg?component'

const props = defineProps({
  color: {
    type: String,
    default: 'blue'
  }
})
</script>

<style></style>
