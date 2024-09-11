<template>
  <div class="flex">
    <h1>Neuer Klimacheck</h1>
    <div class="text-right ms-auto mt-3">
      <BaseButton @click="refreshPage()" outline="true"
        ><IconRefresh class="me-1" height="20" /><span class="text-left w-18"
          >Zurücksetzen</span
        ></BaseButton
      >
    </div>
  </div>
  <BaseCard :collapsible="true" :isCollapsed="formInfoCollapsed">
    <template #title>
      <div @click="toggleFormInfo">
        <h3>Informationen zum Formular</h3>
      </div>
    </template>
    Das Kyoto-Protokoll nennt sechs Treibhausgase: Kohlendioxid (CO2), Methan (CH4), und Lachgas
    (N2O) sowie die fluorierten Treibhausgase (F-Gase): wasserstoffhaltige Fluorkohlenwasserstoffe
    (HFKW), perfluorierte Kohlenwasserstoffe (FKW), und Schwefelhexafluorid (SF6). Ab 2015 wird
    Stickstofftrifluorid (NF3) zusätzlich einbezogen. Die verschiedenen Gase tragen nicht in
    gleichem Masse zum Treibhauseffekt bei und verbleiben über unterschiedlich lange Zeiträume in
    der Atmosphäre. Um die Wirkung verschiedener Treibhausgase vergleichbar zu machen, können
    Treibhausgase in CO2-Äquivalente umgerechnet und zusammengefasst werden. CO2-Äquivalente werden
    mit der Abkürzung «CO2e» bezeichnet.
  </BaseCard>
  <BaseCard>
    <ClimateForm />
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import ClimateForm from '@/components/form/ClimateForm.vue'
import IconRefresh from '@/assets/icons/MaterialSymbolsRefresh.svg?component'
import { useRouter } from 'vue-router'

const router = useRouter()

const refreshPage = () => {
  router.go() // Reloads the current route
}

const formInfoCollapsed = ref(true)

const toggleFormInfo = () => {
  formInfoCollapsed.value = !formInfoCollapsed.value
}
</script>
