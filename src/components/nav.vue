<template>
    <div class="nav">
        <ElSpace>
           
           <ElText>catime-web       </ElText>

            <ElText> {{ yyyymmddhhmmss_now }} </ElText>
            <ElLink> 激活 </ElLink>
        </ElSpace>



    </div>
</template>

<script setup>
// import { storeToRefs } from 'pinia';
import { useTimerStore } from '@/stores/timerStore';
import { timestamp_to_datetime } from '@/time_function';
import { computed } from 'vue';

const timer = useTimerStore()
// 当前时间
// const now = storeToRefs(timer).now
// 实时时间显示
const yyyymmddhhmmss_now = computed(() => {
    return timestamp_to_datetime(timer.now)
})
</script>
<style scoped>
.nav {

    padding-top: 1rem;
    padding-bottom: 1rem;
}
</style>