<template>
    <div>
        <ElText>
            {{ timers }}
        </ElText>
    </div>
    <div>
        <ElText>
            {{ activated_refs }}
        </ElText>
    </div>
    <div>
        <ElButton @click="test2">0</ElButton>
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
    <div>激活(此处使用超大的字): ({{ activated_refs.id }})</div>
    <div style="font-size: 3rem;">
        <activity_dial :refs="activated_refs"></activity_dial>
    </div>
    <div>
        实时时间 {{ yyyymmddhhmmss_now }}
    </div>
    <ElConfigProvider :locale="zhCn">
        <ElDivider></ElDivider>
        <ElCard>
            <template #header>
                计时列表
            </template>
            <timer_item v-for="(item, index) in timers" ref="items" :timer="item" :index="index"
                :activated_refs="activated_refs">
                <slot>
                    <ElButton :icon="Delete" type="danger" plain @click="timers.splice(index, 1)"> </ElButton>
                </slot>
            </timer_item>
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
                    120 倒计时120分钟<br>
                    1..48 倒计时1小时48秒

                </ElText>
            </div>
        </div>
    </ElConfigProvider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, onMounted, provide, useTemplateRef, computed } from 'vue';
import timer_item from './components/timer_item.vue';
import { Delete } from '@element-plus/icons-vue';
import { timestamp_to_datetime, uuidv4 } from './time_function';
import activity_dial from './components/activity_dial.vue';
// 激活的时间 默认激活当前时间
// const activated_id = ref('')
const activated_refs = ref({})
// 激活项提供给组件

// 当前时间
const now = ref(Date.now())
// 当前时间提供给组件
provide('now', now)
setInterval(() => {
   console.log('interval');
   now.value = Date.now()
}, 150);

// 实时时间显示
const yyyymmddhhmmss_now = computed(() => {
    return timestamp_to_datetime(now.value)
})
const timers = ref(
    [{
        time_0: now.value,
        time: 6000,
        state_code: 0
    }])
// 快捷设置倒计时
const count_down_setting = ref('')

// 提交的字符串转换为毫秒数
function count_down_submit() {
    let str = count_down_setting.value
    // 使用正则表达式来匹配一个非数字字符
    let strArray = str.split(/\D/);
    let numArray = strArray.map(Number);
    let len = numArray.length;
    let after = 0
    if (len === 1) {
        let m = numArray[0] * 60000
        after = m
        console.log(1);
    } else if (len === 2) {
        let m = numArray[0] * 60000
        let s = numArray[1] * 1000
        after = m + s
        console.log(2);
    } else if (len === 3) {
        let h = numArray[0] * 3600000
        let m = numArray[1] * 60000
        let s = numArray[2] * 1000
        after = h + m + s
        console.log(3);
    } else {
        console.log('无效');
        return
    }
    timers.value.push({
        time_0: now.value,
        time: after
    })
    console.log(after)
}
// expose 计时器组件模板语法
const items = useTemplateRef('items')
onMounted(() => {
    console.log(items.value[0]);
    // items.value[0].alertt()
})
function test() {
    timers.value.push({
        id: uuidv4(),
        time: 5000,
        count_up: 0,
        // time_0: now.value
    })
}
function test2() {
    console.log(activated_refs.value.btn[0].action());
}
</script>