// inject script into page
var script = document.createElement('script'); 
script.src = chrome.runtime.getURL('inject.js');
(document.head||document.documentElement).appendChild(script);

const getCommissionData = async (data,event) => {
    // get data
    const originalText = event.target.textContent
    event.target.textContent = 'extracting data...'
    event.target.setAttribute('disabled', true)
    token = data.token
    partnerId = data.partnerId
    
    event.target.textContent = 'creating report...'
    try{
        const report = await fetch('https://heqow10921.execute-api.us-east-1.amazonaws.com/dev/',{
            method : "POST",
            body: JSON.stringify({token: token, partnerId: partnerId})
        })

        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear()

        const href = window.URL.createObjectURL(await report.blob());
        const a = document.createElement('a');
        a.href = href
        a.download = `Commission-Report-${month}-${year}.html`;
        a.setAttribute('target', '_blank');
        a.click();
        window.URL.revokeObjectURL(href);
        a.remove();
    }
    catch(err) {
        console.error(err)
    }

    event.target.textContent = originalText
    event.target.removeAttribute('disabled');
}

// Content script
window.addEventListener("BrokerLabzMessage", function(data) {
    var observer = new MutationObserver(function (m) {
        if(m[0] && !document.querySelector('#bl-commission-report') && m[0].target.querySelector("button[name='bulkDownload']")){
            const previousButton = m[0].target.querySelector("button[name='bulkDownload']")
            const newButton = previousButton.cloneNode(true);
            newButton.id = 'bl-commission-report'
            newButton.textContent = "Commission Tracking Report"
            removeAttributes = ['data-testid','name', 'label','disabled']
            for(let i = 0; i < removeAttributes.length; i++)
                newButton.removeAttribute(removeAttributes[i]);
            newButton.addEventListener('click', getCommissionData.bind(null,data.detail), false)
            newButton.style.backgroundColor = 'red'
            newButton.style.borderColor = 'red'
            previousButton.parentNode.insertBefore(newButton, previousButton.nextSibling);
        }
    });
    observer.observe(document.body, {childList: true});
}, false);
