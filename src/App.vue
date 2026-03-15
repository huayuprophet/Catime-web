<template>
    <ElConfigProvider :locale="zhCn">
        <ElContainer>
            <ElHeader>
                <nav_component></nav_component>
            </ElHeader>
            <ElContainer>
                <ElAside>
                    <ElSpace direction="vertical" :fill="true">
                        <ElCard>
                            <!-- 1 -->
                            <template #header>
                                快速创建
                            </template>
                            <timer_creater></timer_creater>
                        </ElCard>
                        <ElCard>
                            <template #header>
                                收藏夹
                            </template>
                        </ElCard>
                    </ElSpace>
                </ElAside>
                <ElMain>
                    <div>
                        <activity_dial></activity_dial>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <timer_creater></timer_creater>
                    </div>
                    <ElCard>
                        <template #header>
                            计时列表
                        </template>
                        <ElSpace>
                            <ElText>
                                群控
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
                        <timer_item :key="item.id" v-for="(item, index) in timers" ref="items" :timer="item"
                            :index="index">
                        </timer_item>
                        <div v-if="timers.length === 0">
                            <ElEmpty></ElEmpty>
                        </div>
                    </ElCard>

                </ElMain>
                <ElAside>
                    <ElCard>
                        <template #header>
                            通知与提醒
                        </template>

                    </ElCard>
                </ElAside>
            </ElContainer>
        </ElContainer>
    </ElConfigProvider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useTimerStore } from './stores/timerStore';
import { storeToRefs } from 'pinia';
import activity_dial from './components/activity_dial.vue';
import nav_component from './components/nav.vue';
import timer_creater from './components/timer_creater.vue';
const timer = useTimerStore();
const { timers } = storeToRefs(timer);
</script>