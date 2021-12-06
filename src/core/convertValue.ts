const convertValue = (value: number, key: string): string => {

  if (['dateSettled', 'startDate', 'endDate'].includes(key)) {
    const d: Date = new Date(0);
    d.setUTCMilliseconds(value)
    return value? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` : '';
  }
  if (['loanAmount', 'loanBalance', 'commissionAmount', 'totalPaid', 'gstAmount', 'totalAmount'].includes(key)) {
    return `$${Number(value.toFixed(2)).toLocaleString()}`;
  }
  return value.toString();
};

export default convertValue;
