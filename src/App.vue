<script setup>
import { RouterView } from 'vue-router'
import SidebarMenu from './components/layout/SidebarMenu.vue'
import { useTitle } from '@vueuse/core'
import Toast from 'primevue/toast'

useTitle('pimoo Mobilitätscheck')
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SidebarMenu class="sm:w-64 rounded" />

    <!-- Main Content Area -->
    <div class="flex-1">
      <div class="max-w-4xl mx-auto p-6">
        <Toast position="top-center" />
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
