<template>
    <FormKit type="list" name="plan" :value="assets" dynamic #default="{ items, node, value }">
        <FormKit type="group" v-for="(item, index) in items" :key="item" :index="index" >
            <div class="group group-format">
                <FormKit type="select" name="country_division" :options="USStates" label="US State " validation="required" />
                <FormKit type="text" name="point_of_interest" label="Point of interest" validation="required" help="A popular landmark" />
                <FormKit type="text" name="related_actions_tags" label="Related actions" validation="required" help="comma separated actions." />
                <button type="button" class="btn" @click="() => node.input(value.filter((_, i) => i !== index))">
                    - Remove
                </button>
            </div>
        </FormKit>
        <button type="button" class="btn btn-secondary justify-self-center" @click="() => node.input(value.concat({}))">
            + Add Location
        </button>
    </FormKit>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {Location,USStates} from "../knowledgebase/travelplan.ts"
const assets = ref<Partial<Location>[]>([{}])
</script>
<style scoped>
@import '../css/listGroup.css';
</style>
