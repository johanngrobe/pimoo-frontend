<template>
  <div v-for="mainObjective in item" :key="mainObjective.id">
    <BaseCard>
      {{ mainObjective.label }}
      <MobilityObjectiveFormItemMain
        :editMode="editMode"
        :item="mainObjective"
        ref="mobilityObjectiveForm"
      />
    </BaseCard>
  </div>
</template>

<script setup>
import { onMounted, toRefs } from 'vue'
import MobilityObjectiveFormItemMain from '@/components/form/MobilityObjectiveFormItemMain.vue'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
})

const { editMode, item } = toRefs(props)

// const route = useRoute()

onMounted(async () => {})
</script>

<style></style>
