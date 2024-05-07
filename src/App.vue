<template>
  <div class="p-2 flex flex-col items-center">
    <nav class="navbar text-3xl bg-base-100">
      <div class="flex-1 gap-x-4">
        US Tourist VISA Eligibility Checker
      </div>
      <div class="flex-none gap-2">
        <!-- purpose -->
        <button class="btn" onclick="goal_modal.showModal()">Read Goal</button>
        <button class="btn btn-warning" onclick="disclaimer_modal.showModal()">Read Disclaimer</button>
        <label class="swap swap-rotate">
          <!-- https://daisyui.com/components/theme-controller/#theme-controller-using-a-swap -->
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" class="theme-controller" value="emerald" />
          <ic-outline-wb-sunny class="swap-off w-10 h-10" />
          <ic-outline-dark-mode class="swap-on w-10 h-10" />
        </label>
      </div>
    </nav>
   
    <!-- Disclaimer -->
    <dialog id="disclaimer_modal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold text-warning">Disclaimer!</h3>
        <p class="py-4 text-justify">
          This is a prototype application. The use of this site or app does not in anyway establishes a lawyer-client relationship. Any information gathered as result of using this app does not constitute a legal advice. Please consult a legal professional.
        </p>
        <modal-tip />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <!-- Read goal -->
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="goal_modal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold text-primary">Goals</h3>
        <ol class="list-decimal p-4 space-y-2">
          <li class="list-item">
            Help you understand the general eligibility requirements for a US Visitor Visa, specifically the Tourism
            variant, also called <span class="text-primary">B-2 Visa</span>.
          </li>
          <li class="list-item">
            Guide you through the process of evaluating your ties to your home country and your travel itinerary.
          </li>
          <li class="list-item">
            Provide you with a certain idea of your eligibility before filling a <span class="text-bold">PAID</span> and
            <span class="text-bold">UNREFUNDABLE</span> application
            as well as tackling an actual interview with an immigration officer.
          </li>
        </ol>
        <modal-tip />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <main class="flex flex-col items-center">
      <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step" :class="{ 'step-primary': state === 'general' }" @click="state = 'general'">General Eligibility
        </li>
        <li class="step" :class="{ 'step-primary': state === 'ties' }" @click="state = 'ties'">Evaluation of ties to
          home</li>
        <li class="step" :class="{ 'step-primary': state === 'travel' }" @click="state = 'travel'">Travel Itinerary</li>
      </ul>
      <FormKit type="form" :form-class="{ 'hidden': hideGeneral }" :actions="false">
        <div class="text-3xl divider divider-primary">General</div>
        <FormKitSchema :schema="general.schema" :data="generalVal" />
      </FormKit>
      <FormKit type="form" :form-class="{ 'hidden': hideTies }" #default="{ value }" :actions="false">
        <div class="text-3xl divider divider-primary">Proving Ties</div>
        <FormKitSchema v-bind="strongTies">
        </FormKitSchema>
        <div class="text-xl divider">Personal Assets</div>
        <div class="flex flex-col gap-y-2 items-center">
          <PersonalAssetInputList />
        </div>
        <div class="text-xl divider">Organization Memberships</div>
        <div class="flex flex-col gap-y-2 items-center">
          <OrganizationMembershipList />
        </div>
        <TiesEvaluation :value />
      </FormKit>
      <TravelPlanList :travel-knowledge :class="{ 'hidden': hideTravel }" />
      <div class="join">
        <button @click="prev" class="join-item btn" :class="{ 'btn-disabled': !canPrev }">
          Previous
        </button>
        <button @click="next" class="join-item btn" :class="{ 'btn-disabled': !canNext }">
          Next
        </button>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { computed, ref } from 'vue';
import { general } from './knowledgebase/general';
import PersonalAssetInputList from './components/PersonalAssetInputList.vue';
import OrganizationMembershipList from './components/OrganizationMembershipList.vue';
import { strongTies } from './knowledgebase/ties';
import TiesEvaluation from "./components/TiesEvaluation.vue";
import TravelPlanList from './components/TravelPlanList.vue';
import defaultCsvUrl from "/cases.csv?url"
import { csvParse } from "d3-dsv"
import { computedAsync } from "@vueuse/core"
import { CSVEntry, transformKb } from './knowledgebase/travelplan';
import ModalTip from "./components/ModalTip.vue"
const generalVal = ref()
const state = ref<"general" | "ties" | "travel">("general")
const hideTies = computed(() => state.value != 'ties')
const hideTravel = computed(() => state.value != 'travel')
const hideGeneral = computed(() => state.value != 'general')
function next() {
  if (state.value === 'general') {
    state.value = 'ties'
  } else if (state.value === 'ties') {
    state.value = 'travel'
  }
}

function prev() {
  if (state.value === 'ties') {
    state.value = 'general'
  } else if (state.value === 'travel') {
    state.value = 'ties'
  }
}
const canNext = computed(() => {
  if (state.value === 'general') {
    return true
  } else if (state.value === 'ties') {
    return true
  } else {
    return false
  }
})

const canPrev = computed(() => {
  if (state.value === 'general') {
    return false
  } else if (state.value === 'ties') {
    return true
  } else {
    return true
  }
})

const csvUrl = ref(defaultCsvUrl)
async function fetchCsv(url: string): Promise<CSVEntry[]> {
  const response = await fetch(url)
  return csvParse(await response.text()) as any
}
const travelKnowledge = computedAsync(
  async () => fetchCsv(csvUrl.value).then(transformKb),
  {
    states: []
  }, {
  onError(e) {
    console.error(e)
  },
})
</script>
