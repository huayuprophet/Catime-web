<template>
    <ElConfigProvider :locale="zhCn">


        <div>
            <span>主要：</span>
            <span>{{ now }}</span>
        </div>
        <div>
            <span>倒计时：</span>
            <span>{{ timer_show }}</span>
        </div>
        <div>
            <ElButton @click="count_down_button_click">{{ is_pause ? '继续' : '暂停' }}</ElButton>


        </div>
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
import { ref, onMounted, provide, computed } from 'vue';
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
    time_0: 1,
    time: 6,
})
const time_1 = computed(() => {
    return timer.value.time_0 + timer.value.time
})
const timing = computed(() => {
    return now.value - timer.value.time_0
})
const down = computed(() => {
    return time_1.value - now.value
})

// 展示的倒计时时间
const timer_show = computed(() => {
    if (is_pause.value) {
        return timer.value.time
    }
    return down.value
})
// timer.value.time_0 + timer.value.time


// 快捷设置倒计时
const count_down_setting = ref('')
function count_down_submit() {
    let str = count_down_setting.value
    // 使用正则表达式 /\s+/ 来匹配一个或多个空格
    let strArray = str.split(/\s+/);
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
}

// 暂停倒计时
const is_pause = ref(false)
function count_down_pause() {
    is_pause.value = true
    timer.value.time = down.value
}
// 继续倒计时
function count_down_continue() {
    timer.value.time_0 = Date.now();
    is_pause.value = false
}
// 暂停继续按钮点击事件
function count_down_button_click() {
    if (is_pause.value) {
        count_down_continue()
    } else {
        count_down_pause()
    }
}
</script>