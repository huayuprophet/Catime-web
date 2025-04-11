<template>
    {{ refs.timer_show }}
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps(['refs'])
props.refs.timer_show=props.refs.timer_show ? props.refs.timer_show : 0

</script>