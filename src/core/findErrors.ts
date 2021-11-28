import CommissionItem from '../types/CommissionItem';
import CommissionError from '../types/CommissionError';

const findErrors = (data: CommissionItem[], periods: number []): CommissionError[] => {
  if (data.length < 1) return [];

  const latestDate = periods[periods.length - 1];

  const trails = data.filter((row) => row.commissionType === 'TC');
  const discharged = data.filter((row) => row.commissionType === 'DIS');
  const dates = trails.map((row) => row.endDate);
  const amounts = trails.map((row) => row.loanAmount);
  const amountSum = amounts.reduce((total, current) => total + current, 0);

  const errors: CommissionError[] = [];
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
    errors.push({
      period: Math.max(...dates),
      message: 'Potential trail drop off without discharge',
      type: null,
    });
  }
  // check if there is unusual trail commission behaviour (payouts outside of expected variance)
  // get variance
  // console.log(trails.map(row=>row.total))

  return errors;
};

export default findErrors;
