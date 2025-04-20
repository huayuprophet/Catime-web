<template>
    <div>
        <ElRow :gutter="20">
            <!-- 描述 -->
            <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <div class="info-item">
                    <div class="label">描述</div>
                    <ElInput v-model="timer.des" style="max-width: 240px;">
                    </ElInput>
                </div>
            </ElCol>
            <!-- 倒计时/正计时 -->
            <ElCol :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <div class="info-item">
                    <div class="label" v-if="!timer.count_up">倒计时</div>
                    <div class="label" v-if="timer.count_up">正计时</div>
                    <div class="value">{{ show }}<span v-if="!timer.count_up">/{{ time_show }}</span></div>
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
                        <ElButton @click="timerStore.pause_resume_toggle(timer)" :type="is_pause ? 'info' : 'primary'"
                            :bg="is_pause ? true : false" plain :disabled="is_timeout || is_stop">
                            <ElIcon>
                                <VideoPlay v-show="is_pause"></VideoPlay>
                                <VideoPause v-show="!is_pause"></VideoPause>
                            </ElIcon>
                            <!-- {{ is_pause ? '继续' : '暂停' }} -->
                        </ElButton>
                        <ElButton @click="active" :type="is_activated ? 'success' : 'default'" plain>
                            <el-icon v-show="!is_activated">
                                <Star />
                            </el-icon>
                            <el-icon v-show="is_activated">
                                <StarFilled />
                            </el-icon>
                            <!-- 激活 -->
                        </ElButton>
                        <ElButton @click="timerStore.restart(timer)" plain>
                            <ElIcon>
                                <RefreshRight />
                            </ElIcon>
                            <!-- 重启 -->
                        </ElButton>
                        <ElButton @click="timerStore.stop(timer)" type="warning" plain>
                            <ElIcon>
                                <Close></Close>
                            </ElIcon>
                            <!-- 停止 -->
                        </ElButton>
                        <ElButton @click="timerStore.remove(timer)" type="danger" plain>
                            <ElIcon>
                                <Delete></Delete>
                            </ElIcon>
                        </ElButton>
                    </ElButtonGroup>
                </div>
            </ElCol>
        </ElRow>
        <!-- 进度条 -->
        <el-progress class="progress" :percentage="progress" :show-text="false" :stroke-width="4" />
        <ElDivider></ElDivider>
    </div>
</template>
<style scoped>
.info-item {
    margin-bottom: 1rem;
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
        margin-bottom: 0.8rem;
    }
}
</style>
<script setup>
import { computed } from 'vue';
import { VideoPause, VideoPlay, RefreshRight, Close, Star, StarFilled, Delete } from '@element-plus/icons-vue';
import { ms_to_time, timestamp_to_datetime } from '@/time_function';
import { useTimerStore } from '@/stores/timerStore';
import { storeToRefs } from 'pinia';
// 导入计时器store
const timerStore = useTimerStore();
// 导入组件计时项目对象-props
// 导入对象索引 index与创建的timers值索引一致、不保证与模板引用的ref索引一致
// 导入已激活的timer对象索引
const props = defineProps(['timer', 'index'])
// 导入组件计时项目对象并解包
const { timer } = props
// 检查激活状态
// 导入激活项store
// const active_timer = timerStore.active
const is_activated = computed(() => {
    return timerStore.active === timer.id
})
// 暂停、结束状态
const is_pause = computed(() => {
    return timer.state_code == 1
})
const is_stop = computed(() => {
    return timer.state_code == 3
})
// 倒计时是否超时、结束
const is_timeout = computed(() => {
    return timer.state_code == 2 || timer.state_code == 4
})
const progress_value = computed(() => {
    return timer.count_up ? 0.5 : timer.show / timer.time;
})
// 进度条
// const progress = ref(100)
const progress = computed(() => {
    return progress_value.value * 100
})
// 格式化创建时间
const created_at_show = computed(() => {
    return timestamp_to_datetime(timer.created_at)
})
// 格式化显示倒计时时间
const time_show = computed(() => {
    return ms_to_time(timer.time)
})
// 格式化显示剩余时间
const show = computed(() => {
    return ms_to_time(timer.show)
})

// 状态文本
const state_show = computed(() => {
    // let counting_state = timer.count_up ? '正计时中' : '倒计时中'
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
function active() {
    timerStore.active = timer.id
}
</script>
