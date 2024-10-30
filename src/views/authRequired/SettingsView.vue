<template>
  <div>
    <h1>Einstellungen</h1>

    <BaseTabs :tabs="tabs">
      <template #text-block>
        <TextBlockSettings />
      </template>
      <template #indicator>
        <IndicatorSettings />
      </template>
      <template #tag>
        <TagSettings />
      </template>
      <template #main-objective>
        <MainObjectiveSettings />
      </template>
      <template #sub-objective> <SubObjectiveSettings /> </template
    ></BaseTabs>
  </div>
</template>

<script setup>
import TextBlockSettings from '@/components/settings/TextBlockSettings.vue'
import IndicatorSettings from '@/components/settings/IndicatorSerttings.vue'
import TagSettings from '@/components/settings/TagSettings.vue'
import MainObjectiveSettings from '@/components/settings/MainObjectiveSettings.vue'
import SubObjectiveSettings from '@/components/settings/SubObjectiveSettings.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'

const tabs = [
  { name: 'text-block', label: 'Textblöcke', disabled: false },
  { name: 'indicator', label: 'Indikatoren', disabled: false },
  { name: 'tag', label: 'Tags', disabled: false },
  { name: 'main-objective', label: 'Leitziele', disabled: false },
  { name: 'sub-objective', label: 'Unterziele', disabled: false }
]
</script>

<style></style>
