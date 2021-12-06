type LoanAccounts = {
    count: number,
    offset: number,
    results: LoanAccount[],
    totalCount: number
};

export type LoanAccount = {
    agent: string
    agentName: string
    agentTcPercent: number
    agentUfcPercent: number
    associate: string
    associateName: string
    brokerId: string
    company: string
    createdBy: string
    createdOn: number
    dateAllocated: number
    dateCreated: number
    dateSettled: number
    deletedBy: string
    deletedByDisplay: string
    deletedOn: number
    firstName: string
    introducer: string
    introducerName: string
    isDeleted: boolean
    isNew: boolean
    lastName: string
    lender: string
    lenderNameShort: string
    loanAmount: number
    loanBalance: number
    mercuryLenderId: string
    number: string
    parentId: string
    parentType: string
    productCode: string
    split1Owner: string
    split1OwnerName: string
    split1Tc: number
    split1TcType: string
    split1Ufc: number
    split1UfcType: string
    split2Owner: string
    split2OwnerName: string
    split2Tc: number
    split2TcType: string
    split2Ufc: number
    split2UfcType: string
    split3Owner: string
    split3OwnerName: string
    split3Tc: number
    split3TcType: string
    split3Ufc: number
    split3UfcType: string
    split4Owner: string
    split4OwnerName: string
    split4Tc: number
    split4TcType: string
    split4Ufc: number
    split4UfcType: string
    splittingTemplate: boolean
    statementId: string
    uniqueId: string
}

export default LoanAccounts;

