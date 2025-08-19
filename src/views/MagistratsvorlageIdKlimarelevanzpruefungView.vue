<template>
  <div>
    <div class="flex items-center gap-5">
      <BaseSubheading>Klimarelevanzprüfungen</BaseSubheading>
      <!-- <RouterLink :to="`${route.fullPath}/neu`">
        <Button
          v-tooltip="'Mobilitätscheck hinzufügen'"
          icon="pi pi-plus"
          rounded
          aria-label="Mobilitätscheck hinzufügen"
        />
      </RouterLink> -->
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import MobilitaetscheckListe from '@/components/MobilitaetscheckListe.vue'
import Button from 'primevue/button'

const route = useRoute()
</script>

<style></style>
