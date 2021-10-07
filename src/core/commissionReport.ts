import merge from 'lodash.merge';
import zip from 'lodash.zip';
import dictify from './dictify';
import flatten from './flatten';
import buildReport from './buildReport';
import ConnCommsRcti from '../types/ConnCommsRcti';
import GlobalData from '../types/GlobalData';
import DictifiedComms from '../types/DictifiedComms';

const commissionReport = (data: ConnCommsRcti[], lastPeriod: boolean = false) : string => {
  // get accounts
  const accountNames: string[] = Array.from(new Set(data.map((period) => period.accountName)));
  // get latest date
  const globalData: GlobalData = {
    latestDate: Array.from(accountNames).reduce((obj, accountName) => ({ ...obj, [accountName]: Math.max(...data.filter((item) => item.accountName === accountName).map((item) => item.endDate)) }), {}),
    periods: Array.from(accountNames).reduce((obj, accountName) => ({ ...obj, [accountName]: Array.from(new Set(data.filter((item) => item.accountName === accountName).map((item) => item.endDate))).sort() }), {}),
    lastPeriod,
  };

  // shape data into a hierarchy for the table
  const hierarchy: string[] = ['accountName', 'loanName', 'accountNumber', 'loanAmount'];
  const dataMap = dictify(flatten(data), hierarchy, globalData);

  // merge accountNames together
  const y: DictifiedComms = Object.values(dataMap).reduce((result, values) => merge(result, values), {});

  // get header names
  const headerKeys = ['accountNumber', 'loanName', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commission', 'commissionPercent', 'totalPaid', 'gst', 'total', 'lender', 'startDate', 'endDate'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', '% Split', 'Paid', 'GST', 'Total', 'Lender', 'Period Start', 'Period End'];
  const header = zip(headerKeys, headerNames);

  // build report
  return buildReport(header, y);
};

export default commissionReport;
