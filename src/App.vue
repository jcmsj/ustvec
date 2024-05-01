<template>
  <div class="p-2 flex flex-col items-center">
    <div class="text-3xl">
      US Tourist VISA Eligibility Checker
    </div>
    <main class="flex flex-col items-center">
      <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step" :class="{ 'step-primary': state === 'general' }" @click="state = 'general'">General Eligibility
        </li>
        <li class="step" :class="{ 'step-primary': state === 'ties' }" @click="state = 'ties'">Evaluation of ties to
          home</li>
        <li class="step" :class="{ 'step-primary': state === 'travel' }" @click="state = 'travel'">Travel Itinerary</li>
      </ul>
      <FormKit type="form" v-if="state == 'general'" @submit="onSubmit" :actions="false">
        <FormKitSchema v-bind="general" />
      </FormKit>
      <FormKit type="form" @submit="onSubmit" v-if="state == 'ties'" #default="{ value }" :actions="false">
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
      <TravelPlanList  v-if="state=='travel'" />
      <div class="join">
          <button @click="prev" class="join-item btn" :class="{'btn-disabled':!canPrev}">
            Previous
          </button>
          <button @click="next" class="join-item btn" :class="{'btn-disabled':!canNext}">
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
import { transformKb } from './knowledgebase/travelplan';

function onSubmit(data) {
  state.value = 'ties'
}

const state = ref<"general" | "ties" | "travel">("general")
function push(key: string, v: any) {
  console.log(key, v)
}
function onSubmitTravel(data) {
  state.value = 'ties'
}


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

transformKb()
</script>
