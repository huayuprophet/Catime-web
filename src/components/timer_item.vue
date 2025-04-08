<template>
    <div>
        <span>倒计时：</span>
        <span>{{ timer_show }}</span>
    </div>

    <ElSpace>
        <ElText>name</ElText>
        <ElText>
            倒计时：{{ timer_show }}
        </ElText>
        <ElText>状态: 计时中</ElText>
        <ElButtonGroup>
            <ElButton @click="pause_continue_click" :type="is_pause ? 'info' : 'primary'" :bg="is_pause ? true : false"
                text="">
                <ElIcon>
                    <VideoPlay v-show="is_pause">
                    </VideoPlay>
                    <VideoPause v-show="!is_pause"></VideoPause>
                </ElIcon>
                {{ is_pause ? '继续' : '暂停' }}
            </ElButton>
            <ElButton @click="pause_continue_click" :type="is_pause ? 'info' : 'primary'" :bg="is_pause ? true : false"
                text="">
                <ElIcon>
                    <VideoPlay v-show="is_pause">
                    </VideoPlay>
                    <VideoPause v-show="!is_pause"></VideoPause>
                </ElIcon>
                {{ is_pause ? '继续' : '暂停' }}
            </ElButton>

            <slot></slot>
        </ElButtonGroup>
    </ElSpace>

</template>
<script setup>
import { inject, ref, computed } from 'vue';
import { VideoPause, VideoPlay } from '@element-plus/icons-vue';
// import { log } from 'node:console';
const now = inject('now')
// 倒计时对象
const timer = ref({
    time_0: 1,
    time: 6,
    // 是否正计时类型
    count_up: false
})
// 倒计时结束时间
const time_1 = computed(() => {
    return timer.value.time_0 + timer.value.time
})
// 正计时时间
const timing = computed(() => {
    return now.value - timer.value.time_0
})
// 剩余倒计时时间
const down = computed(() => {
    return time_1.value - now.value
})

// 展示的倒计时时间
const timer_show = computed(() => {
    // 暂停时显示暂停值
    if (is_pause.value) {
        return timer.value.time
    }
    // 正计时显示正计时的时间
    if (timer.value.count_up) {
        return timing.value
    }
    return down.value
})
// timer.value.time_0 + timer.value.time

// 暂停倒计时
const is_pause = ref(false)
function count_down_pause() {
    is_pause.value = true
    timer.value.time = down.value
}
// 继续倒计时
function count_down_continue() {
    timer.value.time_0 = now.value;
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
    timer.value.time = timing.value
}
// 继续正计时
function count_up_continue() {
    timer.value.time_0 = now.value - timer.value.time
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
    if (timer.value.count_up) {
        count_up_button_click()
    } else {
        count_down_button_click()
    }
}
function set_count_up() {
    timer.value = {
        time_0: now.value,
        count_up: true
    }
}
</script>