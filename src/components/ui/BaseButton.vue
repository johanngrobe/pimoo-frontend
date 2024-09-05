<template>
  <component
    :is="tag"
    :to="isRouterLink ? to : undefined"
    :href="isLinkTag ? to : undefined"
    @click="handleClick"
    class="btn"
    :class="computedClass"
    :type="type"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'
// import { RouterLink } from 'vue-router'

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a', 'RouterLink'].includes(value)
  },
  to: {
    type: [String, Object],
    default: null
  },
  outline: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const emit = defineEmits(['click'])

const isRouterLink = computed(() => props.tag === 'RouterLink')
const isLinkTag = computed(() => props.tag === 'a')

const computedClass = computed(() => {
  return props.outline ? 'btn-outline' : 'btn-solid'
})

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center cursor-pointer;
}

.btn-outline {
  @apply text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800;
}

.btn-solid {
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
}
</style>
