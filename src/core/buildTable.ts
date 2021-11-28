import convertValue from './convertValue';
import CommissionError from '../types/CommissionError';

const buildTable = (header: [string, string][], data: any) => {
  // add errors
  let result = data.errors.map((e:CommissionError) => `<p class="error-message">${e.message}</p>`).join('');
  result += '<table>\n<tbody>\n';
  result += `\t<tr>\n${header.map(([, name]) => `\t\t<th>${name}</th>`).join('\n')}\n\t</tr>\n`;
  result += data.data.map((row: any) => `\t<tr>\n${header.map(([key]) => `\t\t<td>${convertValue(row[key], key)}</td>`).join('\n')}\n\t</tr>\n`).join('');
  result += '</tbody>\n</table>\n';
  return result;
};

export default buildTable;
