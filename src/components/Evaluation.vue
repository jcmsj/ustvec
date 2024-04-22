<template>
    <div class="sticky top-0 bg-base-100 p-4 z-10 flex gap-x-8">
        {{ score }}
        {{ category }}
        <progress :class="progressType" class="progress w-max" :value=score :max="100"> </progress>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { evaluateApplicant } from "../inference";
const {value} = defineProps<{
  value: any
}>()
const evaluations = computed(() => evaluateApplicant(value.general, value.ties, value.organizations, value.assets))

const score = computed(() => {
    return Math.min(Math.max(0,evaluations.value.reduce((acc, curr) => acc + curr.score, 0)),100)
})
// <=0: Ineligible
// <25: Slightly Eligible
// <50: Eligible
// <75: Very Eligible
// <=100: Highly Eligible
const category = computed(() => {
    if (score.value <= 0) {
        return 'Ineligible'
    } else if (score.value < 25) {
        return 'Slightly Eligible'
    } else if (score.value < 50) {
        return 'Eligible'
    } else if (score.value < 75) {
        return 'Very Eligible'
    } else {
        return 'Highly Eligible'
    }
})
const progressType = computed(() => {
    if (score.value < 50) {
        return 'progress-error'
    } else if (score.value < 75) {
        return 'progress-warning'
    } else {
        return 'progress-success'
    }
})
</script>
