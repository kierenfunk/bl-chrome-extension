import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../style.css';
import zip from 'lodash.zip';
import Close from '../icons/close';
import convertValue from '../core/convertValue';
import ChevronRight from '../icons/chevronRight';
import ChevronLeft from '../icons/chevronLeft';
import buildReport from '../core/buildReportV2';
import CommissionError from '../types/CommissionError';
import { LoanAccount } from '../types/LoanAccounts';
import CommissionStatement from '../types/CommissionStatement';
import { StatementLine } from '../types/StatementLines';
import DownloadButton from '../components/DownloadButton';
import Modal from '../components/Modal';
import Panel from '../components/Panel';

const BuildTable = ({ tableData }: any) => {
  if (!tableData) return null;
  // add errors
  const headerKeys = ['accountNumber', 'name', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commissionAmount', 'gstAmount', 'totalAmount', 'lender', 'startDate', 'comments'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', 'GST', 'Total', 'Lender', 'Period Start', 'Comments'];
  const header = zip(headerKeys, headerNames);

  const errorMessages: string[] = Array.from(new Set(tableData.errors.map((e: CommissionError)=>e.message)))

  return (
      <div className="p-2">
        {errorMessages.map((message: string) => (<p className="text-red-500">{message}</p>))}
        <table className="table-auto border-collapse border border-black text-black">
          <tbody>
              <tr>
                  {header.map(([, name]) => <th className="border border-black p-1 font-bold">{name}</th>)}
              </tr>
              {tableData.data.map((row: any) => (
                      <tr>
                          {header.map(([key]) => <td className="border border-black p-1">{convertValue(row[key], key)}</td>)}
                      </tr>
              ))}
          </tbody>
        </table>
      </div>
  );
};

const downloadCSVReport = ({ data }: any) => {

  const headerKeys = ['accountNumber', 'name', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commissionAmount', 'gstAmount', 'totalAmount', 'lender', 'startDate', 'comments'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', 'GST', 'Total', 'Lender', 'Period Start', 'Comments'];
  const header = zip(headerKeys, headerNames);

  const csvContent = `data:text/csv;charset=utf-8,${
    headerNames.join(',')}\n${
    data.map((row: any) => (
      header.map(([key]) => convertValue(row[key], key).replace(',','')).join(',')
    )).join('\n')}`;
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', `BrokerLabz-${month}-${year}-${date.getTime()}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const downloadReport = (report: string) => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const url = window.URL.createObjectURL(new Blob([report], { type: 'text/html' }));
  const link = document.createElement('a');
  link.href = url;
  link.style.display = 'none';
  link.setAttribute('download', `BrokerLabz-Commission-Report-${month}-${year}-${date.getTime()}.html`);
  // Append to html link element page
  document.body.appendChild(link);
  // Start download
  link.click();
  // Clean up and remove the link
  link.parentNode.removeChild(link);
};

const CommissionModal = ({setCommsModalIndex, tableData}: any) => {
  if (!tableData) return null;
  return (
    <Modal>
      <div className="border-b border-gray-300 px-4 py-2 flex items-center">
          <div className="flex-1 text-lg font-bold">
              {`${tableData.loanName}, ${tableData.lender}, ${convertValue(tableData.loanAmount, 'loanAmount')}`}
          </div>
          <div className="flex">
              {/*<div className="cursor-pointer" onClick={() => prevError()}>
                  <ChevronLeft/>
              </div>
              <div className="cursor-pointer" onClick={() => nextError()}>
                  <ChevronRight/>
              </div>*/}
              <div className="cursor-pointer" onClick={() => setCommsModalIndex(-1)}>
                  <Close/>
              </div>
          </div>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <BuildTable {...{tableData}}/>
      </div>
      <div className="border-t border-gray-300 py-2 px-4 flex justify-end">
          <DownloadButton onClick={()=>downloadCSVReport(tableData)}>Download CSV</DownloadButton>
      </div>
  </Modal>
  )
}

const CommissionErrors = ({statements, setCommsModalIndex}: any) => {
  if(!statements)
    return <div className="text-white">Getting entire history of commission data...</div>
  const noDataYet = statements.filter(({data}: CommissionStatement)=>data.length > 0).length < 1
  if(noDataYet)
    return <div className="text-white">Getting entire history of commission data...</div>
  const errors = statements.filter(({errors}: CommissionStatement)=>errors.length > 0)

  return (
        <div className="relative">
            <div className="p-1 bg-gray-800 rounded">
                <p className="text-gray-100 text-lg">{errors.length} Warnings</p>
                {errors.map((statement: CommissionStatement, i: number) => (
                    <div 
                      key={statement.index} 
                      className={`${i % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-red-800 cursor-pointer p-1 text-xs`}
                      onClick={() => setCommsModalIndex(statement.index)}
                    >
                      {statement.loanName}, {statement.lender}, {convertValue(statement.loanAmount, 'loanAmount')}
                    </div>
                ))}
            </div>
            <DownloadButton onClick={()=>downloadReport(buildReport(statements))}>Download Full Report</DownloadButton>
        </div>
  );
};

type Creds = {
  token: string,
  partnerId: string
}

type State = {
  creds: Creds, 
  loanAccounts: CommissionStatement[],
  open: boolean
}

const Sidebar = () => {
  const initState : State = {
    creds: {
      token: null, 
      partnerId: null
    },
    loanAccounts: null,
    open: true
  }
  const [open, setOpen] = useState(true);
  const [commsModalIndex, setCommsModalIndex] = useState(-1);
  const sidebarWidth = 400;
  const [state, setState] = useState(initState)

  useEffect(() => {
    // inject script into page
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/inject.js');
    (document.head || document.documentElement).appendChild(script);

    // get credentials
    window.addEventListener('BrokerLabzMessage', (data: CustomEvent) => {
      setState({...state, creds:data.detail})
      // get loanAccount data
      chrome.runtime.sendMessage({ provider: 'connective', cmd: 'getLoanAccounts', payload: data.detail }, (response) => {
        const statementLineData: StatementLine[] = []
        const statementLineErrors: CommissionError[] = []
        const statements: CommissionStatement[] = response.payload.map((loanAccount: LoanAccount)=>({
          data: statementLineData,
          errors: statementLineErrors,
          discontinued: false,
          loanName: loanAccount.lastName,
          accountNumber: loanAccount.number,
          loanAmount: loanAccount.loanAmount,
          uniqueId: loanAccount.uniqueId,
          lender: loanAccount.lender,
        }))
        setState({...state, creds:data.detail, loanAccounts: statements})
        // get statementLines for each loan account
        chrome.runtime.sendMessage({ provider: 'connective', cmd: 'getStatementLines', payload: {statements,creds:data.detail} }, (slResponse) => {
          const indexedPayload = slResponse.payload.map((statement: CommissionStatement,index: number)=>({...statement, index: index}))
          setState({...state, creds:data.detail, 
            loanAccounts: indexedPayload
          })
          // run analysis on all commissionStatements
          chrome.runtime.sendMessage({ provider: 'connective', cmd: 'analyseCommission', payload: indexedPayload }, (analysis) => {
            setState({...state, creds:data.detail, loanAccounts: analysis.payload})
          });
        });
      });
    }, false);
  }, [state]);

  return (
        <div>
            <button className="bg-gray-900 fixed top-20 transition-all rounded drop-shadow-md" style={{ right: open ? sidebarWidth - 4 : -4, zIndex: 99997 }} onClick={() => setOpen(!open)}>
                <p className="text-white">
                    {open ? <ChevronRight/> : <ChevronLeft/>}
                </p>
            </button>
            <div className="overflow-y-auto fixed top-0 right-0 h-screen bg-gray-900 transition-all p-2" style={{ transform: open ? 'translateX(0px)' : `translateX(${sidebarWidth}px)`, width: sidebarWidth, zIndex: 99998 }}>
            {(()=>{
              if(!state.creds.token){
                return <div className="text-white">Retrieving credentials...</div>
              }
              return (
                <Panel header="Commissions">
                  <CommissionErrors {...{statements:state.loanAccounts, setCommsModalIndex}} />
                </Panel>
                )
            })()}
            </div>
            <CommissionModal {...{setCommsModalIndex, tableData: commsModalIndex > -1 ? state.loanAccounts[commsModalIndex] : null}}/>
        </div>
  );
};

const div = document.createElement('div');
div.id = 'sidebar';
document.body.appendChild(div);

ReactDOM.render(<Sidebar/>, document.getElementById('sidebar'));
