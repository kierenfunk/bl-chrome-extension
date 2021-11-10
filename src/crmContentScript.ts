const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/inject.js');
(document.head || document.documentElement).appendChild(script);

window.addEventListener('BrokerLabzMessage', (data) => {
  const observer = new MutationObserver((m) => {
      console.log(m)
    //if (m[0]) {
        //console.log(data)
      /*const parent = m[0].target.querySelector("button[name='bulkDownloadCSV']").parentNode;
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
      parent.appendChild(buttonGroup);*/
    //}
  });
  observer.observe(document.body, { childList: true });
}, false);

