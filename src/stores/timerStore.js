import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uuidv4 } from '@/time_function'

export const useTimerStore = defineStore('timer', () => {
    const timers = ref([])
    const now = ref(Date.now())

    // 更新当前时间
    setInterval(() => {
        now.value = Date.now()
    }, 150)

    // 添加计时器
    function add(timer) {
        timers.value.push({
            id: uuidv4(),
            time_0: now.value,
            ...timer
        })
    }

    // 删除计时器
    function remove(index) {
        timers.value.splice(index, 1)
    }
    function clear() {
        timers.value = [];
    }
    return {
        timers,
        now,
        add,
        remove,
        clear
    }
})