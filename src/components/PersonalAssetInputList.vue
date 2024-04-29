<template>
    <FormKit type="list" name="assets" :value="assets" dynamic #default="{ items, node, value }">
        <FormKit type="group" v-for="(item, index) in items" :key="item" :index="index" >
            <div class="group group-format">
                <FormKit type="text" name="name" label="Asset name" validation="required" />
                <FormKit type="select" name="type" :options="assetTypeSchema" label="Asset Type" validation="required">
                </FormKit>
                <FormKit type="number" name="valueDollars" label="Asset value ($)" validation="required" min="0" />
                <button type="button" class="btn" @click="() => node.input(value.filter((_, i) => i !== index))">
                    - Remove
                </button>
            </div>
        </FormKit>
        <button type="button" class="btn btn-secondary justify-self-center" @click="() => node.input(value.concat({}))">
            + Add asset
        </button>
    </FormKit>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Asset } from "../inference";
import { assetTypeSchema } from "../knowledgebase/ties";
const assets = ref<Partial<Asset>[]>([{}])
</script>
<style scoped>
@import '../css/listGroup.css';
</style>
