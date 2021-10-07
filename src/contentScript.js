import commissionReport from './core/commissionReport';

// inject script into page
const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/inject.js');
(document.head || document.documentElement).appendChild(script);

const getData = async (token, partnerId) => {
  const response = await fetch(`https://commissionsapi.connective.com.au/commissions/api/${token}/rcti?search=true&currentPartnerId=${partnerId}&searchParams=%7B%22type%22%3A%22wholesale%22%7D`);
  const responseJson = await response.json();
  const initData = responseJson.results.filter((x) => x.status === 'Final');
  return Promise.all(initData.map(async (x) => fetch(`https://commissionsapi.connective.com.au/commissions/api/${token}/rctiline?search=true&actionType=getByRcti&rctiId=${x.uniqueId}&page=1&start=0&limit=100`).then((r) => r.json()).then((r) => ({ ...r, ...x })).catch((err) => console.error(err))));
};

const getCommissionData = async (data, event) => {
  // get data
  const originalText = event.target.textContent;
  event.target.textContent = 'generating report...';
  event.target.setAttribute('disabled', true);
  const { token, partnerId, lastPeriod } = data;

  try {
    const fetchedData = await getData(token, partnerId);
    const report = commissionReport(fetchedData, lastPeriod);

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const testBlob = new Blob([report], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(testBlob);
    a.download = `Commission-Report-${month}-${year}.html`;
    a.setAttribute('target', '_blank');
    a.click();
    window.URL.revokeObjectURL(a.href);
    a.remove();
  } catch (err) {
    // eslint-disable-next-line
    console.log(err)
  }

  event.target.textContent = originalText;
  event.target.removeAttribute('disabled');
};

// Content script
window.addEventListener('BrokerLabzMessage', (data) => {
  const observer = new MutationObserver((m) => {
    if (m[0] && !document.querySelector('#bl-commission-report') && m[0].target.querySelector("button[name='bulkDownloadCSV']")) {
      const parent = m[0].target.querySelector("button[name='bulkDownloadCSV']").parentNode;
      const buttonGroup = document.createElement('div');
      buttonGroup.id = 'bl-commission-report';

      const firstButton = document.createElement('button');
      firstButton.classList.add('btn');
      firstButton.classList.add('btn-primary');
      firstButton.classList.add('btn-sm');
      firstButton.style.margin = '2px 10px 6px 5px';
      firstButton.style.backgroundColor = 'red';
      firstButton.style.borderColor = 'red';
      const secondButton = firstButton.cloneNode();
      firstButton.textContent = 'Commission Tracking Report - Full';
      secondButton.textContent = 'Commission Tracking Report - Last Period';
      firstButton.addEventListener('click', getCommissionData.bind(null, { ...data.detail, lastPeriod: false }), false);
      secondButton.addEventListener('click', getCommissionData.bind(null, { ...data.detail, lastPeriod: true }), false);

      buttonGroup.appendChild(firstButton);
      buttonGroup.appendChild(secondButton);
      parent.appendChild(buttonGroup);
    }
  });
  observer.observe(document.body, { childList: true });
}, false);
