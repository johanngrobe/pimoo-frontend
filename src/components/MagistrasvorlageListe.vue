<template>
  <div>
    <ConfirmDialog></ConfirmDialog>
    <DataView :value="magistratsvorlageListe" paginator :rows="10">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index" :lazy="true">
            <router-link
              :to="{ name: 'magistratsvorlage-id-daten', params: { id: item.id } }"
              custom
              v-slot="{ navigate, href }"
            >
              <BaseCard
                class="hover:bg-gray-100"
                :data-href="href"
                @click="navigate"
                @keydown.enter.prevent="navigate"
                @keydown.space.prevent="navigate"
                tabindex="0"
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
                    <div class="flex items-center gap-2">
                      <span v-for="gebiet in item.gemeindeGebiete" :key="gebiet.id">
                        <Tag :value="gebiet.name" severity="secondary" />
                      </span>
                    </div>
                  </div>
                  <div class="col-span-3 font-bold">
                    <div class="flex items-center gap-2">
                      <router-link
                        :to="{
                          name: 'magistratsvorlage-id-mobilitaetscheck',
                          params: { id: item.id }
                        }"
                      >
                        <Button
                          :icon="
                            item.mobilitaetschecks.length > 0
                              ? 'pi pi-check-circle text-green-500'
                              : 'pi pi-times-circle text-red-400'
                          "
                          label="Mobilitätscheck"
                          variant="text"
                        />
                      </router-link>
                    </div>
                    <div class="flex items-center gap-2">
                      <router-link
                        :to="{
                          name: 'magistratsvorlage-id-klimacheck',
                          params: { id: item.id }
                        }"
                      >
                        <Button
                          :icon="
                            item.klimachecks.length > 0
                              ? 'pi pi-check-circle text-green-500'
                              : 'pi pi-times-circle text-red-400'
                          "
                          label="Klimacheck"
                          variant="text"
                        />
                      </router-link>
                    </div>
                  </div>
                  <!-- TODO Klimarelevanzprüfung -->
                  <div class="col-span-3 font-bold">
                    <div class="flex items-center gap-2">
                      <router-link
                        :to="{
                          name: 'magistratsvorlage-id-klimarelevanzpruefung',
                          params: { id: item.id }
                        }"
                      >
                        <Button
                          :icon="
                            item.klimachecks.length > 0
                              ? 'pi pi-check-circle text-green-500'
                              : 'pi pi-times-circle text-red-400'
                          "
                          label="Klimarelevanzprüfung"
                          variant="text"
                        />
                      </router-link>
                    </div>
                  </div>
                  <div>
                    <span @click.stop>
                      <Button
                        @click="confirmDelete(item.id)"
                        v-tooltip="'löschen'"
                        icon="pi pi-trash"
                        severity="danger"
                      />
                    </span>
                  </div>
                </div>
              </BaseCard>
            </router-link>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { deleteItem, fetchItems } from '@/composables/crud'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import DataView from 'primevue/dataview'
import ConfirmDialog from 'primevue/confirmdialog'
import Tag from 'primevue/tag'

const magistratsvorlageListe = ref([])

const confirm = useConfirm()

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

const confirmDelete = (id) => {
  confirm.require({
    message: 'Möchten Sie diese Magistratsvorlage löschen?',
    header: 'Löschen bestätigen',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Abbrechen',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'löschen',
      severity: 'danger'
    },
    accept: async () => {
      await deleteItem({
        model: 'magistratsvorlage',
        modelId: id,
        detail: {
          success: 'Magistratsvorlage erfolgreich gelöscht.',
          error: 'Fehler beim Löschen der Magistratsvorlage.'
        }
      })
      magistratsvorlageListe.value = magistratsvorlageListe.value.filter((item) => item.id !== id)
    }
  })
}
</script>

<style></style>
