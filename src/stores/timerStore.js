import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { uuidv4 } from '@/time_function'

export const useTimerStore = defineStore('timer', () => {
    const timers = ref([{
        id: '00000000-0000-0000-0000-000000000000',
        des: '描述',
        time: 4000,
        time_0: Date.now(),
        count_up: false,
    }])
    const now = ref(Date.now())
    // 更新当前时间
    setInterval(() => {
        now.value = Date.now()
    }, 150)
    // 添加计时器
    function add_timer(timer) {
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
    // 清空计时器
    function clear() {
        timers.value = [];
    }
    return {
        timers,
        now,
        add_timer,
        remove,
        clear
    }
})
export const useActiveTimerStore = defineStore('activeTimer', () => {
    const timer = useTimerStore()
    const index = ref(0)
    const id = ref('00000000-0000-0000-0000-000000000000')
    // setInterval(() => {
    //     console.log(timer.timers[index.value]);
    // }, 2000)
    const valuable = computed(() => {
        if (timer.timers[index.value] == null) {
            return false
        }
        return timer.timers[index.value].id === id.value ? true : false
    })
    const template = ref({
        // text, state, type, progress, btn: [{
        //     label,type,action
        // }]
    })
    return {
        index,
        id,
        valuable,
        template,
    }
})