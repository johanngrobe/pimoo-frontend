<template>
  <BaseModal v-model="editMode">
    <template #header>
      <h2>Leitziel bearbeiten</h2>
    </template>
    <MainObjectiveForm :editMode="true" :item="props.item" @update-item="onUpdateItem" />
  </BaseModal>
  <BaseModal v-model="addMode">
    <template #header>
      <h2>Unterziel hinzufügen</h2>
    </template>
    <SubObjectiveForm
      :mainObjectiveId="props.item.id"
      :mainObjective="props.item"
      @add-item="onSubmit"
      :nextNo="nextNo"
    />
  </BaseModal>
  <BaseCard>
    <div class="grid grid-cols-12 gap-x-2 items-center hover:bg-gray-200 p-2 rounded-lg">
      <div class="col-span-10 flex items-center font-bold gap-2">
        <span>{{ props.item.no }}</span>
        <span>{{ props.item.label }}</span>
      </div>

      <div class="col-span-2 flex gap-1 items-center justify-end">
        <ButtonAdd tooltip="Unterziel hinzufügen" @click="toggleAddMode" />
        <ButtonBearbeiten @click="toggleEditMode" />
        <ButtonLoeschen @click="onDeleteItem" />
      </div>
    </div>
    <div v-for="subObjective in subObjectives" :key="subObjective.id">
      <SubObjectiveSettingsItem
        :item="subObjective"
        @update-item="onUpdate"
        @delete-item="onDelete"
      />
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { createItem, deleteItem, fetchItems, updateItem } from '@/composables/crud'
import MainObjectiveForm from '@/components/settings/MainObjectiveForm.vue'
import SubObjectiveForm from '@/components/settings/SubObjectiveForm.vue'
import SubObjectiveSettingsItem from '@/components/settings/SubObjectiveSettingsItem.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import ButtonAdd from '@/components/ui/ButtonAdd.vue'

const editMode = ref(false)
const addMode = ref(false)

const subObjectives = ref()

const nextNo = computed(() => {
  return subObjectives.value.length + 1
})

const fetchSubObjectives = async () => {
  subObjectives.value = await fetchItems('/objective/sub/by-params', {
    mainObjectiveId: props.item.id
  })
}

onMounted(async () => {
  await fetchSubObjectives()
})

const props = defineProps({
  item: Object
})

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const toggleAddMode = () => {
  addMode.value = !addMode.value
}

const emit = defineEmits(['delete-item', 'update-item'])

const onUpdateItem = (values) => {
  emit('update-item', values)
  toggleEditMode()
}

const onDeleteItem = () => {
  emit('delete-item', props.item.id)
}

const onSubmit = async (values) => {
  const response = await createItem({
    model: 'objective/sub',
    values,
    detail: {
      success: 'Unterziel erfolgreich hinzugefügt',
      error: 'Fehler beim Hinzufügen des Unterziels'
    }
  })
  subObjectives.value.push(response)
  toggleAddMode()
}

const onUpdate = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'objective/sub',
    modelId,
    values,
    detail: {
      success: 'Unterziel erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des Unterziels'
    }
  })
  const ix = subObjectives.value.findIndex((subObjective) => subObjective.id === response.id)
  if (ix !== -1) {
    subObjectives.value.splice(ix, 1, response)
  }
}

const onDelete = async (id) => {
  await deleteItem({
    model: 'objective/sub',
    modelId: id,
    detail: {
      success: 'Unterziel erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Unterziels'
    }
  })
  const ix = subObjectives.value.findIndex((subObjective) => subObjective.id === id)
  if (ix !== -1) {
    subObjectives.value.splice(ix, 1)
  }
}
</script>

<style></style>
