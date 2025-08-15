<template>
  <Toolbar style="border-radius: 0.5rem; background-color: #f9fafb" class="w-full">
    <template #start>
      <div class="flex items-center gap-2">
        <router-link
          :to="{ name: 'startseite' }"
          class="grid grid-cols-1 items-center justify-center justify-items-center"
        >
          <div class="font-bold text-lg flex items-center">Mobilitätscheck</div>
          <div class="font-bold text-xs">für Magistratsvorlagen</div>
        </router-link>
      </div>
    </template>
    <template #center>
      <div v-if="authStore.isLoggedIn">
        <Button asChild v-slot="slotProps" text plain>
          <RouterLink :to="{ name: 'magistratsvorlage-liste' }" :class="slotProps.class"
            >Magistratsvorlagen</RouterLink
          >
        </Button>
      </div>
    </template>

    <template #end>
      <div v-if="authStore.isLoggedIn" class="flex items-center gap-2">
        <router-link v-if="[1].includes(authStore.userRolleId)" :to="{ name: 'leitziel' }">
          <Button icon="pi pi-cog" text plain />
        </router-link>
        <Button icon="pi pi-sign-out" label="Abmelden" @click="authStore.logout" />
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          style="width: 32px; height: 32px"
        />
      </div>
      <div v-else class="flex items-center gap-2">
        <router-link :to="{ name: 'anmelden' }">
          <Button label="Anmelden" icon="pi pi-sign-in" />
        </router-link>
      </div>
    </template>
  </Toolbar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'

const authStore = useAuthStore()
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  @apply block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500;
}
</style>
