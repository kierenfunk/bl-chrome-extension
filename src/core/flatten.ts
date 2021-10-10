import ConnCommsRcti from '../types/ConnCommsRcti';
import CommissionItem from '../types/CommissionItem';

const flatten = (data: ConnCommsRcti[]): CommissionItem[] => data.reduce(
  (result: CommissionItem[], rcti: ConnCommsRcti) => [...result, ...rcti.results.map(
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
