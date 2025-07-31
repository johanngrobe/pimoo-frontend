<template>
  <div>
    <DataView :value="magistratsvorlageListe">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <BaseCard
              class="hover:bg-gray-100"
              @click="router.push({ name: 'magistratsvorlage-id-daten', params: { id: item.id } })"
            >
              <template #header
                ><span class="font-bold text-lg">{{ item.name }}</span></template
              >
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-5 flex grid grid-cols-5 gap-2">
                  <div class="col-span-1 font-bold">
                    <div>Nr.</div>
                    <div>Datum</div>
                  </div>
                  <div class="col-span-4">
                    <div>{{ item.verwaltungsvorgangNr }}</div>
                    <div>{{ datumFormatieren(item.verwaltungsvorgangDatum) }}</div>
                  </div>
                </div>
                <div class="col-span-3 font-bold">
                  <div class="flex items-center gap-2">
                    <i
                      class="pi"
                      :class="{
                        'pi-check-circle text-green-500': item.mobilitaetschecks.length > 0,
                        'pi-times-circle text-red-400': item.mobilitaetschecks.length === 0
                      }"
                    ></i
                    >Mobilitätscheck
                  </div>
                  <div class="flex items-center gap-2">
                    <i
                      class="pi"
                      :class="{
                        'pi-check-circle text-green-500': item.klimachecks.length > 0,
                        'pi-times-circle text-red-400': item.klimachecks.length === 0
                      }"
                    ></i
                    >Klimacheck
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchItems } from '@/composables/crud'
import DataView from 'primevue/dataview'

const router = useRouter()

const magistratsvorlageListe = ref([])

onMounted(async () => {
  await fetchMagistratsvorlageListe()
})

const fetchMagistratsvorlageListe = async () => {
  magistratsvorlageListe.value = await fetchItems('/magistratsvorlage')
}

const datumFormatieren = (datum) => {
  return new Date(datum).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style></style>
