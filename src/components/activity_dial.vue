<template>
    <div>
        v-if=true
    </div>
    <div class="active-title">

    </div>
    <el-progress class="active-body" type="circle" :percentage="progress">
        {{ show }}
    </el-progress>
    <div>
        <el-text>
            {{ timer }}
        </el-text>
    </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { useActiveTimerStore, useTimerStore } from '@/stores/timerStore'
import { ms_to_time } from '@/time_function';
import { storeToRefs } from 'pinia';
const timers = useTimerStore()
const active = timers.active
// const { timer } = storeToRefs(actives)
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
</script>