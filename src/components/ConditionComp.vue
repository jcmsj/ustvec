<template>
  <div>
    <FormKit v-if="condition.type == 'select'" 
    v-model="value"
     :label="condition.description" :options="wrap"
        type="select" :name="condition.id"
        validation="required"
      >
    </FormKit>
    <FormKit v-else-if="condition.type == 'date'" :type="condition.type"  :label="condition.description" :name="condition.id"
    v-model="value"
    validation="required"
    >
    </FormKit>
    <ConditionComp v-for="c in reason?.children" :condition="c" v-if="reason?.children.length" 
    @change="(cond,v) => emit('change', cond,v)"
    />
  </div>
</template>
<script setup lang="ts" generic="Input , ID extends string, EvalReturn">
import { computed, ref, watch } from 'vue';
import { type Condition } from "../utils/logic.ts"
const {condition} = defineProps<{condition:Condition<Input, ID, EvalReturn, Condition<Input, ID, EvalReturn, any>>}>()
const wrap = computed(() => condition.children.map(t => t.description))
const value = ref<string>()
const reason = computed(() => condition.children.find(t => t.description == value.value))
const err = computed( () => {
  if (condition.type == 'select' ) {
    return reason.value?.evaluate(null as any)
  }
  // WARNING TYPE XD
  return condition.evaluate(value.value as any);
}, {
  onTrigger(event) {
    console.log(event.oldValue, event.newValue, )
  },
})
const emit = defineEmits<{
  change: [cond:string, v:EvalReturn]
}>()

watch(err, (er) => {
  if (er !== undefined) {
    emit('change',condition.id,  er) 
  }
})
</script>
