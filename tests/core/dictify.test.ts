import realData from '../commissions.json';
import ConnCommsRcti from '../../src/types/ConnCommsRcti';
//import * as realData from '../commissions.json';
import commissionReport from '../../src/core/commissionReport'
import flatten from '../../src/core/flatten'
//import fs from 'fs';

/**/

test('running', () => {
    const testData: ConnCommsRcti[] = <ConnCommsRcti[]>realData;
    console.log(commissionReport(testData))
});

/*test('testing dictify', () => {
    fs.writeFile('tests/test-report.html', commissionReport(data), function (err) {
        if (err) throw err;
    });
});*/