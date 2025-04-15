console.log('Hello, World!');
function a(str) {
    console.log(str);
}
let b = []
function create_task(timer, func, ...args) {
    timer.tasks.push(
        () => void func(timer, ...args)
    )
}

let timer = { tasks: [] }
const replay = (timer) => {
    timer.time_0 = Date.now()
    
}