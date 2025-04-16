<template>
    <nav_component></nav_component>

    <div>
        <ElText>
            {{ timers }}
        </ElText>
    </div>
    <div>
        <ElText>
            {{ active_timer }}
        </ElText>
    </div>
    <div>
        <ElButton @click="test">
            测试创建一个预制参数的timer
        </ElButton>
        <ElButton>
            测试使用子组件模板语法expose的方法实现群控
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
        <ElDivider></ElDivider>
        <ElCard>
            <template #header>
                计时列表
            </template>
            <!-- <timer_item :key="item.id" v-for="(item, index) in timers" ref="items" :timer="item" :index="index">
                <slot>
                    <ElButton :icon="Delete" type="danger" plain @click="timers.splice(index, 1)"> </ElButton>
                </slot>
            </timer_item> -->
            <!-- <ElEmpty></ElEmpty> -->
        </ElCard>
        <div style="margin-top: 2rem;">
            <div>
                <ElForm @submit.prevent="count_down_submit" style="max-width: 480px;">
                    <ElFormItem>
                        <ElInput v-model="count_down_setting">
                        </ElInput>
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton @click="count_down_submit">创建</ElButton>
                        <ElButton>清空并创建</ElButton>
                        <ElButton>取消</ElButton>
                    </ElFormItem>
                </ElForm>
            </div>
            <div>
                <ElText type="info">
                    示例：<br>
                    2.6.50 倒计时2小时6分钟50秒。<br>
                    2.20 倒计时2分钟20秒<br>
                    .40 倒计时40秒<br>
                    6 倒计时6分钟。<br>
                    120 倒计时2小时<br>
                    1..48 倒计时1小时48秒
                </ElText>
            </div>
        </div>
    </ElConfigProvider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, onMounted, useTemplateRef } from 'vue';
import timer_item from './components/timer_item.vue';
import { Delete } from '@element-plus/icons-vue';
import { str_to_millseconds, uuidv4 } from './time_function';
import activity_dial from './components/activity_dial.vue';
import { useActiveTimerStore, useTimerStore } from './stores/timerStore';
import nav_component from './components/nav.vue';

const timer = useTimerStore()
const active_timer = useActiveTimerStore()
const { timers } = timer
onMounted(() => {
    timer.add_timer({
        id: '00000000-0000-0000-0000-000000000000',
        des: '描述',
        time: 4000,
        time_0: Date.now(),
        count_up: false,
        state_code: 1,
    })
    // timer.timers[0].func()
    // console.log(  timer.timers[0]===timer.timers[0].$this());
    // console.log(timer.timers[0].$this());
    setInterval(() => {
        console.log(timer.timers);
    }, 6000);
    let obj = {
        name: 'John',
        age: 30,
        city: 'New York',
        actions: [
            () => console.log(this), // 箭头函数保持了this的上下文
        ]
    };
    // obj.actions['$this']
    // obj.actions[0]();
    // obj.actions.push(() => console.log(this));
    console.log(obj.actions);
}


)
// 快捷设置倒计时
const count_down_setting = ref('')

// 新增timer
function count_down_submit() {
    const time = str_to_millseconds(count_down_setting.value)
    if (time) {
        timer.add_timer({
            id: uuidv4(),
            time: time,

        })

        return true
    }
    return false
}



// expose 计时器组件模板语法
const items = useTemplateRef('items')
function test() {
    timer.add_timer({
        id: uuidv4(),
        time: 10000,
        des: '测试',
        state_code: 1,
    })
}
</script>