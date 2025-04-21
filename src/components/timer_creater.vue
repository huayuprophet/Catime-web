<template>
  <div class="down creater">
    <!-- 倒计时添加： -->
    <ElForm @submit.prevent="count_down_submit" style="max-width: 480px;">
      <ElFormItem>
        <ElInput v-model="count_down_setting"></ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="count_down_submit" type="primary">创建</ElButton>
        <ElButton @click="clear_and_create">清空并创建</ElButton>
        <ElButton @click="cancel">取消</ElButton>
      </ElFormItem>
    </ElForm>
    <div>
      <ElText type="info">
        规则：[时].[分].[秒] 或 [分].[秒] 或 [分]。示例：<br>
        2.6.50 倒计时2小时6分钟50秒。<br>
        2.20 倒计时2分钟20秒<br>
        120 倒计时120分钟<br>
        也可以：.40 倒计时40秒；
        1..48 倒计时1小时0分钟48秒；
        5.20. 倒计时5小时20分钟0秒。
      </ElText>
    </div>
  </div>
  <div class="tomato creater" v-show="false">
    <!-- 番茄钟添加： -->
    <ElForm>
      <ElFormItem label="专注时间">
        <ElInput v-model="tomato_setting.time">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="休息时间">
        <ElInput v-model="tomato_setting.time">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="休息时间">
        <ElInput v-model="tomato_setting.time">
        </ElInput>
      </ElFormItem>
    </ElForm>
    <div>{{ tomato_setting.time }}</div>
  </div>
  <div class="task creater">
    <!-- 任务添加： -->

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { str_to_millseconds, uuidv4 } from '../time_function';
import { useTimerStore } from '../stores/timerStore';

const timer = useTimerStore();
const count_down_setting = ref('');
// 新增timer
function count_down_submit() {
  const time = str_to_millseconds(count_down_setting.value);
  if (time) {
    timer.add_timer({
      id: uuidv4(),
      time: time,
    });
    return true;
  }
  return false;
}
// 清空并创建
function clear_and_create() {
  timer.clear();
  count_down_submit();
}
// 取消
function cancel() {
  count_down_setting.value = '';
}
const tomato_setting = ref({
  time: 25,
  short_break: 5,
  long_break: 15,
  repeat: 4,
});
// 新增timer
function tomato_submit() {

}


</script>