<template>
    <div>
        <el-space>
            <el-tag v-for="(task, index) in tasks" :key="index" closable @close="handleRemoveTask(index)"
                @click="editTask(task, index)">
                {{ task.name }}
            </el-tag>
            <el-button size="small" @click="showAddTaskDialog = true">添加任务</el-button>
        </el-space>

        <!-- 添加/编辑任务抽屉 -->
        <el-drawer v-model="showAddTaskDialog" title="任务配置" direction="btt" size="50%" :destroy-on-close="true">
            <el-form :model="newTaskForm" label-width="100px" style="max-width: 800px;">
                <el-form-item label="任务类型">
                    <el-select v-model="newTaskForm.func" placeholder="请选择任务类型" style="width: 100%">
                        <el-option value="restart" label="重启定时器" />
                        <el-option value="set" label="设置定时器" />
                        <el-option value="jumpend" label="跳转到结束" />
                        <el-option value="notify" label="发送通知" />
                        <el-option value="notify_simple" label="简单通知" />
                        <el-option value="tomato" label="番茄钟" />
                        <el-option value="open_url" label="打开URL" />
                        <el-option value="remove" label="移除定时器" />
                        <el-option value="turn_up" label="倒计时" />
                        <el-option value="play_wav" label="播放WAV音频" />
                        <el-option value="play_sound" label="播放声音" />
                        <el-option value="system_notify" label="系统通知" />
                        <el-option value="stop_sound" label="停止声音" />
                        <el-option value="custom" label="自定义函数" />
                    </el-select>
                </el-form-item>

                <!-- 根据选择的任务类型显示对应的参数输入 -->
                <template v-if="newTaskForm.func === 'set'">
                    <el-form-item label="时间(秒)">
                        <el-input-number v-model="newTaskForm.args[0]" placeholder="时间(秒)" />
                    </el-form-item>
                </template>

                <template v-if="newTaskForm.func === 'notify' || newTaskForm.func === 'system_notify'">
                    <el-form-item label="标题">
                        <el-input v-model="newTaskForm.args[0]" placeholder="通知标题" />
                    </el-form-item>
                    <el-form-item label="内容">
                        <el-input v-model="newTaskForm.args[1]" placeholder="通知内容" />
                    </el-form-item>
                </template>

                <template v-if="newTaskForm.func === 'open_url'">
                    <el-form-item label="URL地址">
                        <el-input v-model="newTaskForm.args[0]" placeholder="请输入URL地址" />
                    </el-form-item>
                </template>

                <template v-if="newTaskForm.func === 'play_wav' || newTaskForm.func === 'play_sound'">
                    <el-form-item label="音频URL">
                        <el-input v-model="newTaskForm.args[0]" placeholder="音频URL" />
                    </el-form-item>
                </template>

                <template v-if="newTaskForm.func === 'play_sound'">
                    <el-form-item label="音量">
                        <el-input-number v-model="newTaskForm.args[1]" :min="0" :max="1" :step="0.1"
                            placeholder="音量(0-1)" />
                    </el-form-item>
                    <el-form-item label="持续时间(秒)">
                        <el-input-number v-model="newTaskForm.args[2]" placeholder="持续时间(秒)" />
                    </el-form-item>
                </template>

                <template v-if="newTaskForm.func === 'custom'">
                    <el-form-item label="函数代码">
                        <el-input v-model="newTaskForm.args[0]" type="textarea" :rows="4" placeholder="自定义函数代码" />
                    </el-form-item>
                </template>

                <template
                    v-if="['restart', 'jumpend', 'notify_simple', 'remove', 'turn_up', 'stop_sound'].includes(newTaskForm.func)">
                    <el-form-item>
                        <span class="info-text">此任务类型无需额外参数</span>
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <div class="drawer-footer">
                    <el-button @click="cancelTask">取消</el-button>
                    <el-button type="primary" @click="addTask">{{ editingTaskIndex !== -1 ? '更新' : '添加' }}</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['tasks']);

// 添加任务对话框相关
const showAddTaskDialog = ref(false);
const editingTaskIndex = ref(-1); // 用于记录当前编辑的任务索引，-1表示新增
const newTaskForm = ref({
    func: '',
    args: []
});

// 处理移除任务
const handleRemoveTask = (index) => {
    props.tasks.splice(index, 1);
};

// 编辑任务
const editTask = (task, index) => {
    // 将当前任务数据填充到表单中
    newTaskForm.value = {
        func: task.func,
        args: [...(task.args || [])]
    };
    // 记住当前编辑的任务索引
    editingTaskIndex.value = index;
    // 显示对话框
    showAddTaskDialog.value = true;
};

// 添加任务
const addTask = () => {
    if (!newTaskForm.value.func) {
        alert('请选择任务类型');
        return;
    }

    // 创建新任务对象，将任务名称固定为任务类型
    const newTask = {
        name: getTaskTypeName(newTaskForm.value.func), // 固定为任务类型名称
        func: newTaskForm.value.func,
        args: [...newTaskForm.value.args].filter(arg => arg !== undefined && arg !== null)
    };

    // 检查是否是编辑现有任务
    if (editingTaskIndex.value !== -1) {
        // 更新现有任务
        props.tasks[editingTaskIndex.value] = newTask;
        editingTaskIndex.value = -1; // 重置编辑索引
    } else {
        // 添加到任务列表
        props.tasks.push(newTask);
    }

    // 重置表单
    newTaskForm.value = {
        func: '',
        args: []
    };

    // 关闭对话框
    showAddTaskDialog.value = false;
};

// 取消任务配置
const cancelTask = () => {
    // 重置表单
    newTaskForm.value = {
        func: '',
        args: []
    };
    // 重置编辑索引
    editingTaskIndex.value = -1;
    // 关闭抽屉
    showAddTaskDialog.value = false;
};

// 获取任务类型名称
const getTaskTypeName = (funcValue) => {
    const taskTypes = {
        'restart': '重启定时器',
        'set': '设置定时器',
        'jumpend': '跳转到结束',
        'notify': '发送通知',
        'notify_simple': '简单通知',
        'tomato': '番茄钟',
        'open_url': '打开URL',
        'remove': '移除定时器',
        'turn_up': '倒计时',
        'play_wav': '播放WAV音频',
        'play_sound': '播放声音',
        'system_notify': '系统通知',
        'stop_sound': '停止声音',
        'custom': '自定义函数'
    };
    return taskTypes[funcValue] || funcValue;
};
</script>

<style scoped>
.info-text {
    color: #909399;
    font-size: 14px;
}

.drawer-footer {
    text-align: right;
    padding-top: 20px;
}

.drawer-footer button {
    margin-left: 10px;
}
</style>
