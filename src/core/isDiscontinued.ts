import CommissionItem from '../types/CommissionItem';
import CommissionError from '../types/CommissionError';
import { StatementLine } from '../types/StatementLines';

const isDiscontinued = (statementLines: StatementLine[], allDates: number[]): boolean  => {
  if (statementLines.length < 1) return false;

  const discharged: boolean = statementLines.filter(({commissionType})=>commissionType === 'DIS').length > 0
  if(discharged)
    return true

  const trails: StatementLine[] = statementLines.filter(({commissionType})=>['TC', 'ARR'].includes(commissionType))
  // get a list of dates
  const dates: number[] = Array.from(new Set(trails.map(({startDate})=>startDate))).sort()
  if(dates.length > 0){
    const diff = Math.floor((allDates[allDates.length-1]-dates[dates.length-1])/(1000*60*60*24))
    if(diff > 32)
      return true;
  }

  return false;
};

export default isDiscontinued;
