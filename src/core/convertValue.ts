const convertValue = (value: number, key: string): string => {
    if(['dateSettled', 'startDate', 'endDate'].includes(key)){
        const d: Date = new Date(0)
        d.setUTCSeconds(value/1000);
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    }
    else if (['loanAmount', 'loanBalance', 'commission', 'totalPaid', 'gst', 'total'].includes(key)){
        return '$'+value.toFixed(2)
    }
    return value.toString()
}

export default convertValue;