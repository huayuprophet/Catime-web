<template>
    <nav_component></nav_component>
    <div v-show="false">
        <ElText>
            {{ timers }}
        </ElText>
    </div>
    <div v-show="false">
        <ElText>
            {{ timer.active }}
        </ElText>
    </div>
    <div v-show="false">
        <ElButton @click="test">
            测试创建一个预制参数的timer
        </ElButton>
        <ElButton>
            测试群控
        </ElButton>
        <ElButton>
            模拟timeout以测试触发结束事件
        </ElButton>
    </div>
    <div>置顶激活(此处使用超大的字): </div>
    <div>
        <activity_dial></activity_dial>
    </div>
    <ElConfigProvider :locale="zhCn">
        <div style="margin-bottom: 1rem;">
            <timer_creater></timer_creater>
        </div>
        <ElCard>
            <template #header>
                计时列表
            </template>
            <ElSpace>
                <ElText>
                    全部
                </ElText>
                <ElButtonGroup>
                    <!-- 全部暂停 -->
                    <ElButton @click="timer.group_control(timer.timers, timer.pause)">
                        all pause
                    </ElButton>
                    <!-- 全部继续 -->
                    <ElButton @click="timer.group_control(timer.timers, timer.resume)">
                        all resume
                    </ElButton>
                    <!-- 全部停止 -->
                    <ElButton @click="timer.group_control(timer.timers, timer.stop)">
                        all stop
                    </ElButton>
                    <!-- 全部重设 -->
                    <ElButton @click="timer.group_control(timer.timers, timer.restart)">
                        all restart
                    </ElButton>
                    <!-- 全部删除 -->
                    <ElButton @click="timer.clear">
                        all delete
                    </ElButton>
                </ElButtonGroup>
            </ElSpace>

            <ElDivider>
            </ElDivider>
            <timer_item :key="item.id" v-for="(item, index) in timers" ref="items" :timer="item" :index="index">
            </timer_item>
            <div v-if="timers.length === 0">
                <ElEmpty></ElEmpty>
            </div>
        </ElCard>
    </ElConfigProvider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { ref } from 'vue';
import { useTimerStore } from './stores/timerStore';
import { storeToRefs } from 'pinia';
import activity_dial from './components/activity_dial.vue';
import nav_component from './components/nav.vue';
import timer_creater from './components/timer_creater.vue';

const timer = useTimerStore();
const { timers } = storeToRefs(timer);

function test() {
    timer.add_timer({
        id: uuidv4(),
        time: 10000,
        des: '测试',
        state_code: 1,
    });
}
</script>