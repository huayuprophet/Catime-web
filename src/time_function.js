export function timestamp_to_time(milliseconds) {
    const date = new Date(milliseconds);
    // 获取小时、分钟和秒数，getHours返回0-23，getMinutes和getSeconds返回0-59
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    // 返回格式化的时间字符串
    return `${hours}:${minutes}:${seconds}`;
}
export function ms_to_time(milliseconds) {
    // 计算总秒数
    let totalSeconds = Math.floor(milliseconds / 1000);
    // 计算小时数
    let hours = Math.floor(totalSeconds / 3600);
    // 剩余的秒数
    totalSeconds %= 3600;
    // 计算分钟数
    let minutes = Math.floor(totalSeconds / 60);
    // 剩余的秒数
    let seconds = totalSeconds % 60;
    // 使用padStart确保小时、分钟和秒数始终为两位数
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
}
export function timestamp_to_date(milliseconds) {
    // 创建一个Date对象，使用传入的毫秒时间戳
    const date = new Date(milliseconds);
    // 获取年份、月份和日期
    const year = date.getFullYear();
    // getMonth返回0-11，所以需要加1，并且使用padStart确保月份是两位数
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // getDate返回1-31，同样使用padStart确保日期是两位数
    const day = date.getDate().toString().padStart(2, '0');
    // 返回格式化的日期字符串
    return `${year}/${month}/${day}`;
}
export function timestamp_to_datetime(milliseconds) {
    return timestamp_to_date(milliseconds) + ' ' + timestamp_to_time(milliseconds)
}
export function str_to_millseconds(str) {
    // let str = count_down_setting.value
    // 使用正则表达式来匹配一个非数字字符
    let strArray = str.split(/\D/);
    let numArray = strArray.map(Number);
    let len = numArray.length;
    let after = 0
    if (len === 1) {
        let m = numArray[0] * 60000
        after = m
        console.log(1);
    } else if (len === 2) {
        let m = numArray[0] * 60000
        let s = numArray[1] * 1000
        after = m + s
        console.log(2);
    } else if (len === 3) {
        let h = numArray[0] * 360000
        let m = numArray[1] * 60000
        let s = numArray[2] * 1000
        after = h + m + s
        console.log(3);
    } else {
        console.log('无效');
        return
    }
    return after
}
export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}