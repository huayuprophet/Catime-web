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
  <div class="tomato creater" v-show="true">
    <!-- 番茄钟添加： -->
    <ElForm style="max-width: 480px;">
      <ElFormItem label="专注时间">
        <ElInput v-model="tomato_setting[0]" placeholder="规则与刚才相同 示例 25">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="休息时间">
        <ElInput v-model="tomato_setting[1]" placeholder="规则与刚才相同 示例 5">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="重复次数">
        <ElInput v-model="tomato_setting[2]" placeholder="请输入重复次数，不需要则留空">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="大课间">
        <ElInput v-model="tomato_setting[3]" placeholder="请输入大课间时间，不需要则留空">
        </ElInput>
      </ElFormItem>
    </ElForm>
    <ElText type="info">
      解释：【专注】与【休息】循环进行倒计时，每专注【重复次数】次，休息一次【大课间】。<br>
      如：专注25分钟，休息5分钟，重复【3】次，大课间10分钟。<br>
      则：25分钟专注#1，5分钟休息，25分钟专注#2，5分钟休息，25分钟专注#3，10分钟大课间。然后又从头开始。<br>
    </ElText>
    <div>
      <ElText> {{ tomato_setting }}
      </ElText>

    </div>
  </div>
  <div class="task creater">
    默认任务：
    <ElSpace>
      <template v-for="(task, index) in task_setting" :key="index">
        <ElTag closable @close="task_setting.splice(index, 1)" @click="">
          {{ task.name }}
        </ElTag>
        <ElInput v-for="(arg, index) in task.args" v-model="task.args[index]"></ElInput>
      </template>
      <ElTag closable>
        1
      </ElTag>
      <ElTag closable>
        1
      </ElTag>
      <ElTag closable>
        1
      </ElTag>
      <ElButton circle>
        <ElIcon>
          <Plus />
        </ElIcon>
      </ElButton>
    </ElSpace>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { str_to_millseconds, uuidv4 } from '../time_function';
import { useTimerStore } from '../stores/timerStore';
import { Plus } from '@element-plus/icons-vue';

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
const tomato_setting = ref([

]);
// const tomato_setting = ref({});
// 新增timer
function tomato_submit() {

}
const task_setting = ref([
  {
    name: '打开网页',
    func: 'open_url',
    args: ['http://url/', 66]
  }
])

const task_tag_show = ref([]);


</script>