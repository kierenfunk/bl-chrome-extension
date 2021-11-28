// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import { getAuth, setPersistence, signInWithEmailAndPassword} from "firebase/auth";
// import realData from '../tests/commissions.json';

const getData = async (token: string, partnerId: string) => {
  const response = await fetch(`https://commissionsapi.connective.com.au/commissions/api/${token}/rcti?search=true&currentPartnerId=${partnerId}&searchParams=%7B%22type%22%3A%22wholesale%22%7D`);
  const responseJson = await response.json();
  const accountNames: string[] = Array.from(
    new Set(responseJson.results.map((period: any) => period.accountName)),
  );
  const pendingDates: any = Object.fromEntries(accountNames.map((name) => [name, {}]));
  accountNames.forEach((name) => {
    responseJson.results.forEach((period: any) => {
      if (period.accountName === name) {
        if (!(period.endDate in pendingDates[name])) {
          pendingDates[name][period.endDate] = true;
        }
        pendingDates[name][period.endDate] = pendingDates[name][period.endDate] && (period.status === 'Final');
      }
    });
  });
  const initData = responseJson.results.filter((x: any) => pendingDates[x.accountName][x.endDate]);
  return Promise.all(initData.map(async (x: any) => fetch(`https://commissionsapi.connective.com.au/commissions/api/${token}/rctiline?search=true&actionType=getByRcti&rctiId=${x.uniqueId}&page=1&start=0&limit=100`).then((r) => r.json()).then((r) => ({ ...r, ...x })).catch((err) => console.error(err))));
};

chrome.runtime.onMessage.addListener(
  (message, _sender, _sendResponse) => {
    switch (message.cmd) {
      case 'getCommissionData':
        chrome.storage.sync.get('provider').then(({ provider }) => {
          getData(provider.token, provider.partnerId).then((r) => {
            _sendResponse({ status: 'success', payload: r });
            // _sendResponse({status: 'success', payload: realData})
          }).catch((e) => {
            _sendResponse({ status: 'error', payload: `failed to retrieve data: ${e}` });
          });
        }).catch((e) => {
          _sendResponse({ status: 'error', payload: `failed to retrieve data: ${e}` });
        });
        break;
      default:
        _sendResponse({ message: 'command not found' });
        break;
    }
    return true;
  },
);

/*
const config = {
  apiKey: 'AIzaSyDu_wd81YNT-AjK5lD9LEF-pVNWvKRtD20',
  authDomain: 'broker-labz.firebaseapp.com',
  projectId: 'broker-labz',
  storageBucket: 'broker-labz.appspot.com',
  messagingSenderId: '522588773435',
  appId: '1:522588773435:web:422617434e6da2c166101e',
  measurementId: 'G-JDKQ27QT7T',
};
firebase.initializeApp(config);
*/
/* const dbPromise = self.indexedDB.open('firebaseLocalStorageDb', 1);
dbPromise.onsuccess = function(event) {
  var db = dbPromise.result;
  let transaction = db.transaction("firebaseLocalStorage", "readonly"); // (1)

    // get an object store to operate on it
    let books = transaction.objectStore("firebaseLocalStorage"); // (2)
    let request = books.getAll()
    request.onsuccess = function(e){
        console.log(request.result)
    }
}; */
/*
//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
firebase.auth().onAuthStateChanged((user) => {
    console.log(user)
});

chrome.runtime.onMessage.addListener(
    function(message, _sender, _sendResponse) {
        if (message.type === "popupLoad") {
            const user = firebase.auth().currentUser;
            if(user)
                _sendResponse({type: "loggedIn"})
            else
                _sendResponse({type: "loggedOut"})
        } else if (message.type === "loginAttempt") {

            const auth = getAuth();
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                //return signInWithEmailAndPassword(auth, email, password);
                return signInWithEmailAndPassword(auth,
                    message.payload.email, message.payload.password)
            }).then((userCredential)=>{
                _sendResponse({type: "Success", payload: userCredential.user})
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                _sendResponse({type: "Error", payload: {code: error.code, message: error.message}})
            }); */
/* setPersistence(auth, firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
            });
            signInWithEmailAndPassword(auth, message.payload.email, message.payload.password)
            .then((userCredential) => {
                // Signed in
                _sendResponse({type: "Success", payload: userCredential.user})
            })
            .catch((error) => {
                _sendResponse({type: "Error", payload: {code: error.code, message: error.message}})
            }); */
/*        } else{
            // handle other types of messages
            _sendResponse({type: "Error", message: "message type not found"})
        };
        return true
    }); */
