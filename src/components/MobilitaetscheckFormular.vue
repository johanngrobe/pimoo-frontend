<template>
  <BaseTabs :tabs="tabs" :disableUrlAltering="props.disableUrlAltering">
    <template #eingabe>
      <MobilitaetscheckFormularEingabe :editMode="props.editMode" :item="props.item" />
    </template>
    <template #ziele>
      <MobilitaetscheckFormularZielOber
        :editMode="props.editMode"
        :item="props.item.eingabeZielOber"
      />
    </template>
  </BaseTabs>
</template>

<script setup>
import BaseTabs from '@/components/BaseTabs.vue'
import MobilitaetscheckFormularEingabe from '@/components/MobilitaetscheckFormularEingabe.vue'
import MobilitaetscheckFormularZielOber from '@/components/MobilitaetscheckFormularZielOber.vue'

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
  { name: 'eingabe', disabled: false, label: 'Allgemein' },
  { name: 'ziele', disabled: false, label: 'Leitziele' }
]
</script>

<style scoped></style>
