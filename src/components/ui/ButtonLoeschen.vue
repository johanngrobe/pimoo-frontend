<template>
  <BaseModal v-model="isModalOpen">
    <template #header>
      <BaseSubheading>Möchtest du den Eintrag wirklich löschen?</BaseSubheading>
    </template>
    <slot></slot>
    <template #footer>
      <div class="flex items-center justify-end gap-4 w-full">
        <BaseButton color="red" @click="handleDelete" class="flex items-center gap-1"
          ><IconDelete class="w-4 h-4" /><span>Löschen</span></BaseButton
        >
        <BaseButton @click="toggleModal">Abbrechen</BaseButton>
      </div>
    </template>
  </BaseModal>
  <BaseButton v-tooltip.top="'löschen'" @click="toggleModal" color="red"
    ><IconDelete class="h-4 w-4" />
  </BaseButton>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import IconDelete from '@/assets/icons/MaterialSymbolsDelete.svg?component'

const isModalOpen = ref(false)

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const emit = defineEmits(['delete-confirmed'])

const handleDelete = () => {
  emit('delete-confirmed')
  toggleModal()
}
</script>
