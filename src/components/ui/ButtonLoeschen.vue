<template>
  <BaseButton v-tooltip.top="'Löschen'" color="red" class="flex gap-2 px-2 py-1"
    ><IconDelete class="h-4 w-4" /> <span v-if="props.showLabel">{{ props.label }}</span>
  </BaseButton>
</template>

<script setup>
import IconDelete from '@/assets/icons/MaterialSymbolsDelete.svg?component'

const props = defineProps({
  showLabel: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Löschen'
  }
})
</script>

<style></style>
