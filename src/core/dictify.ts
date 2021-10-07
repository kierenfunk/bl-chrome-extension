import findErrors from './findErrors';
import isDiscontinued from './isDiscontinued';
import CommissionItem, { CommissionItemWrap } from "../types/CommissionItem"
import GlobalData from "../types/GlobalData"
import DictifiedComms from '../types/DictifiedComms';

const getHierarchyKey = (row: CommissionItem, level: string): string => {
    if(level === "accountName") return row.accountName
    else if(level === "loanName") return row.loanName
    else if(level === "accountNumber") return row.accountNumber
    else return row.loanAmount.toString()
}

const dictify = (data: CommissionItem[], indexList: string[], globalData: GlobalData): DictifiedComms | CommissionItemWrap => {
    if (indexList.length <= 0){
        // sort by endDate
        const returnValue: CommissionItemWrap = {
            data: data.sort((a,b)=>{
                return a.endDate - b.endDate
            }),
            errors: findErrors(data,globalData),
            discontinued: isDiscontinued(data, globalData)
        }
        return returnValue
    }

    let result = new Map();
    data.forEach((row)=>{
        const key: string = getHierarchyKey(row, indexList[0])
        if (!result.has(key)){
            result.set(key,[])
        }
        result.set(key,[...result.get(key), row])
    })
    return Array.from(result.entries()).reduce((obj,[key, commItems])=>{
        return {...obj, [key]: dictify(commItems, indexList.slice(1), globalData)}
    },{})
}

export default dictify;