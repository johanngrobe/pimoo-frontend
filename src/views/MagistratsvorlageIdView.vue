<template>
  <div>
    <div class="grid grid-cols-8 gap-x-2 grid-flow-col">
      <div class="container col-span-2 w-fit mt-10">
        <Menu :model="items" class="w-fit">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </template>
        </Menu>
      </div>
      <div class="container col-span-6">
        <BaseHeading> Magistratsvorlage </BaseHeading>
        <Router-View />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Menu from 'primevue/menu'

const route = useRoute()

const items = ref([
  {
    label: 'Daten',
    route: `/magistratsvorlage/${route.params.id}/daten`
  },
  {
    label: 'Mobilitätschecks',
    route: `/magistratsvorlage/${route.params.id}/mobilitaetscheck`
  },
  {
    label: 'Klimachecks',
    route: `/magistratsvorlage/${route.params.id}/klimacheck`
  }
])
</script>

<style></style>
