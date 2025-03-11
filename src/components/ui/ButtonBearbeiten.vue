<template>
  <BaseButton v-tooltip.top="'Bearbeiten'" class="flex gap-2 px-2 py-1">
    <IconEdit class="h-4 w-4" />
    <slot></slot>
  </BaseButton>
</template>

<script setup>
import IconEdit from '@/assets/icons/MaterialSymbolsEditSquare.svg?component'
</script>

<style></style>
