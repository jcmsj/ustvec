<template>
  <div class="p-2">
    <div class="text-3xl">
    US Tourist VISA Eligibility Checker
  </div>
  <main class="">
    <div>
      <div v-if="shouldAccept">
        Eligible
      </div>
      <div v-else>
        Ineligible
      </div>
    </div>
    <!-- <FormKit type="form" @submit="onSubmit" #default="{value}">
      <div class="text-3xl divider divider-primary">General</div>
      <ConditionComp v-for="c in TravelRejection" :condition="c" @change="push">
      
      </ConditionComp>
      <details>
        <pre>
          {{ rejections.value }}
        </pre>
        <pre>{{ value }}</pre>
      </details>
    </FormKit>
  -->
  <FormKit type="form" @submit="onSubmit"  #default="{value}">
    <FormKitSchema v-bind="general" />
      <div class="text-3xl divider divider-primary">Proving Ties</div>
    <FormKitSchema v-bind="strongTies" />
      <details>
        <pre>{{ value }}</pre>
      </details>
      <div class="text-xl divider">Personal Assets</div>
      <PersonalAssetInputList />
      <div class="text-xl divider">Organization Memberships</div>
      <OrganizationMembershipList />
    </FormKit>
    {{ data }}
  </main>
  </div>
</template>
<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { computed, ref } from 'vue';
import PersonalAssetInputList from './components/PersonalAssetInputList.vue';
import OrganizationMembershipList from './components/OrganizationMembershipList.vue';
import { strongTies } from './knowledgebase/ties';
import { acceptsEvaluations,general } from './knowledgebase/general';
const {data} = acceptsEvaluations
const shouldAccept = computed(() => [...data.value.values()].every(t => t === true))
const hideEval  = ref(true)
function onSubmit(data:{travel_purpose:string}) {
  console.log(data)
    hideEval.value = false;
}
function push(key:string, v:any) {
  console.log(key,v)
  // rejections.value.set(key, v)
}
</script>

