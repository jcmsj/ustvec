<template>
  <div class="p-2">
    <div class="text-3xl">
    US Tourist VISA Eligibility Checker
  </div>
  <main class="">

    <div >
      <div v-if="shouldAccept">
        Eligible
      </div>
      <div v-else>
        Ineligible
      </div>
    </div>
    {{ rejections.value }}
    <FormKit type="form" @submit="onSubmit">
      <ConditionComp v-for="c in TravelRejection" :condition="c" @change="push">
      
      </ConditionComp>
    </FormKit>
  </main>
  </div>
</template>
<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { computed, reactive, ref } from 'vue';
import { TravelRejection } from "./utils/logic.ts"
import ConditionComp from './components/ConditionComp.vue';

const rejections = reactive({value: new Map()})
const shouldAccept = computed(() => [...rejections.value.values()].every(t => t === true))
const hideEval  = ref(true)
function onSubmit(data:{travel_purpose:string}) {
  console.log(data)
    hideEval.value = false;
}

function push(key:string, v:any) {
  console.log(key,v)
  rejections.value.set(key, v)
}
</script>
