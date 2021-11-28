import getCommissionItemValues from './getCommissionItemValues';

const descend = (dataMap: any, retrieveKey: string, height: number = 2): any => {
  if (height < 1) return [getCommissionItemValues(dataMap, retrieveKey)];
  return Object.values(dataMap).reduce(
    (arr: any, value) => [...arr, ...descend(value, retrieveKey, height - 1)],
    [],
  );
};

export default descend;
