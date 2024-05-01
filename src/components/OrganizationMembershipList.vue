<template>
    <FormKit type="list" name="organizations" :value="memberships" dynamic #default="{ items, node, value }">
        <FormKit type="group" v-for="(item, index) in items" :key="item" :index="index">
            <div class="group-format group ">
                <FormKit type="text" name="name" label="Organization name" validation="required" />
                <FormKit type="date" name="memberSince" label="Member since" validation="required" />
                <FormKit type="date" name="membershipExpiry" label="Membership expiry"
                    validation="required|afterInputDate:memberSince" />
                <RemoveBtn @click="() => node.input(value.filter((_, i) => i !== index))" />
            </div>
        </FormKit>
        <button type="button" class="btn btn-secondary justify-self-center" @click="() => node.input(value.concat({}))">
            + Add organization
        </button>
    </FormKit>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import RemoveBtn from "./RemoveBtn.vue";

interface OrganizationMembership {
    name: string
    memberSince: Date
    membershipExpiry: Date
}
const memberships = ref<Partial<OrganizationMembership>[]>([{}])
</script>
<style scoped>
@import '../css/listGroup.css';
</style>
