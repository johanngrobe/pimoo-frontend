<template>
  <div>
    <KlimarelevanzpruefungFormularFbFilter @submit="toggleFormular" />
    <KlimarelevanzpruefungFormularFb1 v-if="fb1" />
    <KlimarelevanzpruefungFormularFb2 v-if="fb2" />
    <KlimarelevanzpruefungFormularFb3 v-if="fb3" />
    <KlimarelevanzpruefungFormularFb4 v-if="fb4" />
    <KlimarelevanzpruefungFormularFb5 v-if="fb5" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KlimarelevanzpruefungFormularFbFilter from './KlimarelevanzpruefungFormularFbFilter.vue'
import KlimarelevanzpruefungFormularFb1 from './KlimarelevanzpruefungFormularFb1.vue'
import KlimarelevanzpruefungFormularFb2 from './KlimarelevanzpruefungFormularFb2.vue'
import KlimarelevanzpruefungFormularFb3 from './KlimarelevanzpruefungFormularFb3.vue'
import KlimarelevanzpruefungFormularFb4 from './KlimarelevanzpruefungFormularFb4.vue'
import KlimarelevanzpruefungFormularFb5 from './KlimarelevanzpruefungFormularFb5.vue'

const fb1 = ref(false)
const fb2 = ref(false)
const fb3 = ref(false)
const fb4 = ref(false)
const fb5 = ref(false)

const toggleFormular = (values) => {
  fb1.value = values.fb1
  fb2.value = values.fb2
  fb3.value = values.fb3
  fb4.value = values.fb4
  fb5.value = values.fb5
}
</script>

<style></style>
