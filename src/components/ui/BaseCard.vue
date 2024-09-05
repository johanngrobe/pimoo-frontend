<template>
  <div
    class="mt-5 max-w p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div @click="toggleCollapse" class="cursor-pointer">
      <slot name="title"></slot>
    </div>
    <transition name="collapse-transition">
      <div v-show="!isCollapsed">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { defineProps, toRefs } from 'vue'

const props = defineProps({
  collapsible: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const { collapsible, isCollapsed } = toRefs(props)

const toggleCollapse = () => {
  if (collapsible.value) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.collapse-transition {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease,
    padding 0.3s ease;
  overflow: hidden;
  max-height: 500px; /* A reasonable max height for expanded content */
}

.collapse-transition-enter-active,
.collapse-transition-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease,
    padding 0.3s ease;
}

.collapse-transition-enter,
.collapse-transition-leave-to /* .collapse-transition-leave-active in <2.1.8 */ {
  max-height: 0;
  opacity: 0;
  padding: 0;
}
</style>
