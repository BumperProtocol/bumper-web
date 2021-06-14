export const getDefaultTheme = () => {
    const date = new Date()
    const hour = date.getHours()
    return hour > 6 && hour < 18 ? 'light' : 'dark'
}

export const getDateText = (timestamp) => {
    const t = String(timestamp).length === 10 ? timestamp*1000 : timestamp
    const date = new Date(t)
    const year = date.getFullYear()
    const month = date.getMonth() < 9 ? '0'+ (date.getMonth()+1) : date.getMonth()+1
    const day =  date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
    const hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
    const second = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()
    return `${year}-${month}-${day} ${hour}:${second} GMT+8`
}

export const isNeedApprove = (approveMap, symbol, type, num) => {
    const statusKey = type + 'Status'
    const approvedKey = type + 'Approved'
    let flag = false
    if (approveMap[symbol][statusKey] !== true) { // never approve
        flag = true
    } else if (approveMap[symbol][approvedKey] < num) { // approve num is not enough
        flag = true
    }
    console.log(symbol, 'hasApproved:', approveMap[symbol][approvedKey], 'op:', num)
    return flag
}

export const approvedNumAdd = (add1, add2, length = 5) => {
    let num1 = typeof (add1) === 'string' ? Number(add1) : add1;
    let num2 = typeof (add2) === 'string' ? Number(add2) : add2;
    return (num1 + num2).toFixed(length)
}

export const calPriceImpact = (num, reserve0, reserve1, mintRatio, type) => {
    const r0 = Number(reserve0) // bcToken
    const r1 = Number(reserve1) // paired
    let x = 0
    let impact = 0 
    if (type === 'borrow') {
        x = num * Number(mintRatio) 
        impact = Math.abs(x / (r1+x))
    } else if (type === 'lend') {
        x = Number(num)
        impact = Math.abs(x / (r0+x))
    }
    return Math.round(impact * 10000) / 100
}