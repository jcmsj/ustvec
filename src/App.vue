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
      <form @submit.prevent="onSubmitTravel({plan})" v-if="state == 'travel'" class="form-control" >
          <textarea v-model="plan" name="plan" id="plan" cols="30" rows="10" class="resize textarea textarea-ghost" required></textarea>
          <button type="submit" class="btn">Submit</button>
      </form>
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
const plan = ref('')
async function onSubmitTravel(data:{plan:string}) {
  // `
  //     New york, california + central park, statue of liberty, empire state building, golden gate bridge
  //   + explore, chill, relax, buy, shop, shopping, acquire, get, eat, dine, lunch, dinner, sight seeing fvdfbsgrbetyh swimming
  //     `
  const response = await fetch('http://localhost:8000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'plan': data.plan
    })
  })
  console.log(await response.text())
}
</script>
