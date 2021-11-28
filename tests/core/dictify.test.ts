import realData from '../commissions.json';
//import * as realData from '../commissions.json';
import commissionReport from '../../src/core/commissionReport'
import merge from 'lodash.merge';
import flatten from '../../src/core/flatten'
import hierarchise from '../../src/core/hierarchise';
import communise from '../../src/core/communise';

import CommissionGroup from '../../src/types/CommissionGroup';
import CommissionItem from '../../src/types/CommissionItem';
import ConnectiveCommissionsRcti from '../../src/types/ConnectiveCommissionsRcti';
import analyseCommissionGroup from '../../src/core/analyseCommissionGroup';
import buildReport from '../../src/core/buildReport';

test('Full integration test', () => {
    const testData: ConnectiveCommissionsRcti[] = <ConnectiveCommissionsRcti[]>realData;
    const data = commissionReport(testData)
    buildReport(data)
});

/*test('running', () => {
    // from connective data to standardised data
    const testData: ConnectiveCommissionsRcti[] = <ConnectiveCommissionsRcti[]>realData;
    const flattenedData: CommissionItem[] = flatten(testData)
    // group together
    const hierarchy: string[] = ['accountName', 'loanName', 'accountNumber', 'loanAmount'];
    const hierarchisedData: any = hierarchise(flattenedData, hierarchy)
    const flat: CommissionGroup[] = communise(hierarchisedData, hierarchy.length)

    // todo: hierarchise for CommissionGroup list
    // communise(hierarchise(flat, hierarchy, false),hierarchy.length)

    //console.log(flat)
});*/

/*test('testing dictify', () => {
    fs.writeFile('tests/test-report.html', commissionReport(data), function (err) {
        if (err) throw err;
    });
});*/