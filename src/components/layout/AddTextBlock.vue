<template>
  <div class="relative inline-block max-w-5xl flex flex-nowrap">
    <BaseButton @click="toggleList" class="plus-button">+</BaseButton>
    <transition name="fade">
      <div v-if="showList" class="dropdown">
        <div class="flex">
          <InputText
            type="text"
            v-model="searchQuery"
            placeholder="Textbausteine suchen"
            class="w-full"
          />
        </div>
        <ul class="text-blocks-list mt-4">
          <li
            v-for="block in filteredTextBlocks"
            :key="block.label"
            @click="addTextBlock(block)"
            class="text-block-item"
          >
            {{ block.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import apiClient from '@/services/axios'

const textBlocks = ref([])

onMounted(async () => {
  textBlocks.value = await fetchTextBlocks()
})

const showList = ref(false)
const searchQuery = ref('')

const toggleList = () => {
  showList.value = !showList.value
}

const emit = defineEmits(['add-text-block'])

const addTextBlock = (block) => {
  emit('add-text-block', block.label)
  toggleList()
}

const fetchTextBlocks = async () => {
  try {
    const response = await apiClient.get('/text-block')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const filteredTextBlocks = computed(() => {
  let filteredTextBlocks = textBlocks.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredTextBlocks = filteredTextBlocks.filter(
      (block) =>
        block.label.toLowerCase().includes(query) ||
        block.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  return filteredTextBlocks
})
</script>

<style scoped>
.plus-button {
  @apply text-2xl font-bold;
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

.dropdown {
  @apply absolute top-0 left-20 bg-white border rounded-lg border-gray-300 w-11/12 p-4 z-50;
}

.search-input {
  @apply w-full p-2 border border-gray-300 rounded;
}

.text-blocks-list {
  @apply max-h-48 overflow-y-auto mt-2;
}

.text-block-item {
  @apply p-2 cursor-pointer hover:bg-gray-200 hover:rounded-lg;
}
</style>
