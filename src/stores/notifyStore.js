import { ref } from "vue";
import { defineStore } from "pinia";
import { ElNotification } from "element-plus";

export const useNotifyStore = defineStore('notifyStore', () => {
    const notifies = ref([]);

    // 添加通知
    const addNotify = (id = false, title, content, soundUrl = null) => {
        const notifyId = id || Date.now().toString();
        const newNotify = {
            id: notifyId,
            title,
            content,
            timestamp: new Date().toISOString(),
        };

        notifies.value.push(newNotify);

        // 显示Element Plus通知
        ElNotification({
            title: title,
            message: content,
            duration: 0, // 持久显示，直到手动删除
        });

        // 如果有声音URL，则播放声音
        if (soundUrl) {
            playSound(notifyId, soundUrl);
        }

        return notifyId;
    };

    // 删除通知
    const removeNotify = (id) => {
        const index = notifies.value.findIndex(notify => notify.id === id);
        if (index !== -1) {
            // 停止与此通知关联的声音（如果有的话）
            stopSound(id);
            notifies.value.splice(index, 1);
        }
    };

    // 清空所有通知
    const clearNotifies = () => {
        // 停止所有声音
        notifies.value.forEach(notify => {
            stopSound(notify.id);
        });
        notifies.value = [];
    };

    // 播放声音
    const playSound = (id, soundUrl, volume = 1.0, duration = null, loop = false) => {
        try {
            // 如果之前有同ID的音频正在播放，则先停止
            if (window.audioInstances && window.audioInstances.has(id)) {
                const existingAudio = window.audioInstances.get(id);
                existingAudio.pause();
                existingAudio.currentTime = 0;
                window.audioInstances.delete(id);
            }

            const audio = new Audio(soundUrl);
            audio.volume = volume;
            audio.loop = loop;

            // 初始化全局音频实例映射
            if (!window.audioInstances) {
                window.audioInstances = new Map();
            }

            // 存储音频实例以便后续控制
            window.audioInstances.set(id, audio);

            // 如果设置了持续时间，则在指定时间后停止播放
            if (duration !== null && !loop) {
                setTimeout(() => {
                    if (window.audioInstances && window.audioInstances.has(id)) {
                        audio.pause();
                        audio.currentTime = 0;
                        window.audioInstances.delete(id);
                    } else {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }, duration * 1000);
            }

            audio.play().catch(e => console.error('播放音频失败:', e));
        } catch (error) {
            console.error('创建音频对象失败:', error);
        }
    };

    // 停止声音
    const stopSound = (id) => {
        if (window.audioInstances && window.audioInstances.has(id)) {
            const audio = window.audioInstances.get(id);
            audio.pause();
            audio.currentTime = 0;
            window.audioInstances.delete(id);
            return true;
        }
        return false;
    };

    return {
        notifies,
        addNotify,
        removeNotify,
        clearNotifies,
        playSound,
        stopSound,
    };
}, {
    persist: {
        key: 'notify-store', // 存储键名
        storage: localStorage, // 使用localStorage进行持久化
    },
});
