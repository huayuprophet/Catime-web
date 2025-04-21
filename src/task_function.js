import { useTimerStore } from "./stores/timerStore";
import { ElNotification } from "element-plus";

let timer
// timer = useTimerStore();
function create_task(timer, name = null, func, ...args) {
    timer.tasks.push(
        {
            // timer_id : xxx, // 计时器id，默认为当前计时器id
            // type: 0,
            name: name,
            func_name: func,
            args: args,
        }
    )
}

// 初始化任务函数
// 注意：此函数必须在使用任务函数之前调用，不设此逻辑的话，任务函数会报错，因为任务函数需要使用timer对象，而timer对象是在useTimerStore函数中创建的，而tasks相关对象是在useTimerStore函数中调用的，这样就会导致循环引用，导致任务函数无法正常使用。
export function task_init() {
    timer = useTimerStore();
}
export const tasks = {
    restart: (id) => {
        const the_timer = timer.get_timer(id)
        if (the_timer) {
            timer.restart(the_timer)
        }
    },
    set: (id, time) => {
        const the_timer = timer.get_timer(id)
        if (the_timer) {
            timer.set(the_timer, time)
        }
    },
    // 跳至最后但依然执行结束时的任务
    jumpend: (id) => {
        const the_timer = timer.get_timer(id)
        if (the_timer) {
            return timer.jumpend(the_timer)
        }
        return false;
    },
    // 发出通知
    notify: (id = false, title, content) => {
        ElNotification({
            title: title,
            message: content,
            duration: 0,
        })
    },
    notify_simple: (id = false) => {
        const the_timer = timer.get_timer(id)
        ElNotification({
            title: the_timer.des,
            message: '已完成',
            duration: 0,
        })
    },
    tomato: (id, time_work, time_rest, repeat = false, time_rest_big = false) => {
        repeat ||= 1;
        time_rest_big ||= time_rest;
        const the_timer = timer.get_timer(id)
        the_timer.step ??= 1;
        the_timer.step++;
        if (the_timer.step % 2 === 0) {
            timer.set(the_timer, {
                time: time_work,
                jump: 0,
                state_code: 0,
                timer_0: now.value,
            })
        } else {
            const rest_count = (the_timer.step / 2);
            timer.set(the_timer, {
                // 检查是否为大课间，是的话使用大课间时间，否则使用小课间时间           
                time: (rest_count % repeat) === 0 ? time_rest_big : time_rest,
                jump: 0,
                state_code: 0,
                timer_0: now.value,
            })
        }
    },
    open_browser: (id = false, url) => {
        window.open(url, '_blank');
    },
    remove: (id) => {
        const the_timer = timer.get_timer(id)
        timer.remove(the_timer)
    },
    turn_up: (id) => {
        const the_timer = timer.get_timer(id)
        timer.set(the_timer, {
            time_0: now.value,
            jump: 0,
            count_up: true,
            time: 0,
            state_code: 0,
        })
    }

}