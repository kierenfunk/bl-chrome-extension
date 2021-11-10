import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignInScreen from '../components/SignIn';

const Popup = () => <SignInScreen/>;

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  ReactDOM.render(<Popup />, document.getElementById('popup'));
});

/* export default function Popup() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

} */
