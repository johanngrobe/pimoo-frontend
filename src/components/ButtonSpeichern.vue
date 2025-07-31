<template>
  <Button icon="pi pi-save" v-tooltip.top="'Speichern'" :label="label" />
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  noLabel: {
    type: Boolean,
    default: false
  }
})

const label = computed(() => {
  return props.noLabel ? '' : 'Speichern'
})
</script>

<style></style>
