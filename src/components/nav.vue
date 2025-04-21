<template>
    <div class="nav">
        <ElSpace>
            <ElText>catime-web </ElText>
            <ElText> {{ yyyymmddhhmmss_now }} </ElText>
            <ElLink @click="timer.active = -1" :type="!is_active ? 'success' : 'default'"><ElIcon><Upload /></ElIcon> 激活 </ElLink>
        </ElSpace>



    </div>
</template>

<script setup>
import { useTimerStore } from '@/stores/timerStore';
import { timestamp_to_datetime } from '@/time_function';
import { ElIcon } from 'element-plus';
import { computed } from 'vue';
import { Upload } from '@element-plus/icons-vue';

const timer = useTimerStore()
// 实时时间显示
const yyyymmddhhmmss_now = computed(() => {
    return timestamp_to_datetime(timer.now)
})
const is_active = computed(() => {
    return timer.get_timer(timer.active) ? true : false
})
</script>
<style scoped>
.nav {
    padding-top: 1rem;
    padding-bottom: 1rem;
}
</style>