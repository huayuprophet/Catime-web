<template>
    <div class="active-title">

    </div>
    <el-progress v-if="valuable" class="active-body" type="circle" :percentage="progress">
        {{ show }}
    </el-progress>
    <div style="font-size: 3rem;" v-if="!valuable">
        {{ now_show }}
    </div>
    <div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useTimerStore } from '@/stores/timerStore'
import { ms_to_time, timestamp_to_time } from '@/time_function';
const timers = useTimerStore()
const timer = computed(() => {
    const result = timers.get_timer(timers.active)
    if (result) {
        return result
    }
    return false
})
const valuable = computed(() => {
    if (timer.value) {
        return true
    } else {
        return false
    }
})
const progress = computed(() => {
    // 失效、删除时为未激活，返回0，避免NaN
    if (!valuable.value) {
        return 0
    } else {
        const result = timer.value.show / timer.value.time * 100
        return result
    }
})
const show = computed(() => {
    return ms_to_time(timer.value.show)
})
const now_show = computed(() => {
    return timestamp_to_time(timers.now)
})
</script>