import ConnectiveCommissionsRcti from '../types/ConnectiveCommissionsRcti';
import CommissionItem from '../types/CommissionItem';

const flatten = (data: ConnectiveCommissionsRcti[]): CommissionItem[] => data.reduce(
  (result: CommissionItem[], rcti: ConnectiveCommissionsRcti) => [...result, ...rcti.results.map(
    (rctiline) => ({
      accountName: rcti.accountName,
      startDate: rcti.startDate,
      endDate: rcti.endDate,
      ...rctiline,
      loanName: rctiline.loanName.trim(),
    }),
  )], [],
);

export default flatten;
