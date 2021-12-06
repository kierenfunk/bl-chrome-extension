import CommissionStatement from '../types/CommissionStatement';
import findErrors from './findErrors';
import isDiscontinued from './isDiscontinued';

const analyseCommission = (statements: CommissionStatement[]): CommissionStatement[] => {
    const dateSet : Set<number> = new Set()
    statements.forEach(({data})=>{
        data.forEach((statement)=>{
            if(statement.startDate)
                dateSet.add(statement.startDate)
        })
    })
    const allDates: number[] = Array.from(dateSet).sort()

    return statements.map((statement)=>({
      ...statement,
      errors: findErrors(statement.data, allDates),
      discontinued: isDiscontinued(statement.data, allDates)
    }))
};

export default analyseCommission;
