import { StatementLine } from './StatementLines';
import CommissionError from './CommissionError'

type CommissionStatement = {
    data: StatementLine[],
    errors: CommissionError[],
    discontinued: boolean,
    loanName: string,
    accountNumber: string,
    lender: string,
    loanAmount: number,
    uniqueId: string,
    index: number,
}

export default CommissionStatement;