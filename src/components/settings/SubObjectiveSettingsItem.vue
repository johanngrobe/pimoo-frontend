<template>
  <BaseModal v-model="editMode">
    <template #header>
      <h2>Unterziel bearbeiten</h2>
    </template>
    <SubObjectiveForm
      :editMode="true"
      :item="props.item"
      :mainObjectiveId="props.item.mainObjective.id"
      :mainObjective="props.item.mainObjective"
      @update-item="onUpdate"
    />
  </BaseModal>
  <div class="grid grid-cols-12 gap-x-2 px-2 py-1 ms-3 hover:bg-gray-200 rounded-lg">
    <div class="col-span-10 flex items-center gap-2">
      <div>{{ props.item.mainObjective.no }}.{{ props.item.no }}</div>
      <div>{{ props.item.label }}</div>
    </div>
    <div class="col-span-2 flex items-center justify-end gap-1">
      <ButtonBearbeiten @click="toggleEditMode" />
      <ButtonLoeschen @click="deleteItem" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SubObjectiveForm from '@/components/settings/SubObjectiveForm.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'

const editMode = ref(false)

const props = defineProps({
  item: Object
})

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const emit = defineEmits(['delete-item', 'update-item'])

const onUpdate = (values) => {
  emit('update-item', values)
  toggleEditMode()
}

const deleteItem = () => {
  emit('delete-item', props.item.id)
}
</script>

<style></style>
