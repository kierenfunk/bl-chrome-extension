export type CommissionItemWrap = {
  data: CommissionItem[],
  errors: string[],
  discontinued: boolean
};

type CommissionItem = {
  accountName: string,
  accountNumber: string,
  loanName: string,
  dateSettled: number,
  loanAmount: number,
  loanBalance: number,
  commissionType: string,
  commission: number,
  commissionPercent: number,
  totalPaid: number,
  gst: number,
  total: number,
  lender: string,
  startDate: number,
  endDate: number,
};

export default CommissionItem;
