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