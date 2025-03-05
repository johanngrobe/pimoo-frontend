<template>
  <BaseButton class="flex gap-2 px-2 py-1" :color="props.color">
    <IconSave class="h-4 w-4" /><span>Speichern</span>
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
