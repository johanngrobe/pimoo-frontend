<template>
  <BaseModal v-model="editMode">
    <template #header>
      <h2>Textblock bearbeiten</h2>
    </template>
    <TextBlockForm :editMode="true" :item="props.item" :tags="props.tags" @update-item="onUpdate" />
  </BaseModal>
  <BaseCard class="hover:bg-gray-200">
    <div>
      <div class="grid grid-cols-12 gap-2">
        <div class="col-span-10 grid grid-cols-1 gap-2">
          <h3>{{ props.item.label }}</h3>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Tags:</span>
            <div v-if="props.item.tags.length > 0" class="flex items-center gap-2">
              <div v-for="tag in props.item.tags" :key="tag.id">
                <BaseBadge>{{ tag.label }}</BaseBadge>
              </div>
            </div>
            <div v-else>
              <BaseBadge color="red">Keine Tags vergeben</BaseBadge>
            </div>
          </div>
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
import TextBlockForm from '@/components/settings/TextBlockForm.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  item: Object,
  tags: Array
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
