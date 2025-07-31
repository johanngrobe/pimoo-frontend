<template>
  <div class="relative inline-block max-w-5xl flex flex-nowrap">
    <BaseButton @click="toggleList" class="plus-button">+ Textbaustein</BaseButton>
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
        <ul class="textblocks-list mt-4">
          <li
            v-for="block in filteredTextblocks"
            :key="block.name"
            @click="addTextblock(block)"
            class="textblock-item"
          >
            {{ block.name }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import { apiClient } from '@/services/axios'

const textblocks = ref([])

onMounted(async () => {
  textblocks.value = await fetchTextblocks()
})

const showList = ref(false)
const searchQuery = ref('')

const toggleList = () => {
  showList.value = !showList.value
}

const emit = defineEmits(['add-textblock'])

const addTextblock = (block) => {
  emit('add-textblock', block.name)
  toggleList()
}

const fetchTextblocks = async () => {
  try {
    const response = await apiClient.get('/einstellungen/textblock')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const filteredTextblocks = computed(() => {
  let filteredTextblocks = textblocks.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredTextblocks = filteredTextblocks.filter(
      (block) =>
        block.name.toLowerCase().includes(query) ||
        block.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  return filteredTextblocks
})
</script>

<style scoped>
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

.textblocks-list {
  @apply max-h-48 overflow-y-auto mt-2;
}

.textblock-item {
  @apply p-2 cursor-pointer hover:bg-gray-200 hover:rounded-lg;
}
</style>
