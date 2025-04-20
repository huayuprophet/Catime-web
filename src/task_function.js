// console.log('Hello, World!');
import { useTimerStore } from "./stores/timerStore";
import { useTaskStore } from "./stores/taskStore";
import { ElNotification } from "element-plus";

const timer = useTimerStore();
const task = useTaskStore();

function a(str) {
    console.log(str);
}
let b = []
function create_task(timer, func, ...args) {
    timer.tasks.push(
        {
            type: 0,
            func_name: func,
            args: args,
        }
    )
}

const tasks = {
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
    tomato: (id, time_work, time_rest, repeat, time_rest_big = time_rest) => {
        const the_timer = timer.get_timer(id)
        the_timer.step ??= 0;
        // if (the_timer) {
        //     create_task(the_timer, tasks.notify, id, '番茄钟', '时间到！')
        //     create_task(the_timer, tasks.restart, id)
        // }
    },

}