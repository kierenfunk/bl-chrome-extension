import flatten from './flatten';
import CommissionItem from '../types/CommissionItem';
import hierarchise from './hierarchise';
import CommissionGroup from '../types/CommissionGroup';
import communise from './communise';
import analyseCommissionGroup from './analyseCommissionGroup';

const commissionReport = (data: any, lastPeriod: boolean = false) : CommissionGroup[] => {
  const accountNames: string[] = Array.from(new Set(data.map((period: any) => period.accountName)));
  const periods: any = Array.from(accountNames).reduce((obj, accountName) => ({
    ...obj,
    [accountName]: Array.from(new Set(data.filter(
      (item: any) => item.accountName === accountName,
    ).map(
      (item: any) => item.endDate,
    ))).sort(),
  }), {});
  const flattenedData: CommissionItem[] = flatten(data);
  const hierarchy: string[] = ['accountName', 'loanName', 'accountNumber', 'loanAmount'];
  const hierarchisedData: any = hierarchise(flattenedData, hierarchy);
  const flat: CommissionGroup[] = communise(hierarchisedData, hierarchy.length);
  return flat.map(
    (item: CommissionGroup) => analyseCommissionGroup(item, periods[item.accountName]),
  );
  // get accounts
  /* const accountNames: string[] = Array.from(new Set(data.map((period) => period.accountName)));
  // get latest date
  const globalData: GlobalData = {
    latestDate: Array.from(accountNames).reduce(
      (obj, accountName) => (
        {
          ...obj,
          [accountName]: Math.max(...data.filter(
            (item) => item.accountName === accountName,
          ).map(
            (item) => item.endDate,
          )),
        }), {},
    ),
    periods: Array.from(accountNames).reduce(
      (obj, accountName) => (
        {
          ...obj,
          [accountName]: Array.from(new Set(data.filter(
            (item) => item.accountName === accountName,
          ).map(
            (item) => item.endDate,
          ))).sort(),
        }), {},
    ),
    lastPeriod,
  }; */

  // shape data into a hierarchy for the table
  // const hierarchy: string[] = ['accountName', 'loanName', 'accountNumber', 'loanAmount'];
  // const dataMap = dictify(flatten(data), hierarchy, globalData);

  // merge accountNames together
  /* const y: DictifiedComms = Object.values(dataMap).reduce(
    (result, values) => merge(result, values), {},
  ); */
};

export default commissionReport;
