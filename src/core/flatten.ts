import ConnCommsRcti from '../types/ConnCommsRcti';
import CommissionItem from '../types/CommissionItem';

const flatten = (data: ConnCommsRcti[]): CommissionItem[] => {
    return data.reduce((result: CommissionItem[], rcti: ConnCommsRcti)=>{
        return [...result, ...rcti.results.map(rctiline=>{
            return {
                accountName: rcti.accountName,
                startDate: rcti.startDate,
                endDate: rcti.endDate,
                ...rctiline,
                loanName: rctiline.loanName.trim()
            }
        })]
    },[])
}

export default flatten