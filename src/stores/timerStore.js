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
        scoped.id = scoped.id ?? uuidv4()
        scoped.time_0 = scoped.time_0 ?? now.value
        scoped.jump = scoped.jump ?? 0
        scoped.created_at = scoped.created_at ?? now.value
        scoped.state_code = scoped.state_code ?? 0
        scoped.count_up = false// 是否为倒计时
        scoped.tasks = []
        scoped.timing = computed(() => {
            return now.value - scoped.time_0 + scoped.jump
        })
        scoped.time_1 = computed(() => {
            return scoped.time_0 + scoped.time
        })
        scoped.down = computed(() => {
            return scoped.time_1 - now.value - scoped.jump
        })
        scoped.show = computed(() => {
            let result = scoped.state_code === 0 ? (scoped.count_up ? scoped.timing : scoped.down) : (scoped.count_up ? scoped.jump : scoped.time - scoped.jump)
            return result >= 0 ? result : 0
        })
        // scoped.$this = scoped
        timers.value.push(scoped)
        scoped.pause_resume_toggle=function(){
            if(scoped.state_code===0){
                
            }
            
        }
        // console.log(scoped);
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