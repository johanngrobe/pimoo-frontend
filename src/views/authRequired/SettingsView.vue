<template>
  <h1>Einstellungen</h1>

  <BaseTabs :tabs="tabs">
    <template #Textblöcke>
      <TextBlockSettings />
    </template>
    <template #Indikatoren>
      <IndicatorSettings />
    </template>
    <template #Tags>
      <TagSettings />
    </template>
    <template #Leitziele>
      <MainObjectiveSettings />
    </template>
    <template #Unterziele> <SubObjectiveSettings /> </template
  ></BaseTabs>
</template>

<script setup>
import TextBlockSettings from '@/components/settings/TextBlockSettings.vue'
import IndicatorSettings from '@/components/settings/IndicatorSerttings.vue'
import TagSettings from '@/components/settings/TagSettings.vue'
import MainObjectiveSettings from '@/components/settings/MainObjectiveSettings.vue'
import SubObjectiveSettings from '@/components/settings/SubObjectiveSettings.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'

const tabs = [
  { name: 'Textblöcke', disabled: false },
  { name: 'Indikatoren', disabled: false },
  { name: 'Tags', disabled: false },
  { name: 'Leitziele', disabled: false },
  { name: 'Unterziele', disabled: false }
]
</script>

<style></style>
