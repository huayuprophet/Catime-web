<template>
    <div>
        <ElDescriptions :column="5">
            <ElDescriptionsItem label="描述">
                {{ timer.des }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="!timer.count_up" label="倒计时">
                {{ timer_show }}/{{ time_memory_show }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="timer.count_up" label="正计时">
                {{ timer_show }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="状态">
                <ElTag :type="state_type">
                    {{ state }}
                </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="创建时间">{{ created_at_show }}</ElDescriptionsItem>
            <ElDescriptionsItem label="操作">
                <ElButtonGroup>
                    <ElButton @click="pause_continue_click" :type="is_pause ? 'info' : 'primary'"
                        :bg="is_pause ? true : false" plain :disabled="is_timeout || is_stop">
                        <ElIcon>
                            <VideoPlay v-show="is_pause"></VideoPlay>
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
            </ElDescriptionsItem>
        </ElDescriptions>
        <ElDivider></ElDivider>
    </div>
</template>
<script setup>
import { inject, ref, computed, watch, onMounted } from 'vue';
import { VideoPause, VideoPlay, RefreshRight, Close } from '@element-plus/icons-vue';
import { ms_to_time, timestamp_to_datetime } from '@/time_function';
// 导入组件计时项目对象-props
// 导入对象索引
const props = defineProps(['timer', 'index'])
// 导入状态、声明函数
props.timer.state_code = props.timer.state_code ? props.timer.state_code : 0
const is_pause = ref(props.timer.state_code == 1)
const is_stop = ref(props.timer.state_code == 3)
// 导入并牢记原始倒计时时间
if (props.timer.count_up) {
    // 正计时的时候不导入，以实现重设时为0
    props.timer.time_memory = 0
} else {
    props.timer.time_memory = props.timer.time_memory ? props.timer.time_memory : props.timer.time
}
const time_memory_show = computed(() => {
    return ms_to_time(props.timer.time_memory)
})
// 实时时间-毫秒级时间戳
const now = inject('now')
// 以下导入props原对象属性的所有内容
// 计时器创建时间-默认值为当前时间
props.timer.created_at = props.timer.created_at ? props.timer.created_at : now.value
// 适合展示的创建时间
const created_at_show = computed(() => {
    return timestamp_to_datetime(props.timer.created_at)
})
// 计时器开始时间-默认值为当前时间
props.timer.time_0 = props.timer.time_0 ? props.timer.time_0 : now.value
// 计时器描述
props.timer.des = props.timer.des ? props.timer.des
    : '66';
// 缓存的需跳过时间-暂停继续时使用 默认为0毫秒
props.timer.jump = props.timer.jump ? props.timer.jump : 0
//     let q1= '正倒计时时分秒'
// 倒计时结束时间
const time_1 = computed(() => {
    return props.timer.time_0 + props.timer.time + props.timer.jump
})
// 正计时时间
const timing = computed(() => {
    return now.value - props.timer.time_0 + props.timer.jump
    // return now.value - props.timer.time_0
})
// 剩余倒计时时间、超时时间。
const down = computed(() => {
    // return Math.abs()
    return time_1.value - now.value
})
// 展示的倒计时时间
const timer_show = computed(() => {
    // 暂停时显示暂停值
    if (is_pause.value) {
        // return ms_to_time(props.timer.time)
        return ms_to_time(props.timer.jump)
    }
    if (is_stop.value) {
        return '计时已停止'
    }
    // 正计时显示正计时的时间
    if (props.timer.count_up) {
        return ms_to_time(timing.value)
    }
    if (is_timeout.value) {
        return '已完成, 超出' + ms_to_time(Math.abs(time_1.value - now.value)) + ''
    }
    // 倒计时时间
    return ms_to_time(down.value)
})
// 倒计时是否超时
const is_timeout = computed(() => {
    if (props.timer.count_up) {
        // 忽略正计时超时
        return false
    }
    if (is_pause.value || is_stop.value) {
        // 忽略暂停、停止期间的超时事项
        return false
    }
    if (down.value <= 0) {
        // 超时
        return true
    }
})
// 状态文本
const state = computed(() => {
    // let counting_state = props.timer.count_up ? '正计时中' : '倒计时中'
    let counting_state = '计时中'
    if (is_stop.value) {
        return '已停止'
    }
    if (is_pause.value) {
        return '暂停中'
    }
    if (is_timeout.value) {
        return '已结束'
    }
    return counting_state
})
// 状态色彩
const state_type = computed(() => {
    if (is_stop.value) {
        return 'warning'
    }
    if (is_pause.value) {
        return 'primary'
    }
    if (is_timeout.value) {
        return 'info'
    }
    return 'primary'
})
// 状态代码
const state_code = computed(() => {
    if (is_stop.value) {
        // 停止代码
        return 3
    }
    if (is_pause.value) {
        // 暂停代码
        return 1
    }
    if (is_timeout.value) {
        // 超时代码
        return 2
    }
    return 0
})
// 状态代码改变时同步到计时器对象
onMounted(() => {
    watch(state_code, (new_value) => {
        props.timer.state_code = new_value
    })
    props.timer.state_code = state_code.value
})
// 暂停倒计时
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
    props.timer.jump = timing.value
}
// 继续正计时
function count_up_continue() {
    // props.timer.time_0 = now.value - props.timer.time
    props.timer.time_0 = now.value
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
function set_count_stop() {
    is_stop.value = true
}
// 手动设置计时事项
function timer_from(obj) {
    props.timer.time_0 = obj.time_0
    props.timer.time = obj.time
    props.timer.count_up = obj.count_up
    timer.time_memory.value = obj.time
    is_pause.value = false
}
// 重设计时事项
function reset() {
    props.timer.time_0 = now.value;
    props.timer.time = props.timer.time_memory
    props.timer.jump = 0
    is_pause.value = false
    is_stop.value = false
}
defineExpose({})
</script>
