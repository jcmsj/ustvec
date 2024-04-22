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
      <FormKit type="form" v-if="state == 'general'" @submit="onSubmit">
        <FormKitSchema v-bind="general" />
      </FormKit>
      <FormKit type="form" @submit="onSubmit" v-if="state == 'ties'" #default="{ value }">
        <div class="text-3xl divider divider-primary">Proving Ties</div>
          <Evaluation :value />
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
        <details>
          <pre>{{ value }}</pre>
        </details>
      </FormKit>
    </main>
  </div>
</template>
<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { ref } from 'vue';
import { general } from './knowledgebase/general';
import PersonalAssetInputList from './components/PersonalAssetInputList.vue';
import OrganizationMembershipList from './components/OrganizationMembershipList.vue';
import { strongTies } from './knowledgebase/ties';
import Evaluation from "./components/Evaluation.vue";
function onSubmit(data) {
  state.value = 'ties'
}

const state = ref<"general" | "ties" | "travel">("general")
function push(key: string, v: any) {
  console.log(key, v)
}
</script>
