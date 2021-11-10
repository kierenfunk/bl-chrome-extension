import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Popup = () => {
  return <div>Hello, world!</div>;
}

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
  ReactDOM.render(<Popup />, document.getElementById('popup'));
});

/*export default function Popup() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

}*/