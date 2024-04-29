<template>
    <div class="bg-base-100 p-4 z-10 flex flex-col gap-x-8 text-center">
        <h2 class="text-xl divider divider-primary">Evaluation:</h2>
        <div class="stat text-2xl">
            <div class="stat-title">You have a/an</div>
            <div class="stat-value" :class="statType">
                {{ category }}
            </div>
            <div class="stat-title">tie to your home country.</div>
            <div class="stat-title ">
                <progress :class="progressType" class=" progress h-4 w-max self-center text-2xl" :value=score :max="100">
                </progress>
            </div>
            <div class="stat-title">You scored</div>
            <div class="stat-value text-primary">
                {{ roundedScore }}%
            </div>
            <div class="stat-title">in the evaluation.</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { evaluateApplicant } from "../inference";
const { value } = defineProps<{
    value: any
}>()
const evaluations = computed(() => evaluateApplicant(value.general, value.ties, value.organizations, value.assets))

const score = computed(() => {
    return Math.min(Math.max(0, evaluations.value.reduce((acc, curr) => acc + curr.score, 0)), 100)
})
// round to 2 decimal places
const roundedScore = computed(() => Math.round(score.value * 100) / 100)

const category = computed(() => {
    if (score.value <= 0) {
        return 'Very weak'
    } else if (score.value <= 25) {
        return 'Weak'
    } else if (score.value <= 50) {
        return 'Acceptable'
    } else if (score.value <= 75) {
        return 'Strong'
    } else {
        return 'Very strong'
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

const statType = computed(() => {
    if (score.value < 50) {
        return 'text-error'
    } else if (score.value < 75) {
        return 'text-warning'
    } else {
        return 'text-success'
    }
})
</script>
