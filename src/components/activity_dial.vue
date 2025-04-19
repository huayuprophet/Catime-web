<template>
    <div>
        v-if=true
    </div>
    <div class="active-title">

    </div>
    <el-progress class="active-body" type="circle" :percentage="progress" v-show="actives.valuable">
        {{ timer.show }}
    </el-progress>
    <div>
        <el-text>
            {{ timer }}
        </el-text>
    </div>
</template>
<script setup>
import { computed } from 'vue';
// import { useTimerStore } from '@/store/timer';
import { useActiveTimerStore, useTimerStore } from '@/stores/timerStore'
// const timer = useTimerStore()
const actives = useActiveTimerStore()
const { timer } = actives
const progress = computed(() => {
    if (timer.count_up) {
        return 50
    } else {
        return timer.show / timer.time * 100
    }
})

</script>