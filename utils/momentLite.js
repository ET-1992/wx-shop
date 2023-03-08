/**
 * 格式化时间
 * @param	{Datetime} source 时间对象
 * @param	{String} format 格式
 * @return {String}				格式化过后的时间
 */
export const formatDate = (source, format) => {
    const o = {
        'M+': source.getMonth() + 1, // 月份
        'd+': source.getDate(), // 日
        'H+': source.getHours(), // 小时
        'm+': source.getMinutes(), // 分
        's+': source.getSeconds(), // 秒
        'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
        'f+': source.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (String(source.getFullYear())).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((String(o[k])).length)));
        }
    }
    return format;
};

export const startOfDayTS = (date) => {
    const _date = date instanceof Date ? date : new Date();
    _date.setHours(0);
    _date.setMinutes(0);
    _date.setSeconds(0);
    _date.setMilliseconds(0);
    return Date.parse(_date);
};

export const endOfDayTS = (date) => {
    const _date = date instanceof Date ? date : new Date();
    _date.setHours(23);
    _date.setMinutes(59);
    _date.setSeconds(59);
    _date.setMilliseconds(999);
    return Date.parse(_date);
};

