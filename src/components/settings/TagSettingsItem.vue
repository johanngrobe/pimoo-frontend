<template>
  <BaseModal v-model="editMode">
    <template #header>
      <h2>Tag bearbeiten</h2>
    </template>
    <TagForm :editMode="true" :item="props.item" @update-item="onUpdate" />
  </BaseModal>
  <BaseCard class="hover:bg-gray-200">
    <div>
      <div class="grid grid-cols-12 gap-2">
        <div class="col-span-10 grid grid-cols-1 gap-2">
          <h3>{{ props.item.label }}</h3>
        </div>
        <div class="col-span-2 flex items-center justify-end gap-1">
          <ButtonBearbeiten @click="toggleEditMode" />
          <ButtonLoeschen @delete-confirmed="onDelete" />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import TagForm from '@/components/settings/TagForm.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'

const props = defineProps({
  item: Object
})

const editMode = ref(false)

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const emit = defineEmits(['delete-item', 'update-item'])

const onUpdate = (values) => {
  emit('update-item', values)
  toggleEditMode()
}

const onDelete = () => {
  emit('delete-item', props.item.id)
}
</script>

<style></style>
