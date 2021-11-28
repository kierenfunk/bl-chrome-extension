import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../style.css';
import zip from 'lodash.zip';
import commissionReport from '../core/commissionReport';
import { CommissionItemWrap } from '../types/CommissionItem';
import Close from '../icons/close';
import convertValue from '../core/convertValue';
import ChevronRight from '../icons/chevronRight';
import ChevronLeft from '../icons/chevronLeft';
import Download from '../icons/download';
import buildReport from '../core/buildReport';
import CommissionGroup from '../types/CommissionGroup';
import CommissionError from '../types/CommissionError';

const DownloadButton = ({ onClick, children }: any) => (
    <button
        className="text-gray-900 text-md font-bold bg-blue-400 hover:bg-blue-500 rounded flex p-2 drop-shadow-md justify-center items-center"
        type="button"
        onClick={onClick}
    >
        <div><Download/></div>
        {' '}
        <div>
            {children}
        </div>
    </button>
);

const BuildTable = ({ data }: any) => {
  if (!data) return null;
  // add errors
  const headerKeys = ['accountNumber', 'loanName', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commission', 'commissionPercent', 'totalPaid', 'gst', 'total', 'lender', 'startDate', 'endDate'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', '% Split', 'Paid', 'GST', 'Total', 'Lender', 'Period Start', 'Period End'];
  const header = zip(headerKeys, headerNames);

  return (
      <div className="p-2">
        {data.errors.map((e: CommissionError) => (<p className="text-red-500">{e.message}</p>))}
        <table className="table-auto border-collapse border border-black text-black">
            <tbody>
                <tr>
                    {header.map(([, name]) => <th className="border border-black p-1 font-bold">{name}</th>)}
                </tr>
                {data.data.map((row: any) => (
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
  const headerKeys = ['accountNumber', 'loanName', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commission', 'commissionPercent', 'totalPaid', 'gst', 'total', 'lender', 'startDate', 'endDate'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', '% Split', 'Paid', 'GST', 'Total', 'Lender', 'Period Start', 'Period End'];
  const header = zip(headerKeys, headerNames);

  const csvContent = `data:text/csv;charset=utf-8,${
    headerNames.join(',')}\n${
    data.map((row: any) => (
      header.map(([key]) => convertValue(row[key], key)).join(',')
    )).join('\n')}`;

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', `${month}-${year}-${date.getTime()}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const ErrorModal = ({
  tableData, errorModalSetter, nextError, prevError,
}: any) => {
  if (!tableData) return null;
  const downloader = () => {
    try {
      downloadCSVReport(tableData);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="fixed h-screen w-screen top-0 left-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <div className="fixed top-0 left-0 bg-black opacity-80 h-full w-full" style={{ zIndex: 0 }}></div>
        <div className="text-black bg-gray-100 rounded" style={{ zIndex: 1 }}>
            <div className="flex flex-col h-full w-full">
                <div className="border-b border-gray-300 px-4 py-2 flex items-center">
                    <div className="flex-1 text-lg font-bold">
                        {`${tableData.data[0].loanName}, ${tableData.data[0].lender}, ${convertValue(tableData.data[0].loanAmount, 'loanAmount')}`}
                    </div>
                    <div className="flex">
                        <div className="cursor-pointer" onClick={() => prevError()}>
                            <ChevronLeft/>
                        </div>
                        <div className="cursor-pointer" onClick={() => nextError()}>
                            <ChevronRight/>
                        </div>
                        <div className="cursor-pointer" onClick={() => errorModalSetter(-1)}>
                            <Close/>
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <BuildTable data={tableData}/>
                </div>
                <div className="border-t border-gray-300 py-2 px-4 flex justify-end">
                    <DownloadButton onClick={downloader}>Download CSV</DownloadButton>
                </div>
            </div>
        </div>
    </div>
  );
};

const downloadReport = (report: string) => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const url = window.URL.createObjectURL(new Blob([report], { type: 'text/html' }));
  const link = document.createElement('a');
  link.href = url;
  link.style.display = 'none';
  link.setAttribute('download', `Commission-Report-${month}-${year}-${date.getTime()}.html`);
  // Append to html link element page
  document.body.appendChild(link);
  // Start download
  link.click();
  // Clean up and remove the link
  link.parentNode.removeChild(link);
};

const ErrorPanel = ({
  data, errors, errorModalSetter, setLastPeriod, lastPeriod,
}: any) => {
  if (!errors) {
    return <div>loading...</div>;
  }

  const downloader = () => {
    try {
      downloadReport(buildReport(data));
    } catch (e) {
      alert(e);
    }
  };

  return (
        <div className="relative">
            {/* <div>
                <button type="button" onClick={()=>setLastPeriod(false)}>All time</button>
                <button type="button" onClick={()=>setLastPeriod(true)}>Last Period Only</button>
            </div> */}
            <div className="p-1 bg-gray-800 rounded">
                <p className="text-gray-100 text-lg">{errors.length} Warnings</p>
                {errors.map((row: CommissionItemWrap, i: number) => (
                    <div key={i} onClick={() => errorModalSetter(i)} className={`${i % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-red-800 cursor-pointer p-1 text-xs`}>{row.data[0].loanName}, {row.data[0].lender}, {convertValue(row.data[0].loanAmount, 'loanAmount')}</div>
                ))}
            </div>
            <DownloadButton onClick={downloader}>Download Full Report</DownloadButton>
        </div>
  );
};

const CommissionDisplay = ({
  data, errors, errorModalSetter, lastPeriod, setLastPeriod,
}: any) => (
        <div className="text-white">
            <p className="text-lg font-bold">Commissions</p>
            <ErrorPanel {...{
              lastPeriod, setLastPeriod, data, errors, errorModalSetter,
            }}/>
        </div>
);

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const sidebarWidth = 400;
  const [providerData, setProviderData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [lastPeriod, setLastPeriod] = useState(false);
  const [errorModalIndex, setErrorModalIndex] = useState(-1);

  useEffect(() => {
    chrome.runtime.sendMessage({ provider: 'connective', cmd: 'getCommissionData' }, (response) => {
      const flat = commissionReport(response.payload);
      const err = flat.filter((item: CommissionGroup) => item.errors.length > 0);
      setErrors(err);
      setProviderData(flat);
    });
  }, []);

  const nextError = () => {
    if (errors) {
      setErrorModalIndex((errorModalIndex + 1) % errors.length);
    }
  };
  const prevError = () => {
    if (errors) {
      setErrorModalIndex((errors.length + errorModalIndex - 1) % errors.length);
    }
  };

  return (
        <div className="">
            <button className="bg-gray-900 fixed top-20 transition-all rounded drop-shadow-md" style={{ right: open ? sidebarWidth - 4 : -4, zIndex: 99997 }} onClick={() => setOpen(!open)}>
                <p className="text-white">
                    {open ? <ChevronRight/> : <ChevronLeft/>}
                </p>
            </button>
            <div className="overflow-y-auto fixed top-0 right-0 h-screen bg-gray-900 transition-all p-2" style={{ transform: open ? 'translateX(0px)' : `translateX(${sidebarWidth}px)`, width: sidebarWidth, zIndex: 99998 }}>
                <CommissionDisplay data={providerData} errors={errors} errorModalSetter={setErrorModalIndex} lastPeriod={lastPeriod} setLastPeriod={setLastPeriod}/>
            </div>
            <ErrorModal tableData={errorModalIndex > -1 ? errors[errorModalIndex] : null} errorModalSetter={setErrorModalIndex} nextError={nextError} prevError={prevError}/>
        </div>
  );
};

const div = document.createElement('div');
div.id = 'sidebar';
document.body.appendChild(div);

// inject script into page
const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/inject.js');
(document.head || document.documentElement).appendChild(script);

window.addEventListener('BrokerLabzMessage', (data: CustomEvent) => {
  chrome.storage.sync.set({ provider: data.detail });
}, false);

ReactDOM.render(<Sidebar/>, document.getElementById('sidebar'));
