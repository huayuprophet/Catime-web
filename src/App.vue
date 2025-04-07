<template>
    <ElConfigProvider :locale="zhCn">


        <div>
            <span>主要：</span>
            <span>{{ now }}</span>
        </div>
        <div>
            <span>倒计时：</span>
            <span>{{ }}</span>

        </div>
        <div>
            <div>
                <ElForm @submit.prevent="">
                    <ElInput v-model="timing">
                    </ElInput>
                </ElForm>
            </div>
            <div>

                <ElText type="info">
                    1
                </ElText>
                <ElText type="info">
                    1
                </ElText>
                <ElText type="info">
                    {{ timing }}
                </ElText>
            </div>

        </div>

    </ElConfigProvider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, onMounted, provide, computed } from 'vue';
// 当前时间
const now = ref(0)
//提供给组件
provide('now', now)
//实时更新时间
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

//倒计时
const timer = ref({
    time_0: 1,
    time: 6,
})
const time_1 = computed(() => {
    return timer.value.time_0 + timer.value.time
})
const tim
// timer.value.time_0 + timer.value.time


// 快捷设置倒计时
const count_setting = ref('')
function timing_submit() {
    let str = count_setting.value
    // 使用正则表达式 /\s+/ 来匹配一个或多个空格
    let strArray = str.split(/\s+/);
    let numArray = strArray.map(Number);
    let len = numArray.length;
    let after
    if (len === 1) {
        let m = numArray.value[0] * 60
        after = m
    } else if (len === 2) {
        let m = numArray.value[0] * 60
        let s = numArray.value[1]
        after = m + s
    } else if (len === 3) {
        let h = numArray.value[0] * 360
        let m = numArray.value[1] * 60
        let s = numArray.value[2]
        after = h + m + s
    } else { }
    timer.value.time_0 = now.value
    timer.value.time = after
}
</script>