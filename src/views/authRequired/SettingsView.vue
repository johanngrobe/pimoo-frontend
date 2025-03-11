<template>
  <div>
    <h1>Einstellungen</h1>

    <BaseTabs :tabs="tabs">
      <template #main-objective>
        <MainObjectiveSettings />
      </template>
      >
      <template #text-block>
        <TextBlockSettings />
      </template>
      <template #indicator>
        <IndicatorSettings />
      </template>
      <template #tag>
        <TagSettings />
      </template>
    </BaseTabs>
  </div>
</template>

<script setup>
import TextBlockSettings from '@/components/settings/TextBlockSettings.vue'
import IndicatorSettings from '@/components/settings/IndicatorSerttings.vue'
import TagSettings from '@/components/settings/TagSettings.vue'
import MainObjectiveSettings from '@/components/settings/MainObjectiveSettings.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'

const tabs = [
  { name: 'main-objective', label: 'Leitziele', disabled: false },
  { name: 'text-block', label: 'Textblöcke', disabled: false },
  { name: 'indicator', label: 'Indikatoren', disabled: false },
  { name: 'tag', label: 'Tags', disabled: false }
]
</script>

<style></style>
