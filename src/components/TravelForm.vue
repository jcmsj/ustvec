<template>
  <FormKit type="form" @submit="onSubmitTravel" #default="{ value }">
    <div class="text-xl divider divider-primary">Travel Itinerary</div>
    <div class="flex flex-col gap-y-2 items-center">
      <TravelPlanList />
    </div>
    <PlanEvaluation :value="evaluation" />
  </FormKit>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PlanEvaluation from "./PlanEvaluation.vue"
import TravelPlanList from './TravelPlanList.vue';
import { LocationInput } from '../knowledgebase/travelplan';

const evaluation = ref<Record<string, any>>()
async function onSubmitTravel(data: { plan: LocationInput[] }) {
  console.log(data)
  // combine all in a string
  const plan = data.plan.map((p) => {
    return `${p.country_division}+ ${p.point_of_interest} + ${p.related_actions_tags}`
  }).join('\n')
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
      'plan': plan
    })
  })
  evaluation.value = await response.text()
}
</script>
