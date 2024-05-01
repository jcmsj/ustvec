<template>
  <div class="p-2 flex flex-col items-center">
    <nav class="navbar text-3xl bg-base-100">
      <div class="flex-1 gap-x-4">
        US Tourist VISA Eligibility Checker
      </div>
        <div class="flex-none gap-2">
        <label class="swap swap-rotate">
          <!-- https://daisyui.com/components/theme-controller/#theme-controller-using-a-swap -->
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" class="theme-controller" value="emerald" />
          <ic-outline-wb-sunny class="swap-off w-10 h-10" />
          <ic-outline-dark-mode class="swap-on w-10 h-10" />
        </label>
      </div>
    </nav>
    <main class="flex flex-col items-center">
      <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step" :class="{ 'step-primary': state === 'general' }" @click="state = 'general'">General Eligibility
        </li>
        <li class="step" :class="{ 'step-primary': state === 'ties' }" @click="state = 'ties'">Evaluation of ties to
          home</li>
        <li class="step" :class="{ 'step-primary': state === 'travel' }" @click="state = 'travel'">Travel Itinerary</li>
      </ul>
      <FormKit type="form" v-if="state == 'general'" :actions="false">
        <FormKitSchema v-bind="general" />
      </FormKit>
      <FormKit type="form"v-if="state == 'ties'" #default="{ value }" :actions="false">
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
      <TravelPlanList v-if="state == 'travel'" />
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

const state = ref<"general" | "ties" | "travel">("general")

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
</script>
