<template>
  <div>
    <BaseSubheading>Fragebogen 1</BaseSubheading>
    <form @submit.prevent="onSubmit" class="mt-4">
      <ol class="grid grid-cols-[11fr_1fr] gap-x-2 gap-y-6 items-center list-outside list-decimal">
        <li>Werden im Rahmen des Vorhabens Maschinen oder Materialen angeschafft?</li>
        <li>Was wurde hauptsächlich angeschafft?</li>
        <li>
          Wurde bei der Auswahl auf Nachhaltigkeitskriterien geachtet und sich ganz oder teilweise
          für eine klimaschonende Ausführung entschieden?
        </li>
        <li>Inwiefern?</li>
        <li>
          Warum wurde sich nicht für die nachhaltige Variante entschieden? Bitte begründen Sie kurz.
        </li>
      </ol>
      <ol>
        <li>Werden bauliche Maßnahmen durchgeführt?</li>
        <li>
          Worum handelt es sich bei dem Vorhaben? [Dropdown: Neubau, Anbau, Umbau, Sanierung,
          Abriss]
        </li>
        <li>Wird durch das Bauvorhaben ein bestehendes Gebäude energetisch aufgewertet?</li>
        <li>
          Welcher Energiestandard wird erreicht? [Dropdown: KfW-Effizienzhaus Denkmal,
          KfW-Effizienzhaus 115, KfW-Effizienzhaus 100, KfW-Effizienzhaus 85, KfW-Effizienzhaus 70,
          KfW-Effizienzhaus 55, KfW-Effizienzhaus 40 (Plus), Passivhaus (PHPP), kein Standard]
        </li>
        <li>Warum wurde sich für den genannten Energiestandard entschieden?</li>
        <li>
          Welcher Energiestandard wird erreicht? [Dropdown: KfW-Effizienzhaus 55, KfW-Effizienzhaus
          40 (Plus), Passivhaus (PHPP)]
        </li>
        <li>Warum wurde sich für den genannten Energiestandard entschieden?</li>
        <li>
          Wird bei dem Bauvorhaben darauf geachtet, dass Niederschlag möglichst vor Ort versickert?
        </li>
        <li>Warum nicht?</li>
        <li>
          Wird bei dem Vorhaben durch geeignete Maßnahmen der örtlichen Hitzebildung vorgebeugt? (z.
          B. Verschattungselemente oder Begrünung)
        </li>
        <li>Warum nicht?</li>
        <li>Wurde bei den Vergabekriterien auf Nachhaltigkeit geachtet?</li>
        <li>Warum nicht?</li>
      </ol>
      <ol>
        <li>Werden bei dem Vorhaben Flächen neu versiegelt?</li>
        <li>In welchem Umfang werden Flächen neu versiegelt? (Angabe in m^2)</li>
        <li>Wie wurde die Fläche bisher genutzt?</li>
        <li>Sind für die Versiegelung Ausgleichsmaßnahmen vorgesehen?</li>
        <li>In welcher Form und Umfang sind die Ausgleichsmaßnahmen vorgesehen?</li>
        <li>Warum nicht?</li>
      </ol>
      <ol>
        <li>Werden bei dem Vorhaben Flächen entsiegelt?</li>
        <li>In welchem Umfang werden Flächen entsiegelt? (Angabe in m^2)</li>
        <li>Wie wurde die Fläche bisher genutzt?</li>
        <li>Wird die Entsiegelung als Ausgleichsmaßnahme für ein anderes Vorhaben durchgeführt?</li>
      </ol>
      <ol>
        <li>
          Werden bei dem Vorhaben Grünflächen mit CO2-bindender Funktion aufgewertet? (Z.B. durch
          die Pflanung von Bäumen und Sträuchern)
        </li>
        <li>In welchem Umfang werden die Grünflächen aufgewertet?</li>
        <li>Wie wurde die Fläche bisher genutzt?</li>
        <li>Wird die Maßnahme als Ausgleichsmaßnahme für ein anderes Vorhaben durchgeführt?</li>
      </ol>
      <ol>
        <li>Wird im Rahmen des Vorhabens eine bestehende Begrünung entfernt?</li>
        <li>Wenn ja in welchem Umfang?</li>
        <li>Sind Ausgleichsmaßnahmen vorgesehen?</li>
        <li>In welcher Form und Umfang sind die Ausgleichsmaßnahmen vorgesehen?</li>
        <li>Warum nicht?</li>
      </ol>
      <ol>
        <li>
          Hat das Vorhaben in anderer Weise klimaschädliche Wirkung? (z.B. Kraftwerkbau, Abwärme,
          Wasserbedarf…)
        </li>
        <li>Inwiefern?</li>
      </ol>
      <ol>
        <li>
          Hat das Vorhaben in anderer Weise klimaschützende / Klimaresilienz fördernde Wirkung?
          (z.B. Wasserretention, Energiesparmaßnahme, Verkehrsregulierung)
        </li>
        <li>Inwiefern?</li>
      </ol>
      <div class="flex justify-end items-center mt-8">
        <ButtonSpeichern type="submit" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/indikator.js'
import ToggleSwitch from 'primevue/toggleswitch'
import ButtonSpeichern from '@/components/ButtonSpeichern.vue'

const { defineField, handleSubmit, setValues } = useForm({
  validationSchema: schema
})

const [fb1] = defineField('fb1')
const [fb2] = defineField('fb2')
const [fb3] = defineField('fb3')
const [fb4] = defineField('fb4')
const [fb5] = defineField('fb5')

const onSubmit = handleSubmit((values) => {
  console.log('Form Values:', values)
})
</script>

<style></style>
