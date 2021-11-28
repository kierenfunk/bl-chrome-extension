import CommissionGroup from '../types/CommissionGroup';
import findErrors from './findErrors';
import isDiscontinued from './isDiscontinued';

const analyseCommissionGroup = (group: CommissionGroup, periods: number[]): CommissionGroup => {
  return {
    ...group,
    errors: findErrors(group.data, periods),
    discontinued: isDiscontinued(group.data, periods),
  };
  // if (group.data.length < 1) return group;

  // const { accountName } = group;

  /* const trails = data.filter((row) => row.commissionType === 'TC');
  const discharged = data.filter((row) => row.commissionType === 'DIS');
  const dates = trails.map((row) => row.endDate);
  const amounts = trails.map((row) => row.loanAmount);
  const amountSum = amounts.reduce((total, current) => total + current, 0); */

  /* if (globalData.lastPeriod && dates.length > 0) {
    if (!periods.slice(periods.length - 2).includes(Math.max(...dates))) {
      return [];
    }
  } */

  // const errors: string[] = [];
  // check if trail commission has dropped off unexpectedly
  /* if (
    dates.length > 0
    && Math.max(...dates) !== latestDate
    && discharged.length < 1
    && amountSum > 0
  ) { */
  /*
        Conditions:
            1. last trail entry is not the latest period
            2. Must have at least one trail entry
            3. Loan must not be discharged
            4. Loan must have amount greater than 0
        */
  // errors.push('Potential trail drop off without discharge');
  // }
  // check if there is unusual trail commission behaviour (payouts outside of expected variance)
  // get variance
  // console.log(trails.map(row=>row.total))

  return group;
};

export default analyseCommissionGroup;
