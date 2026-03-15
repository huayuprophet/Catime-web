import { useTimerStore } from "./stores/timerStore";
import { useNotifyStore } from "./stores/notifyStore";
import { ElNotification } from "element-plus";

let timer = false
// timer = useTimerStore();

// 存储音频实例的映射，用于手动控制播放/停止
const audioInstances = new Map();
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
    timer ||= useTimerStore();
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
        const notifyStore = useNotifyStore();
        notifyStore.addNotify(id, title, content);
    },
    notify_simple: (id = false) => {
        const the_timer = timer.get_timer(id)
        const notifyStore = useNotifyStore();
        notifyStore.addNotify(id, the_timer.des, '已结束');
    },
    tomato: (id, time_work, time_rest, repeat = false, time_rest_big = false) => {
        console.log('番茄钟任务');
        repeat ||= 1;
        time_rest_big ||= time_rest;
        const the_timer = timer.get_timer(id)
        the_timer.step ||= 0;
        the_timer.step += 1;
        if (the_timer.step % 2 === 0) {
            timer.set(the_timer, {
                timer_0: timer.now,
                jump: 0,
                time: time_work,
                state_code: 3,
            })
        } else {
            const rest_count = (the_timer.step + 1) / 2;
            console.log(rest_count % repeat);
            timer.set(the_timer, {
                // 检查是否为大课间，是的话使用大课间时间，否则使用小课间时间 
                timer_0: timer.now,
                jump: 0,
                time: ((rest_count % repeat) === 0) ? time_rest_big : time_rest,
                state_code: 3,
            })
        }
        timer.restart(the_timer)
    },
    open_url: (id = false, url) => {
        window.open(url, '_blank');
    },
    remove: (id) => {
        const the_timer = timer.get_timer(id)
        timer.remove(the_timer)
    },
    turn_up: (id) => {
        const the_timer = timer.get_timer(id)
        timer.set(the_timer, {
            time_0: timer.now,
            jump: 0,
            count_up: true,
            time: 0,
            state_code: 0,
        })
    },
    // 播放铃声或音乐
    play_sound: (id = false, soundUrl, volume = 1.0, duration = null, loop = false) => {
        try {
            // 如果之前有同ID的音频正在播放，则先停止
            if (id && audioInstances.has(id)) {
                const existingAudio = audioInstances.get(id);
                existingAudio.pause();
                existingAudio.currentTime = 0;
                audioInstances.delete(id);
            }

            const audio = new Audio(soundUrl);
            audio.volume = volume;
            audio.loop = loop;

            // 如果提供了ID，则存储音频实例以便后续控制
            if (id) {
                audioInstances.set(id, audio);
            }

            // 如果设置了持续时间，则在指定时间后停止播放
            if (duration !== null && !loop) {
                setTimeout(() => {
                    if (id && audioInstances.has(id)) {
                        audio.pause();
                        audio.currentTime = 0;
                        audioInstances.delete(id);
                    } else {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }, duration * 1000); // 将秒转换为毫秒
            }

            audio.play().catch(e => console.error('播放音频失败:', e));
        } catch (error) {
            console.error('创建音频对象失败:', error);
        }
    },
    // 调用系统通知
    system_notify: (id = false, title, body) => {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    },
    // 停止指定ID的音频播放
    stop_sound: (id) => {
        if (id && audioInstances.has(id)) {
            const audio = audioInstances.get(id);
            audio.pause();
            audio.currentTime = 0;
            audioInstances.delete(id);
            return true;
        }
        return false;
    },
    custom: (id = false, func) => {
        const the_timer = timer.get_timer(id)
        func(the_timer)
    }
}
