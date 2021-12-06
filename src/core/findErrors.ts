import CommissionError from '../types/CommissionError';
import { StatementLine } from '../types/StatementLines';

const findErrors = (statementLines: StatementLine[], allDates: number[]): CommissionError[]  => {

    const errors: CommissionError[] = [];

    // get trails and arrear notices
    const trails: StatementLine[] = statementLines.filter(({commissionType})=>['TC', 'ARR'].includes(commissionType))
    // get a list of dates
    const dates: number[] = Array.from(new Set(trails.map(({startDate})=>startDate))).sort()
    // has there been a discharge?
    const discharged: boolean = statementLines.filter(({commissionType})=>commissionType === 'DIS').length > 0
    // does a UFC payout exist?
    const UFCPayout: boolean = statementLines.filter(({commissionType, totalAmount })=>commissionType === 'UFC' && totalAmount < 0).length > 0

    // is there a potential trail drop off?
    // if dates exist, if last trail commission payment is not zero, if not discharged and no UFC payout exists
    if(dates.length > 0 && trails[trails.length-1].loanBalance > 0 && !discharged && !UFCPayout){
        // calculate the difference between the last date for this statement and the last date for all dates
        const diff = Math.floor((allDates[allDates.length-1]-dates[dates.length-1])/(1000*60*60*24))
        // if longer than 32 days since the last payout, trigger an error
        if(diff > 32){
            errors.push({period: null, message: "Potential trail drop off without discharge", type: null, uniqueId: null})
        }
    }

    // are there any negative trail commissions?
    const negativeAmounts: StatementLine[] = statementLines.filter(({totalAmount, commissionType})=>totalAmount < 0 && commissionType === 'TC')
    negativeAmounts.forEach((statement: StatementLine)=>{
        errors.push({period: statement.startDate, message: "Trail commission is negative", type: null, uniqueId: statement.uniqueId})
    })

    // are there any negative loan balances?
    const negativeBalances: StatementLine[] = statementLines.filter(({loanBalance})=> loanBalance < 0)
    negativeBalances.forEach((statement: StatementLine)=>{
        errors.push({period: statement.startDate, message: "Loan balance is negative", type: null, uniqueId: statement.uniqueId})
    })

    // are there any statements in arrears?
    const arrears: StatementLine[] = statementLines.filter(({commissionType})=>commissionType === 'ARR')
    arrears.forEach((statement: StatementLine)=>{
        errors.push({period: statement.startDate, message: "Client is in arrears", type: null, uniqueId: statement.uniqueId})
    })

    return errors
};

export default findErrors;
