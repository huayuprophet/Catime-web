<template>
    <div class="active-title">
    
    </div>
    <el-progress class="active-body" type="circle" :percentage="template.progress">
        {{ template.text }}
    </el-progress>
    <div>isdown {{ is_counting_down }}</div>
</template>
<script setup>
import { computed } from 'vue';
// import { useTimerStore } from '@/store/timer';
import { useActiveTimerStore, useTimerStore } from '@/stores/timerStore'
const timer = useTimerStore()
const active_timer = useActiveTimerStore()
const { template } = active_timer
const title = computed(() => {
    return template.text
})
const is_counting_down = computed(() => {
    if (!active_timer.valuable) {
        console.log(1);
        return false
    }
    if (timer.timers[template.index]?.count_up ?? false) {
        return false
    }
    if (template.type === 2) {
        console.log(3);
        return false
    }
    return true
})
</script>