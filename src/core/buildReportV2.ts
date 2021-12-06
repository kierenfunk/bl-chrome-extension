import zip from 'lodash.zip';
import CommissionStatement from '../types/CommissionStatement';
import CommissionError from '../types/CommissionError';
import convertValue from './convertValue';

const templateTop = `
<html>
    <head>
        <style type="text/css">
            html {
                font-family: sans-serif;
            }
            .root {
                padding:1em 2em;
            }
            p {
                background-color: #ADC6D2;
                padding:0.2em 0.4em;
                margin:0.2em 0;
                cursor:pointer;
                font-size:14px;
            }
            .error {
                background-color: #F87171;
            }
            .error-message, .error-message:hover {
                background-color: transparent;
                color:red;
                cursor: auto;
            }
            p:hover {
                background-color: #F1CDB4;
            }
            .indent {
                margin-left:1em;
                display:none;
            }
            table, td, th {
                border: 1px solid black;
                border-collapse: collapse;
                background-color: #F0F4F5;
            }
            th {
                font-size:14px;
                padding:0.4em;
            }
            td {
                padding:0.2em;
                font-size:12px;
            }
        </style>
    </head>
    <body>
        <div class="root">
            <h1>Trail Commission Analysis Report - ${new Date()}</h1><hr>
`;

const templateBottom = `
        </div>
    </body>
    <script>
        const toggle = (node) => {
            node = node.nextElementSibling
            while(node){
                node.style.display = (node.style.display === "block")? 'none' : 'block'
                node = node.nextElementSibling;
            }
        }
    </script>
</html>
`;

const buildTable = (header: [string, string][], statement: CommissionStatement): string => {
    const errorMessages: string[] = Array.from(new Set(statement.errors.map((e: CommissionError)=>e.message)))
    let result = errorMessages.map((message: string) => `<p class="error-message">${message}</p>`).join('');
    result += '<table><tbody>';
    result += `<tr>${header.map(([, name]) => `<th>${name}</th>`).join('')}</tr>`;
    result += statement.data.map((row: any) => `\t<tr>\n${header.map(([key]) => `\t\t<td>${convertValue(row[key], key)}</td>`).join('\n')}\n\t</tr>\n`).join('');
    result += '</tbody>\n</table>\n';
    return result;
}

const builder = (header: [string, string][], data: CommissionStatement[]) : string => {
    return data.map((statement: CommissionStatement)=>{
       let output = '<div>' 
       output += `<p class="${statement.errors.length > 0 ? 'error' : ''}" onclick="toggle(this)">${statement.loanName} ${statement.accountNumber}</p>`;
       output += `<div class="indent">${buildTable(header, statement)}</div>`
       output += '</div>\n'
       return output
    }).join('')
}

const buildReport = (data: CommissionStatement[]) : string => {

  // get header names
  const headerKeys = ['accountNumber', 'name', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commissionAmount', 'gstAmount', 'totalAmount', 'lender', 'startDate', 'comments'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', 'GST', 'Total', 'Lender', 'Period Start', 'Comments'];
  const header = zip(headerKeys, headerNames);

  const errors: CommissionStatement[] = data.filter((statement: CommissionStatement)=>statement.errors.length > 0)
  const nonErrors: CommissionStatement[] = data.filter((statement: CommissionStatement)=>statement.errors.length < 1)

  const continued: CommissionStatement[] = nonErrors.filter((statement: CommissionStatement)=>!statement.discontinued)
  const discontinued: CommissionStatement[] = nonErrors.filter((statement: CommissionStatement)=>statement.discontinued)

  let output = templateTop;
  output += '<h2>Errors:</h2>';
  output += builder(header, errors);
  output += '<h2>Current Clients:</h2>';
  output += builder(header, continued);
  output += '<h2>Discontinued Clients:</h2>';
  output += builder(header, discontinued);
  output += templateBottom;
  return output;
}

export default buildReport;