<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <NavigationsmenuSidebar class="sm:w-64 rounded" />

    <!-- Main Content Area -->
    <div class="flex-1">
      <div class="max-w-6xl mx-auto p-6">
        <Toast position="top-center" />
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavigationsmenuSidebar from './components/NavigationsmenuSidebar.vue'
import { useTitle } from '@vueuse/core'
import Toast from 'primevue/toast'

useTitle('pimoo Mobilitätscheck')
</script>

<style scoped></style>
