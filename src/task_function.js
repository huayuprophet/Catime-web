// console.log('Hello, World!');
import { useTimerStore } from "./stores/timerStore";
import { useTaskStore } from "./stores/taskStore";

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
    replay: (id) => {
        const timer_index = timer.get_index(id);
        if (timer_index !== -1) {
        }
    }
}