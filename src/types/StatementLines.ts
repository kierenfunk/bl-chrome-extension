type StatementLines = {
    count: number
    offset: number
    results: StatementLine[]
    totalCount: number
};

export type StatementLine = {
    accountNumber: string
arrearsMonths: number
brokerId: string
comments: string
commissionAmount: number
commissionType: string
company: null
createdBy: null
createdOn: null
dateSettled: number
deletedBy: string
deletedByDisplay: null
deletedOn: null
dischargeDate: null
endDate: null
gstAmount: number
isDeleted: null
isNew: null
lender: string
loanAmount: number
loanBalance: number
name: string
noGST: null
parentId: null
parentType: null
productCode: null
startDate: number
statementId: string
totalAmount: number
uniqueId: string
}

export default StatementLines;