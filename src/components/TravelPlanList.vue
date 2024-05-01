<template>
    <div class="pb-8">
        <FormKit type="form" form-class="flex flex-col gap-y-2 items-center" @submit="onSubmit">
            <div class="text-xl divider divider-primary">Travel Itinerary</div>
            <FormKit type="list" name="plan" :value="plan" dynamic #default="{ items, node, value }">
                <FormKit type="group" v-for="(item, index) in items" :key="item" :index="index">
                    <div class="group group-format">
                        <FormKit type="select" name="country_division" :options="USStates" label="US State "
                            validation="required" />
                        <FormKit type="text" name="point_of_interest" label="Point of interest" validation="required"
                            help="A popular landmark" />
                        <FormKit type="text" name="related_actions_tags" label="Related actions" validation="required"
                            help="comma separated actions." />
                        <RemoveBtn @click="() => node.input(value?.filter((_, i) => i !== index))" />
                    </div>
                </FormKit>
                <button type="button" class="btn btn-secondary justify-self-center"
                    @click="() => node.input(value?.concat({}))">
                    + Add Location
                </button>
            </FormKit>
        </FormKit>
        <div v-if="validations.length">
            <div class="text-xl divider divider-primary">Evaluation</div>
            <template v-if="groupedByReason.ACTION.length > 0">
                <div class="text-xl divider divider-secondary">Anomalous Actions</div>
                Discrepancy in related actions:
                <ul class="list-disc text-error">
                    <li class="list-item" v-for="r in groupedByReason.ACTION">
                        {{ r.input.related_actions_tags }}
                    </li>
                </ul>
                These actions are not application to any of your points of interests.
            </template>
            <template v-if="groupedByReason.POINT.length > 0">
                <div class="text-xl divider divider-secondary">Anomalous Points of interests</div>
                Discrepancies in the following location/s:
                <ul class="list-disc text-error">
                    <li class="list-item" v-for="r in groupedByReason.POINT">
                        {{ r.input.point_of_interest }}
                    </li>
                </ul>

                These do not exist in the given US states.
            </template>
            <template v-if="groupedByReason.STATE.length > 0">
                <div class="text-xl divider divider-secondary">Anomalous States</div>
                The following are not US states
                <ul class="list-disc text-error">
                    <li class="list-item" v-for="r in groupedByReason.STATE">
                        {{ r.input.country_division }}
                    </li>
                </ul>
            </template>
            <template v-if="validItenirary">
                Your travel plan is valid.
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { LocationInput, USStates, travelKnowledge, validateInput, ValidationOutput, InvalidState } from "../knowledgebase/travelplan.ts"
import { FormKitGroupValue } from "@formkit/core";
import RemoveBtn from "./RemoveBtn.vue";
const plan = ref<Partial<LocationInput & FormKitGroupValue>[]>([{}])
const validations = ref<ValidationOutput[]>([])
type InvalidRecord = Record<InvalidState['reason'], ValidationOutput[]>
const groupedByReason = computed<InvalidRecord>(() => groupByReason(validations.value))
const validItenirary = computed(() => [
    groupedByReason.value.ACTION.length,
    groupedByReason.value.POINT.length,
    groupedByReason.value.STATE.length,
].every(len => len == 0) &&
    validations.value.length > 0)
function groupByReason(vs: ValidationOutput[]) {
    const grouped: InvalidRecord = {
        ACTION: [],
        POINT: [],
        STATE: []
    }
    vs.forEach(v => {
        if (v.validation.state == 'INVALID') {
            grouped[v.validation.reason].push(v)
        }
    })
    return grouped
}
function onSubmit(data: { plan: LocationInput[] }) {
    validations.value = data.plan.map(input => {
        return {
            input,
            validation: validateInput(input, travelKnowledge.value)
        };
    })
}
</script>
<style scoped>
@import '../css/listGroup.css';
</style>
