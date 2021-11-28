import CommissionItem from '../types/CommissionItem';

const isDiscontinued = (data: CommissionItem[], periods: number[]): boolean => {
  if (data.length < 1) return false;

  const latestDate = periods[periods.length - 1];

  const dates = data.filter((row) => row.commissionType === 'TC').map((row) => row.endDate);
  const numberOfDateEntries = Array.from(new Set(dates)).length;

  if (numberOfDateEntries > 0 && Math.max(...dates) !== latestDate) {
    return true;
  }

  return false;
};

export default isDiscontinued;
