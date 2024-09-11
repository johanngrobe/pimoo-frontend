<template>
  <form @submit.prevent="onSubmit">
    <div
      v-for="(subObjective, index) in mobilityStore.mobilityObjectiveForm[mainObjectiveIndex]
        .subObjectives"
      :key="index"
      class="mt-7"
    >
      <div class="flex items-center">
        <Checkbox
          class="flex-none"
          :id="`sub-checkbox-${mainObjectiveIndex}-${index}`"
          :key="`sub-checkbox-${mainObjectiveIndex}-${index}`"
          v-model="subObjective.target"
          :binary="true"
        />
        <label
          :for="`sub-checkbox-${mainObjectiveIndex}-${index}`"
          class="text-lg ms-3"
          @click="toggleSubCheckbox(index)"
        >
          <div class="flex justify-center">
            <span class="font-bold flex-none my-auto"
              >{{ subObjective.subObjective.mainObjectiveId }}.{{
                subObjective.subObjective.no
              }}</span
            >
            <span class="text-semibold ms-2 flex-auto my-auto">{{
              subObjective.subObjective.label
            }}</span>
          </div>
        </label>
      </div>
      <div v-if="subObjective.target" class="ms-10">
        <div class="grid grid-cols-2 gap-4">
          <div class="w-full my-auto max-w-md">
            <label :for="`impact-${mainObjectiveIndex}-${index}`"
              >Wirkungsrichtung und -Stärke</label
            >
            <Slider
              :id="`impact-${mainObjectiveIndex}-${index}`"
              :key="`impact-${mainObjectiveIndex}-${index}`"
              v-model.number="subObjective.impact"
              :min="-3"
              :max="3"
              :step="1"
              class="w-full mt-3"
            />
            <div class="flex justify-between mt-2">
              <span v-for="tick in 7" :key="tick" class="relative w-0.5 h-2 bg-gray-800">
                <span class="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs">
                  {{ tickmarkLabels[tick - 4] }}
                </span>
              </span>
            </div>
          </div>
          <div class="ms-5 mt-7 my-auto max-w-md">
            <FloatLabel>
              <Dropdown
                :id="`spatial-impact-${mainObjectiveIndex}-${index}`"
                :key="`spatial-impact-${mainObjectiveIndex}-${index}`"
                v-model="subObjective.spatialImpact"
                :options="optionsSpatialImpact"
                optionLabel="label"
                optionValue="value"
                class="w-full dont-close-on-select"
              />
              <label :for="`spatial-impact-${mainObjectiveIndex}-${index}`"
                >Räumliche Auswirkung</label
              >
            </FloatLabel>
          </div>
        </div>
        <div class="mt-7 max-w-5xl">
          <FloatLabel>
            <Textarea
              :id="`annotation-${mainObjectiveIndex}-${index}`"
              :key="`annotation-${mainObjectiveIndex}-${index}`"
              v-model="subObjective.annotation"
              rows="5"
              class="w-full"
            />
            <label :for="`explanation-${mainObjectiveIndex}-${index}`">Erläuterung</label>
          </FloatLabel>
        </div>
        <AddTextBlock class="mt-3 w-full" @add-text-block="appendTextBlock($event, index)" />
        <div class="mt-7 max-w-5xl">
          <MultiSelect
            :id="`indicators-${mainObjectiveIndex}-${index}`"
            :key="`indicators-${mainObjectiveIndex}-${index}`"
            v-model="subObjective.indicators"
            :options="optionsIndicators"
            filter
            optionLabel="label"
            optionValue="id"
            placeholder="Indikatoren auswählen"
            class="w-full dont-close-on-select"
            display="chip"
            empty-filter-message="Keine Ergebnisse gefunden"
            :pt="{
              header: () => ({
                id: `indicators-${mainObjectiveIndex}-${index}_header`
              })
            }"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { defineProps, onMounted, watchEffect } from 'vue'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'
import { useStorage } from '@vueuse/core'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
import FloatLabel from 'primevue/floatlabel'
import MultiSelect from 'primevue/multiselect'
import Textarea from 'primevue/textarea'
import Slider from 'primevue/slider'
import AddTextBlock from '@/components/layout/AddTextBlock.vue'
import apiClient from '@/services/axios'

const mobilityStore = useMobilitySubmissionStore()

const props = defineProps({
  mainObjectiveIndex: {
    type: Number
  }
})

const optionsIndicators = useStorage('cachedIndicators', [])
const tickmarkLabels = useStorage('cachedTickmarkLabels', {})
const optionsSpatialImpact = useStorage('cachedSpatialImpactOptions', [])

const fetchSpatialImpactOptions = async () => {
  try {
    if (!optionsSpatialImpact.value.length) {
      const response = await apiClient.get('/option/mobility/spatial-impact')
      optionsSpatialImpact.value = response.data
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchTickmarkLabels = async () => {
  try {
    if (Object.keys(tickmarkLabels.value).length === 0) {
      const response = await apiClient.get('/option/mobility/impact-tickmarks')
      tickmarkLabels.value = response.data.reduce((acc, { label, value }) => {
        acc[value] = label
        return acc
      }, {})
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchIndicators = async () => {
  try {
    if (!optionsIndicators.value.length) {
      const response = await apiClient.get('/indicator')
      optionsIndicators.value = response.data
    }
  } catch (error) {
    console.error(error)
  }
}
watchEffect(() => {
  fetchTickmarkLabels()
  fetchSpatialImpactOptions()
  fetchIndicators()
})

onMounted(async () => {
  await fetchTickmarkLabels()
  await fetchSpatialImpactOptions()
  await fetchIndicators()
})

const toggleSubCheckbox = (index) => {
  mobilityStore.mobilityObjectiveForm[props.mainObjectiveIndex].subObjectives[index].target =
    !mobilityStore.mobilityObjectiveForm[props.mainObjectiveIndex].subObjectives[index].target
}

const appendTextBlock = (event, index) => {
  const text = event
  if (
    mobilityStore.mobilityObjectiveForm[props.mainObjectiveIndex].subObjectives[index].annotation
  ) {
    mobilityStore.mobilityObjectiveForm[props.mainObjectiveIndex].subObjectives[index].annotation +=
      `\n${text}`
  } else {
    mobilityStore.mobilityObjectiveForm[props.mainObjectiveIndex].subObjectives[index].annotation =
      text
  }
}
</script>

<style scoped></style>
