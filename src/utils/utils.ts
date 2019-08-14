/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/

export function log(data: { text: string, ping?: number }) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[36m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        } else if (data.ping > 50) {
            console.log('[\x1b[36m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        } else {
            console.log('[\x1b[36m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    } else {
        console.log('[\x1b[36m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}
export function warn(data: { text: string, ping?: number }) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[31m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        } else if (data.ping > 50) {
            console.log('[\x1b[31m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        } else {
            console.log('[\x1b[31m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    } else {
        console.log('[\x1b[31m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}
export function system(data: { text: string, ping?: number }) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[32m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        } else if (data.ping > 50) {
            console.log('[\x1b[32m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        } else {
            console.log('[\x1b[32m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    } else {
        console.log('[\x1b[32m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}

export function normalizePort(val: number | string): number | string | boolean {
    const normalizedPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(normalizedPort)) {
        return val;
    } else if (normalizedPort >= 0) {
        return normalizedPort;
    } else {
        return false;
    }
}

function format(date: Date, format: string) {
    const weekName: Array<string> = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    let h;
     
    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return date.getFullYear();
            case "yy": return (date.getFullYear() % 1000).toString().slice(0,2);
            case "MM": return (date.getMonth() + 1).toString().slice(0,2);
            case "dd": return date.getDate().toString().slice(0,2);
            case "E": return weekName[date.getDay()];
            case "HH": return (date.getHours()<10?'0'+date.getHours():date.getHours().toString()).slice(0,2);
            case "hh": return ((h = date.getHours() % 12) ? h : 12).toString().slice(0,2);
            case "mm": return (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes().toString()).slice(0,2);
            case "ss": return (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds().toString()).slice(0,2);
            case "a/p": return date.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};