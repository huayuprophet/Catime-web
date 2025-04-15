<template>
    <div>
        <ElRow :gutter="20">
            <!-- 描述 -->
            <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <div class="info-item">
                    <div class="label">描述</div>
                    <div class="value">{{ timer.des }}</div>
                </div>
            </ElCol>
            <!-- 倒计时/正计时 -->
            <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <div class="info-item">
                    <div class="label" v-if="!timer.count_up">倒计时</div>
                    <div class="label" v-if="timer.count_up">正计时</div>
                    <div class="value">{{ timer_show }}<span v-if="!timer.count_up">/{{ time_show }}</span></div>
                </div>
            </ElCol>
            <!-- 状态 -->
            <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <div class="info-item">
                    <div class="label">状态</div>
                    <div class="value">
                        <ElTag :type="state_type">{{ state_show }}</ElTag>
                    </div>
                </div>
            </ElCol>
            <!-- 创建时间 -->
            <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <div class="info-item">
                    <div class="label">创建时间</div>
                    <div class="value">{{ created_at_show }}</div>
                </div>
            </ElCol>
            <!-- 操作按钮 -->
            <ElCol :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="info-item">
                    <ElButtonGroup>
                        <ElButton @click="pause_continue_click" :type="is_pause ? 'info' : 'primary'"
                            :bg="is_pause ? true : false" plain :disabled="is_timeout || is_stop">
                            <ElIcon>
                                <VideoPlay v-show="is_pause"></VideoPlay>
                                <VideoPause v-show="!is_pause"></VideoPause>
                            </ElIcon>
                            {{ is_pause ? '继续' : '暂停' }}
                        </ElButton>
                        <ElButton @click="set_active" :type="is_activated ? 'success' : 'default'" plain>
                            <el-icon v-show="!is_activated">
                                <Star />
                            </el-icon>
                            <el-icon v-show="is_activated">
                                <StarFilled />
                            </el-icon>
                            激活
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
                </div>
            </ElCol>
        </ElRow>
        <!-- 进度条 -->
        <el-progress class="progress" :percentage="progress" :show-text="false" />
        <ElDivider></ElDivider>
    </div>
</template>

<style scoped>
.info-item {
    margin-bottom: 16px;
}

.label {
    font-weight: bold;
    color: #606266;
    margin-bottom: 4px;
}

.value {
    color: #303133;
}

@media (max-width: 768px) {
    .info-item {
        margin-bottom: 12px;
    }
}
</style>
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { VideoPause, VideoPlay, RefreshRight, Close, Star, StarFilled } from '@element-plus/icons-vue';
import { ms_to_time, timestamp_to_datetime, uuidv4 } from '@/time_function';
import { useActiveTimerStore, useTimerStore } from '@/stores/timerStore';
import { storeToRefs } from 'pinia';
// 导入计时器store
const timerStore = useTimerStore();
// 实时时间-毫秒级时间戳
const { now } = storeToRefs(timerStore)
// 导入组件计时项目对象-props
// 导入对象索引 index与创建的timers值索引一致、不保证与模板语法ref索引一致
// 导入已激活的timer对象索引
// 导入已激活的timer方法集
const props = defineProps(['timer', 'index'])
// 导入或生成原始id
// props.timer.id = props.timer.id ? props.timer.id : uuidv4()
// 检查激活状态
// 导入激活项store
const active_timer = useActiveTimerStore()
const is_activated = computed(() => {
    return active_timer.id === props.timer.id
})
// 导入状态、声明函数
// props.timer.state_code = props.timer.state_code ? props.timer.state_code : 0
// 暂停、结束状态
// const is_pause = ref(props.timer.state_code == 1)
const is_pause = computed(() => {
    return props.timer.state_code == 1
})
// const is_timeout = computed(() => {
//     return props.timer.state_code == 2
// })
// const is_stop = ref(props.timer.state_code == 3)
const is_stop = computed(() => {
    return props.timer.state_code == 3
})
// 计时器开始时间 默认为当前时间
// props.timer.time_0 = props.timer.time_0 ? props.timer.time_0 : now.value
// 导入倒计时总时间 适合展示的倒计时总时间
// props.timer.time = props.timer.time ? props.timer.time : 0
const time_show = computed(() => {
    return ms_to_time(props.timer.time)
})
// 以下导入props原对象属性的所有内容
// 计时器创建时间-默认值为当前时间
props.timer.created_at = props.timer.created_at ? props.timer.created_at : now.value
// 适合展示的创建时间
const created_at_show = computed(() => {
    return timestamp_to_datetime(props.timer.created_at)
})
// 计时器描述
props.timer.des = props.timer.des ? props.timer.des : '66';
// 缓存的需跳过时间-暂停继续时使用 默认为0毫秒
props.timer.jump = props.timer.jump ? props.timer.jump : 0
//     let q1= '正倒计时时分秒'
// 倒计时结束时间
const time_1 = computed(() => {
    return props.timer.time_0 + props.timer.time
})
// 正计时时间
const timing = computed(() => {
    return now.value - props.timer.time_0 + props.timer.jump
})
// 剩余倒计时时间 负值为超时的时间
const down = computed(() => {
    return time_1.value - now.value - props.timer.jump
})
// 剩余倒计时比例 每.3秒更新一次
const progress_value = ref(1)
setInterval(() => {
    // 显示暂停值
    if (is_pause.value || is_stop.value) {
        return props.timer.count_up ? props.timer.jump / props.timer.time : (props.timer.time - props.timer.jump) / props.timer.time
    }
    progress_value.value = (down.value / props.timer.time)
    // console.log(progress);
}, 300);
const progress = computed(() => {
    return progress_value.value > 0 ? progress_value.value * 100 : 0
})
// 展示的倒计时时间
const timer_show = computed(() => {
    // 暂停时显示暂停值
    if (is_pause.value) {
        return ms_to_time(
            props.timer.count_up ? props.timer.jump : props.timer.time - props.timer.jump

        )
    }
    if (is_stop.value) {
        return '已停止'
    }
    // //0 计时
    // state_code === 0 ? (count_up ? timing : down) : (count_up ? jump : time - jump)
    // // 暂停
    // count_up ? jump : time - jump

    // 正计时显示正计时的时间
    if (props.timer.count_up) {
        return ms_to_time(timing.value)
    }
    if (is_timeout.value) {
        return '超时' + ms_to_time(Math.abs(down.value))
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
const state_show = computed(() => {
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
    props.timer.state_code = 1
    // is_pause.value = true
    props.timer.jump = timing.value
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
// 暂停继续切换按钮点击事件
function pause_continue_click() {
    // 如果已结束或手动停止，则不予切换状态
    if (is_timeout.value || is_stop.value) {
        return false
    }
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
    props.timer.jump = timing.value
}
// 设置激活
function set_active() {
    active_timer.id = props.timer.id
}
// 导出激活项关键配置到模板语法、检查或配置激活timer索引
watch(is_activated, (value) => {
    if (value) {
        // 激活项timer索引设置
        active_timer.index = props.index
        // 激活项timer模板语法
        active_timer.template.text = timer_show
        active_timer.template.type = state_code
        active_timer.template.state = state_show
        active_timer.template.progress = progress
        active_timer.template.btn = [{
            label: "开始/暂停",
            action: pause_continue_click,
            type: 0
        }, {
            label: "停止/重设",
            action: stop_reset_click,
            type: 1
        }, {
            label: "跳至结束",
            action: skip,
            type: 2
        },]
    }
}, { immediate: true })
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
    props.timer.time = props.timer.time
    props.timer.jump = 0
    is_pause.value = false
    is_stop.value = false
}
// 停止重设切换按钮点击事件
function stop_reset_click() {
    if (is_stop.value) {
        reset()
    } else {
        set_count_stop();
    }
}
// 手动跳过 注意继续执行业务
function skip() {
    props.timer.jump = props.timer.time
    props.timer.time_0 = now.value
}
defineExpose({})
</script>
