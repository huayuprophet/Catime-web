import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import { uuidv4 } from '@/time_function'

export const useTimerStore = defineStore('timer', () => {
    const timers = ref([])
    const now = ref(Date.now())
    const active = ref('00000000-0000-0000-0000-000000000000')
    // 更新当前时间并检查超时
    setInterval(() => {
        now.value = Date.now()
        // 检查所有计时器的超时状态
        timers.value.forEach(timer => {
            if (timer.state_code === 0 && timer.down <= 0) {
                timer.state_code = 2; // 标记为超时状态
                // timer.tasks.forEach(task => task()); // 执行所有任务
            }
        })
    }, 150)
    // 添加计时器
    function add_timer(timer) {
        const scoped = reactive(timer)
        scoped.id = scoped.id || uuidv4()
        scoped.des = scoped.des || ''
        scoped.time_0 = scoped.time_0 || now.value
        scoped.time = scoped.time || 0
        // scoped.remark = scoped.remark || ''
        scoped.jump = scoped.jump || 0
        scoped.created_at = scoped.created_at || now.value
        scoped.state_code = scoped.state_code || 0 // 0: 运行中, 1: 暂停, 2: 结束/过期, 3: 停止，4: 已执行任务/跳过任务
        scoped.count_up = false
        scoped.tasks = []
        bind_computed(scoped)
        // timers.value.push(scoped)
        timers.value.splice(0,0,scoped)
    }
    // 绑定计算属性
    function bind_computed(scoped) {
        // 计算属性：
        // const scoped = timer;
        // timing 是计时器的运行时间
        scoped.timing = computed(() => {
            return now.value - scoped.time_0// + scoped.jump
        })
        // time_1 是计时器的结束时间
        scoped.time_1 = computed(() => {
            return scoped.time_0 + scoped.time
        })
        // down 是计时器的剩余时间
        scoped.down = computed(() => {
            return scoped.time_1 - now.value// - scoped.jump
        })
        // 显示的时间，根据状态和是否倒计时进行调整
        scoped.show = computed(() => {
            // 已完成或跳过任务的计时器显示为0
            if (scoped.state_code === 2 || scoped.state_code === 4) { return 0 }
            const result = scoped.state_code === 0 ? (scoped.count_up ? scoped.timing : scoped.down) : (scoped.count_up ? scoped.jump : scoped.time - scoped.jump)
            return result >= 0 ? result : 0
        })

    }
    // 暂停计时器
    function pause(timer) {
        if (timer.state_code === 0) {
            timer.jump = timer.timing;
            timer.state_code = 1;
            return true;
        }
        return false;
    }
    // 恢复计时器
    function resume(timer) {
        if (timer.state_code === 1) {
            timer.time_0 = now.value - timer.jump;
            timer.state_code = 0;
            timer.jump = 0;
            return true;
        }
        return false;
    }
    // 暂停/恢复计时器切换
    function pause_resume_toggle(timer) {
        if (timer.state_code === 0) {
            return pause(timer);
        } else if (timer.state_code === 1) {
            return resume(timer);
        }
        return false;
    }
    // 停止计时器
    function stop(timer) {
        timer.jump = timer.timing
        timer.state_code = 3
    }
    // 设置计时器属性
    function set(timer, obj, ins = false) {
        // 是否替换关键属性
        if (ins) {
            obj = ins ? {
                jump: 0,
                state_code: 0,
                time_0: now.value,
                ...obj
            } : obj
        }
        for (const key in obj) {
            timer[key] = obj[key]
        }
    }
    // 重启计时器
    function restart(timer) {
        set(timer, {
            time_0: now.value,
            jump: 0,
            state_code: 0
        })
    }
    // 删除计时器
    function remove(timer) {
        const index = get_index(timer.id)
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
    function jumpend(timer) {
        // const timer = timer;
        if (timer.state_code === 0 || timer.state_code === 1) {
            timer.jump = timer.time; // 跳至结束
            timer.state_code = 2; // 标记为结束状态
            // 在这里可以添加结束时应触发的任务
            // 例如：timer.tasks.forEach(task => task());
            return true;
        }
        return false;
    }
    // 群控
    function group_control(timers, func, ...args) {
        timers.forEach(timer => {
            func(timer, ...args)
        })
    }
    // 接下来帮我示例遍历js对象的实现
    // 遍历js对象的实现

    return {
        timers,
        now,
        add_timer,
        get_timer,
        get_index,
        pause_resume_toggle,
        pause,
        resume,
        stop,
        set,
        restart,
        remove,
        clear,
        jumpend,
        group_control,
        bind_computed,
        active,
    }
}, {
    persist: {
        beforeHydrate: (ctx) => {
        },
        afterHydrate: (ctx) => {
            // 重置所有计时器的计算属性，防止在持久化后出现问题
            const timer = useTimerStore()
            timer.timers.forEach(scoped => {

                timer.bind_computed(scoped)
            })
        }
    },


})
