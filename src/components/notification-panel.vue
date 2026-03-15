<template>
  <ElCard>
    <template #header>
      通知与提醒
    </template>
    
    <div v-if="notifies.length === 0" class="empty-state">
      <ElEmpty description="暂无通知" />
    </div>
    
    <div v-else class="notification-list">
      <ElAlert
        v-for="notify in notifies"
        :key="notify.id"
        :title="notify.title"
        :message="notify.content"
        :type="getAlertType()"
        :closable="true"
        class="notification-item"
        @close="handleClose(notify.id)"
      >
        <template #title>
          <div class="notification-header">
            <span class="notification-title">{{ notify.title }}</span>
            <span class="notification-time">{{ formatTime(notify.timestamp) }}</span>
          </div>
          <div class="notification-content">
            {{ notify.content }}
          </div>
        </template>
      </ElAlert>
    </div>
    
    <ElButton 
      v-if="notifies.length > 0" 
      @click="clearAllNotifications" 
      type="danger" 
      size="small" 
      class="clear-all-btn"
    >
      清空所有通知
    </ElButton>
  </ElCard>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useNotifyStore } from '../stores/notifyStore';
import { ElAlert, ElButton, ElCard, ElEmpty } from 'element-plus';
import { computed } from 'vue';

// 使用通知store
const notifyStore = useNotifyStore();
const { notifies } = storeToRefs(notifyStore);

// 随机返回一种警报类型，增加视觉多样性
const getAlertType = () => {
  const types = ['success', 'warning', 'info', 'error'];
  return types[Math.floor(Math.random() * types.length)];
};

// 格式化时间戳
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 处理单个通知关闭
const handleClose = (id) => {
  notifyStore.removeNotify(id);
};

// 清空所有通知
const clearAllNotifications = () => {
  notifyStore.clearNotifies();
};
</script>

<style scoped>
.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  margin-bottom: 10px;
  transition: opacity 0.3s ease;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.notification-title {
  font-weight: bold;
  flex: 1;
}

.notification-time {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.notification-content {
  margin-top: 5px;
  font-size: 14px;
  color: #606266;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
}

.clear-all-btn {
  margin-top: 10px;
  width: 100%;
}
</style>
