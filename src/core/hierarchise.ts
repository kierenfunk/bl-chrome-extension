import CommissionItem from '../types/CommissionItem';

const hierarchise = (data: any, indexList: string[], init: boolean = true): any => {
  if (indexList.length <= 0) {
    if (init) {
      return {
        // sort by endDate
        data: data.sort((a: CommissionItem, b: CommissionItem) => a.endDate - b.endDate),
        errors: [],
        discontinued: false,
        accountName: data[0].accountName,
        loanName: data[0].loanName,
        accountNumber: data[0].accountNumber,
        loanAmount: data[0].loanAmount,
      };
    }

    return data[0];
  }

  const result = new Map();
  data.forEach((row: any) => {
    const key: string = row[indexList[0]];
    if (!result.has(key)) {
      result.set(key, []);
    }
    result.set(key, [...result.get(key), row]);
  });
  return Array.from(result.entries()).reduce(
    (obj, [key, commItems]) => (
      {
        ...obj,
        [key]: hierarchise(commItems, indexList.slice(1), init),
      }), {},
  );
};

export default hierarchise;
