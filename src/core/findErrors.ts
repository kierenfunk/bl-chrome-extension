import CommissionItem from '../types/CommissionItem';
import GlobalData from '../types/GlobalData';

const findErrors = (data: CommissionItem[], globalData: GlobalData): string[] => {
  if (data.length < 1) return [];

  const { accountName } = data[0];
  const latestDate = globalData.latestDate[accountName];
  const periods = globalData.periods[accountName];

  const trails = data.filter((row) => row.commissionType === 'TC');
  const discharged = data.filter((row) => row.commissionType === 'DIS');
  const dates = trails.map((row) => row.endDate);
  const amounts = trails.map((row) => row.loanAmount);
  const amountSum = amounts.reduce((total, current) => total + current, 0);

  if (globalData.lastPeriod && dates.length > 0) {
    if (!periods.slice(periods.length - 2).includes(Math.max(...dates))) {
      return [];
    }
  }

  const errors: string[] = [];
  // check if trail commission has dropped off unexpectedly
  if (
    dates.length > 0
    && Math.max(...dates) !== latestDate
    && discharged.length < 1
    && amountSum > 0
  ) {
    /*
        Conditions:
            1. last trail entry is not the latest period
            2. Must have at least one trail entry
            3. Loan must not be discharged
            4. Loan must have amount greater than 0
        */
    errors.push('Potential trail drop off without discharge');
  }
  // check if there is unusual trail commission behaviour (payouts outside of expected variance)
  // get variance
  // console.log(trails.map(row=>row.total))

  return errors;
};

export default findErrors;
