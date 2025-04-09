<template>
    <div>
        <div v-if="!is_stop">
            <ElSpace>
                <ElText>描述: {{ name }}</ElText>
                <ElText v-if="!timer.count_up">
                    倒计时：{{ timer_show }}/{{ time_memory }}
                </ElText>
                <ElText v-if="timer.count_up">
                    正计时：{{ timer_show }}
                </ElText>
                <ElText>状态: {{ state }}</ElText>
                <ElButtonGroup>
                    <ElButton @click="pause_continue_click" :type="is_pause ? 'info' : 'primary'"
                        :bg="is_pause ? true : false" plain>
                        <ElIcon>
                            <VideoPlay v-show="is_pause">
                            </VideoPlay>
                            <VideoPause v-show="!is_pause"></VideoPause>
                        </ElIcon>
                        {{ is_pause ? '继续' : '暂停' }}
                    </ElButton>
                    <ElButton @click="reset" plain>
                        <ElIcon>
                            <RefreshRight />
                        </ElIcon>
                        重新开始
                    </ElButton>
                    <ElButton @click="set_count_stop" type="warning" plain>
                        <ElIcon>
                            <Close></Close>
                        </ElIcon>
                        停止
                    </ElButton>
                    <slot></slot>
                </ElButtonGroup>
            </ElSpace>
        </div>
        <div v-if="is_stop">
            <ElSpace>
                <ElText type="info">已停止</ElText>
                <ElButton @click="reset">
                    <ElIcon>
                        <RefreshRight />
                    </ElIcon>
                    重新开始
                </ElButton>
                <slot></slot>
            </ElSpace>
        </div>
        <ElDivider></ElDivider>
    </div>
</template>
<script setup>
import { inject, ref, computed } from 'vue';
import { VideoPause, VideoPlay, RefreshRight, Close } from '@element-plus/icons-vue';
const props = defineProps(['timer'])
// 实时时间-毫秒级时间戳
const now = inject('now')
// const timer = ref({
//     time_0: 1,
//     time: 6,
//     // 是否正计时类型
//     count_up: false
// })
const name = ref('666')
// const name=computed(()=>{
//     let q1= '时分秒'
//     let q2=timer.value.count_up?'正计时':'倒计时'
//     let q3= '多久'
// })
// 牢记原始倒计时时间
const time_memory = ref(props.timer.time)
// 倒计时结束时间
const time_1 = computed(() => {
    return props.timer.time_0 + props.timer.time
})
// 正计时时间
const timing = computed(() => {
    return now.value - props.timer.time_0
})
// 剩余倒计时时间
const down = computed(() => {
    return time_1.value - now.value
})
// 展示的倒计时时间
const timer_show = computed(() => {
    // 暂停时显示暂停值
    if (is_pause.value) {
        return props.timer.time
    }
    // 正计时显示正计时的时间
    if (props.timer.count_up) {
        return timing.value
    }
    if (timeout.value) {
        return '已完成'
    }
    // 倒计时时间
    return down.value
})
// 倒计时是否超时
const timeout = computed(() => {
    if (props.timer.count_up) {
        // 忽略正计时超时
        return false
    }
    if (down.value <= 0) {
        return true
    }
})
// 状态文本
const state = computed(() => {
    let counting_state = props.timer.count_up ? '正计时中' : '倒计时中'
    if (is_pause.value) {
        return '暂停中'
    }
    if (timeout.value) {
        return '已结束'
    }
    return counting_state
})
// 暂停倒计时
const is_pause = ref(false)
function count_down_pause() {
    is_pause.value = true
    props.timer.time = down.value
}
// 继续倒计时
function count_down_continue() {
    props.timer.time_0 = now.value;
    is_pause.value = false
}
// 暂停继续倒计时按钮点击事件
function count_down_button_click() {
    if (is_pause.value) {
        count_down_continue()
    } else {
        count_down_pause()
    }
}
// 暂停正计时
function count_up_pause() {
    is_pause.value = true
    props.timer.time = timing.value
}
// 继续正计时
function count_up_continue() {
    props.timer.time_0 = now.value - props.timer.time
    is_pause.value = false
}
// 暂停继续正计时按钮点击事件
function count_up_button_click() {
    if (is_pause.value) {
        count_up_continue()
    } else {
        count_up_pause()
    }
}
// 暂停按钮点击事件
function pause_continue_click() {
    // 检查是倒计时还是正计时
    if (props.timer.count_up) {
        count_up_button_click()
    } else {
        count_down_button_click()
    }
}
// 停止计时
const is_stop = ref(false)
function set_count_stop() {
    is_stop.value = true
}
// 手动设置计时事项
function timer_from(obj) {
    props.timer.time_0 = obj.time_0
    props.timer.time = obj.time
    props.timer.count_up = obj.count_up
    time_memory.value = obj.time
    is_pause.value = false
}
// 重设计时事项
function reset() {
    props.timer.time_0 = now.value;
    props.timer.time = time_memory.value
    is_pause.value = false
    is_stop.value = false
}

defineExpose({  })
</script>
