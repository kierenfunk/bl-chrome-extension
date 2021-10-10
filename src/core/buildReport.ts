import CommissionItem, { CommissionItemWrap } from '../types/CommissionItem';
import DictifiedComms from '../types/DictifiedComms';
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

const buildTable = (header: [string, string][], data: any) => {
  // add errors
  let result = data.errors.map((e:string) => `<p class="error-message">${e}</p>`).join('');
  result += '<table>\n<tbody>\n';
  result += `\t<tr>\n${header.map(([, name]) => `\t\t<th>${name}</th>`).join('\n')}\n\t</tr>\n`;
  result += data.data.map((row: any) => `\t<tr>\n${header.map(([key]) => `\t\t<td>${convertValue(row[key], key)}</td>`).join('\n')}\n\t</tr>\n`).join('');
  result += '</tbody>\n</table>\n';
  return result;
};

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

const getCommissionItemValues = (
  data: CommissionItemWrap,
  key: string,
) : string[] | boolean | CommissionItem[] => {
  if (key === 'errors') return data.errors;
  if (key === 'discontinued') return data.discontinued;
  return data.data;
};

const descend = (dataMap: any, retrieveKey: string, height: number = 2): any => {
  if (height < 1) return [getCommissionItemValues(dataMap, retrieveKey)];
  return Object.values(dataMap).reduce(
    (arr: any, value) => [...arr, ...descend(value, retrieveKey, height - 1)],
    [],
  );
};

const split = (
  dataMap: DictifiedComms,
  retrieve: string,
  reducer: Function,
  reducerInit: boolean = true,
): [DictifiedComms, DictifiedComms] => [
  Object.entries(dataMap).reduce((res, [key, entry]) => {
    if (!descend(entry, retrieve).reduce(reducer, reducerInit)) return { ...res, [key]: entry };
    return res;
  }, {}),
  Object.entries(dataMap).reduce((res, [key, entry]) => {
    if (descend(entry, retrieve).reduce(reducer, reducerInit)) return { ...res, [key]: entry };
    return res;
  }, {}),
];

const buildReport = (header: [string, string][], data: DictifiedComms) => {
  // seperate errors from continued
  const [nonErrors, errors] = split(data, 'errors', (a: boolean, b: string[]) => (a || (b.length > 0)), false);

  // split discontinued from continued
  const [continued, discontinued] = split(nonErrors, 'discontinued', (a: boolean, b: boolean) => (a && b));

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
