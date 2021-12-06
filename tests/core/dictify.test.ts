//import realData from '../commissions.json';
import loanAccounts from '../loanAccounts.json';
//import * as realData from '../commissions.json';
import commissionReport from '../../src/core/commissionReport'
import merge from 'lodash.merge';
import flatten from '../../src/core/flatten'
import hierarchise from '../../src/core/hierarchise';
import communise from '../../src/core/communise';

import CommissionGroup from '../../src/types/CommissionGroup';
import CommissionItem from '../../src/types/CommissionItem';
import ConnectiveCommissionsRcti from '../../src/types/ConnectiveCommissionsRcti';
import analyseCommissionGroup from '../../src/core/analyseCommission';
//import buildReport from '../../src/core/buildReport';
import statementLines from '../statementLines.json';
import { StatementLine } from '../../src/types/StatementLines';
import { LoanAccount } from '../../src/types/LoanAccounts';
import CommissionError from '../../src/types/CommissionError'
import buildReport from '../../src/core/buildReportV2';
import CommissionStatement from '../../src/types/CommissionStatement';
import findErrors from '../../src/core/findErrors';
//import findErrors from '../../src/core/findErrors';
import fs from 'fs'
    /*const hey = (d: number) => {
        const date = new Date(0)
        date.setUTCMilliseconds(d)
        return date
    }*/

const commissionDataReshaping = (statementLineData: StatementLine[][], allDates: number[]): CommissionStatement[] => {
    return statementLineData.map((statementLines: StatementLine[])=>({
        data: statementLines,
        errors: findErrors(statementLines, allDates),
        discontinued: false,
        loanName: statementLines[0].name,
        accountNumber: statementLines[0].accountNumber,
        loanAmount: statementLines[0].loanAmount,
        uniqueId: "",
        lender: "",
        index: 0,
    }))
}

test('Full integration test', () => {
    const statementLineData: StatementLine[][] = <StatementLine[][]>statementLines;
    const dateSet : Set<number> = new Set()
    statementLineData.forEach((statementLines)=>{
        statementLines.forEach((statement)=>{
            if(statement.startDate)
                dateSet.add(statement.startDate)
        })
    })
    const allDates: number[] = Array.from(dateSet).sort()

    const test: CommissionStatement[] = commissionDataReshaping(statementLineData, allDates)
    const report: string = buildReport(test)
    fs.writeFileSync('/mnt/c/Users/KierenFunk/Documents/report.html', report)
});
