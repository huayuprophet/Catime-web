<template>
    <ElConfigProvider :locale="zhCn">
        <div>
            <span>主要：</span>
            <span>{{ now }}</span>
        </div>
        <ElDivider></ElDivider>
        <timer_item v-for="(item, index) in timer2" ref="items">
            <slot></slot>
        </timer_item>
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
                    {{ count_down_setting }}
                </ElText>
            </div>
        </div>
    </ElConfigProvider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, onMounted, provide,useTemplateRef } from 'vue';
import timer_item from './components/timer_item.vue';
// 当前时间
const now = ref(0)
// 提供给组件
provide('now', now)
// 实时更新时间
now.value = Date.now()
function now_timeout() {
    setTimeout(() => {
        now.value = Date.now()
        now_timeout()
    }, 20)
}
onMounted(() => {
    now_timeout()

})
// 倒计时对象
const timer = ref({
    time_0: 0,
    time: 0
})
const timer2 = ref(
    [{
    time_0: 0,
    time: 0
}])
const list = ref([1])
// 快捷设置倒计时
const count_down_setting = ref('')
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
        let h = numArray[0] * 360000
        let m = numArray[1] * 60000
        let s = numArray[2] * 1000
        after = h + m + s
        console.log(3);
    } else {
        console.log('无效');
        return
    }
    timer.value.time_0 = now.value
    timer.value.time = after
    alert(after)
}
const items=useTemplateRef('items')
onMounted(()=>{
    console.log(items.value[0]);
    items.value[0].alertt()
})


</script>