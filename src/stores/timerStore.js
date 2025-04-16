import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import { uuidv4 } from '@/time_function'

export const useTimerStore = defineStore('timer', () => {
    const timers = ref([])
    const now = ref(Date.now())
    // 更新当前时间
    setInterval(() => {
        now.value = Date.now()
    }, 150)
    // 添加计时器
    function add_timer(timer) {
        const scoped = reactive(timer)
        scoped.id = scoped.id || uuidv4()
        scoped.time_0 = scoped.time_0 || now.value
        scoped.jump = scoped.jump || 0
        scoped.created_at = scoped.created_at || now.value
        scoped.state_code = scoped.state_code || 0 // 0: 运行中, 1: 暂停, 2: 结束/过期, 3: 停止，4: 已执行任务/跳过任务
        scoped.count_up = false
        scoped.tasks = []
        scoped.timing = computed(() => {
            return now.value - scoped.time_0// + scoped.jump
        })
        scoped.time_1 = computed(() => {
            return scoped.time_0 + scoped.time
        })
        scoped.down = computed(() => {
            return scoped.time_1 - now.value// - scoped.jump
        })
        scoped.show = computed(() => {
            const result = scoped.state_code === 0 ? (scoped.count_up ? scoped.timing : scoped.down) : (scoped.count_up ? scoped.jump : scoped.time - scoped.jump)
            return result >= 0 ? result : 0
        })

        timers.value.push(scoped)
    }
    // 暂停/恢复计时器
    function pause_resume_toggle(index) {
        if (timers.value[index].state_code === 0) {
            timers.value[index].jump = timers.value[index].timing
            timers.value[index].state_code = 1
            return true
        }
        else if (timers.value[index].state_code === 1) {
            timers.value[index].time_0 = now.value - timers.value[index].jump
            timers.value[index].state_code = 0
            timers.value[index].jump = 0
            return true
        }
        else { return false }
    }
    // 停止计时器
    function stop(index) {
        timers.value[index].jump = timers.value[index].timing
        timers.value[index].state_code = 3
    }
    // 设置计时器属性
    function set(index, obj) {
        for (const key in obj) {
            timers.value[index][key] = obj[key]
        }
    }
    // 重启计时器
    function restart(index) {
        set(index, {
            time_0: now.value,
            jump: 0,
            state_code: 0
        })
    }
    // 删除计时器
    function remove(index) {
        timers.value.splice(index, 1)
    }
    // 清空全部计时器
    function clear() {
        timers.value = [];
    }
    // 获取计时器
    function get_timer(id) {
        return timers.value.find(timer => timer.id === id)
    }
    // 获取计时器索引
    function get_index(id) {
        return timers.value.findIndex(timer => timer.id === id)
    }
    // 跳至最后但依然执行结束时的任务
    function jumpend(index) {
        const timer = timers.value[index];
        if (timer.state_code === 0 || timer.state_code === 1) {
            timer.jump = timer.time; // 跳至结束
            timer.state_code = 2; // 标记为结束状态
            // 在这里可以添加结束时应触发的任务
            // 例如：timer.tasks.forEach(task => task());
            return true;
        }
        return false;
    }

    return {
        timers,
        now,
        add_timer,
        get_timer,
        get_index,
        pause_resume_toggle,
        stop,
        set,
        restart,
        remove,
        clear,
        jumpend // 导出 jumpend 方法
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