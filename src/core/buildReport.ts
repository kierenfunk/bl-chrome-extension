import zip from 'lodash.zip';
import merge from 'lodash.merge';
import buildTable from './buildTable';
import hierarchise from './hierarchise';

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

const builder = (header: [string, string][], data: any, height = 0) => {
  const helpText = ['', 'Account: ', 'Loan Amount: $'];
  if (height >= 3) {
    return { output: `<div class="indent">${buildTable(header, data)}</div>\n`, hasError: data.errors.length > 0 };
  }
  let output = '';
  const keys = Object.keys(data).sort();
  let hasError = false;
  keys.forEach((key) => {
    output += height < 1 ? '<div>\n' : '<div class="indent">';
    const result = builder(header, data[key], height + 1);
    hasError = hasError || result.hasError;
    output += `<p class="${result.hasError ? 'error' : ''}" onclick="toggle(this)">${helpText[height]}${key}</p>\n`;
    output += result.output;
    output += '</div>\n';
  });
  return { output, hasError };
};

const buildReport = (flatData: any) : any => {
  const hierarchy: string[] = ['accountName', 'loanName', 'accountNumber', 'loanAmount'];
  const data: any = Object.values(hierarchise(flatData, hierarchy, false)).reduce(
    (result, values) => merge(result, values), {},
  );
  // get header names
  const headerKeys = ['accountNumber', 'loanName', 'dateSettled', 'loanAmount', 'loanBalance', 'commissionType', 'commission', 'commissionPercent', 'totalPaid', 'gst', 'total', 'lender', 'startDate', 'endDate'];
  const headerNames = ['Account', 'Name', 'Settled', 'Loan Amount', 'Balance', 'Type', 'Net Amount', '% Split', 'Paid', 'GST', 'Total', 'Lender', 'Period Start', 'Period End'];
  const header = zip(headerKeys, headerNames);

  // seperate errors from nonErrors
  const errors : any = {};
  const nonErrors : any = {};
  Object.entries(data).forEach(([key, a]) => {
    let hasErrors = false;
    Object.entries(a).forEach(([,b]) => {
      Object.entries(b).forEach(([,c]: any) => {
        if (c.errors.length > 0) {
          hasErrors = true;
        }
      });
    });
    if (hasErrors) errors[key] = a;
    else nonErrors[key] = a;
  });

  // split discontinued from continued
  const continued : any = {};
  const discontinued : any = {};
  Object.entries(nonErrors).forEach(([key, a]) => {
    let hasDiscontinued = true;
    Object.entries(a).forEach(([,b]) => {
      Object.entries(b).forEach(([,c]: any) => {
        if (!c.discontinued) {
          hasDiscontinued = false;
        }
      });
    });
    if (hasDiscontinued) discontinued[key] = a;
    else continued[key] = a;
  });

  let output = templateTop;
  output += '<h2>Errors:</h2>';
  output += builder(header, errors).output;
  output += '<h2>Current Clients:</h2>';
  output += builder(header, continued).output;
  output += '<h2>Discontinued Clients:</h2>';
  output += builder(header, discontinued).output;
  output += templateBottom;
  return output;
};

export default buildReport;
