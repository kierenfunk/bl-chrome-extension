import CommissionItem from '../types/CommissionItem';
import GlobalData from '../types/GlobalData';

const isDiscontinued = (data: CommissionItem[], globalData: GlobalData): boolean => {
  if (data.length < 1) return false;

  const { accountName } = data[0];
  const latestDate = globalData.latestDate[accountName];

  const dates = data.filter((row) => row.commissionType === 'TC').map((row) => row.endDate);
  const numberOfDateEntries = Array.from(new Set(dates)).length;

  if (numberOfDateEntries > 0 && Math.max(...dates) !== latestDate) {
    return true;
  }

  return false;
};

export default isDiscontinued;
