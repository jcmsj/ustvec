<template>
    <pre>
        {{ value }}
    </pre>
</template>
<script setup lang="ts">
const props = defineProps<{
    value: any
}>()
</script>
