<template>
    <template v-if="ctx?.state.valid">
    
    <!-- <Evaluation :value/> -->
    </template>
    <div v-else>
        Ineligible
    </div>
</template>
<script setup lang="ts">
import { useFormKitContext } from "@formkit/vue"

const ctx = useFormKitContext("general")
</script>
