<template>
    <ElConfigProvider :locale="zhCn">


        <div>
            <span>主要：</span>
            <span>{{ now }}</span>
        </div>
        <div>
            <span>倒计时：</span>
            <span></span>

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
import { ref, onMounted } from 'vue';
// 当前时间
const now = ref(0)
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

// 快捷设置倒计时
const timing = ref('')
function timing_submit() {
    let str = timing.value
    // 使用正则表达式 /\s+/ 来匹配一个或多个空格
    let strArray = str.split(/\s+/);
    let numArray = strArray.map(Number);
    let len = numArray.length;
    let after
    if (len === 1) {
        let m = timing.value[0] * 60
        after = m
    } else if (len === 2) {
        let m = timing.value[0] * 60
        let s = timing.value[1]
        after = m + s
    } else if (len === 3) {
        let h = timing.value[0] * 360
        let m = timing.value[1] * 60
        let s = timing.value[2]
        after = h + m + s
    }

}
</script>