import flatten from './flatten';
import CommissionItem from '../types/CommissionItem';
import hierarchise from './hierarchise';
import CommissionGroup from '../types/CommissionGroup';
import communise from './communise';
import analyseCommissionGroup from './analyseCommission';

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
  return null
  /*return flat.map(
    (item: CommissionGroup) => analyseCommissionGroup(item, periods[item.accountName]),
  );*/
};

export default commissionReport;
