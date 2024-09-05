<script setup>
import { RouterView } from 'vue-router'
import SidebarMenu from './components/layout/SidebarMenu.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SidebarMenu class="sm:w-64 rounded" />

    <!-- Main Content Area -->
    <div class="flex-1">
      <div class="max-w-4xl mx-auto p-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
