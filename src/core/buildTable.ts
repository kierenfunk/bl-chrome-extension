import convertValue from './convertValue';
import CommissionError from '../types/CommissionError';

const buildTable = (header: [string, string][], data: any) => {
  // add errors
  const errorMessages: string[] = Array.from(new Set(data.errors.map((e: CommissionError)=>e.message)))
  let result = errorMessages.map((message: string) => `<p class="error-message">${message}</p>`).join('');
  result += '<table>\n<tbody>\n';
  result += `\t<tr>\n${header.map(([, name]) => `\t\t<th>${name}</th>`).join('\n')}\n\t</tr>\n`;
  result += data.data.map((row: any) => `\t<tr>\n${header.map(([key]) => `\t\t<td>${convertValue(row[key], key)}</td>`).join('\n')}\n\t</tr>\n`).join('');
  result += '</tbody>\n</table>\n';
  return result;
};

export default buildTable;
