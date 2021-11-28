import CommissionItem from './CommissionItem';
import CommissionError from './CommissionError';

type CommissionGroup = {
  data: CommissionItem[],
  errors: CommissionError[],
  discontinued: boolean,
  accountName: string,
  loanName: string,
  accountNumber: string,
  loanAmount: number
};

export default CommissionGroup;
