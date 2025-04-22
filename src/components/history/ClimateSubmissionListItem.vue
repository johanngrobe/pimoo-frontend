<template>
  <div>
    <BaseModal v-model="editMode">
      <template #header>
        <h2>{{ props.item.label }} bearbeiten</h2>
      </template>
      <ClimateForm :editMode="true" :item="props.item" @update-item="onUpdate" />
    </BaseModal>
    <BaseCard>
      <div class="grid grid-cols-12 gap-1">
        <div class="col-span-10 grid grid-cols-1 gap-x-4 gap-y-1">
          <h3 class="font-bold text-lg">{{ props.item.label }}</h3>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Sachbearbeitung:</span>
            <span
              ><span>{{ props.item.author?.firstName }} {{ props.item.author?.lastName }}</span>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="checkLastEditor" class="font-semibold">Letzte Bearbeitung durch:</span>
            <span v-if="checkLastEditor">
              {{ props.item.lastEditor?.firstName }} {{ props.item.lastEditor?.lastName }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Magistratvorlagennummer:</span>
            <span>{{ props.item.administrationNo }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Datum Magistratssitzung:</span>
            <span>{{ administrationDate }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Klimawirkung:</span>
            <span>{{ props.item.impactLabel }}</span>
          </div>
        </div>

        <div class="col-span-2 grid grid-cols-1 items-center justify-center gap-y-1">
          <div v-if="userRoleAccess" class="flex items-center justify-center gap-1">
            <Checkbox
              id="published"
              v-model="isPublished"
              :binary="true"
              inputId="published"
              @change="onPublish"
            />
            <label for="published" @click="toggleIsPublished">Veröffentlicht</label>
          </div>
          <ButtonDownload @click="onExport">PDF-Export</ButtonDownload>
          <ButtonBearbeiten v-if="userRoleAccess" @click="toggleEditMode"
            >Bearbeiten</ButtonBearbeiten
          >
          <ButtonLoeschen v-if="userRoleAccess" @delete-confirmed="onDelete"
            >Löschen</ButtonLoeschen
          >
          <ButtonBearbeiten v-if="userRoleAccess(['politician'])" @click="onCopy" color="green"
            >In meine Datenbank kopieren</ButtonBearbeiten
          >
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ClimateForm from '@/components/form/ClimateForm.vue'
import Checkbox from 'primevue/checkbox'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import ButtonDownload from '@/components/ui/ButtonDownload.vue'

const isPublished = ref(false)
const editMode = ref(false)
const authStore = useAuthStore()

const props = defineProps({
  item: Object
})

onMounted(() => {
  isPublished.value = props.item.isPublished
})

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const toggleIsPublished = () => {
  isPublished.value = !isPublished.value
  onPublish()
}

const checkLastEditor = () => {
  let check = false
  if (props.item.lastEditor && props.item.author) {
    check = props.item.lastEditor.id !== props.item.author.id
  }
  return check
}

const userRoleAccess = (forRoles = ['administration']) => {
  return forRoles.includes(authStore.userRole)
}

const administrationDate = computed(() => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(props.item.administrationDate).toLocaleDateString('de-DE', options)
})

const emit = defineEmits(['update-item', 'delete-item', 'copy-item', 'publish-item', 'export-item'])

const onPublish = () => {
  emit('publish-item', { modelId: props.item.id, values: { isPublished: isPublished.value } })
}

const onUpdate = (values) => {
  emit('update-item', values)
}

const onExport = () => {
  emit('export-item', props.item.id)
}

const onDelete = () => {
  emit('delete-item', props.item.id)
}

const onCopy = () => {
  emit('copy-item', props.item.id)
}
</script>

<style></style>
