// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import { getAuth, setPersistence, signInWithEmailAndPassword} from "firebase/auth";
import testData from '../tests/test.json';

import LoanAccounts from "./types/LoanAccounts";
import StatementLines from "./types/StatementLines";
import CommissionStatement from "./types/CommissionStatement";
import analyseCommission from "./core/analyseCommission";

const getLoanAccounts = async (token: string, partnerId: string) => {
  const response = await fetch(`https://commissionsapi.connective.com.au/commissions/api/${token}/loanaccount?search=true&currentPartnerId=${partnerId}&method=getLoanAccountsByPartnerId&associateId=all`);
  const { results } : LoanAccounts = await response.json();
  return results
}

const getStatementLine = async (token: string, statement: CommissionStatement): Promise<CommissionStatement> => {
  const response = await fetch(`https://commissionsapi.connective.com.au/commissions/api/${token}/statementline?search=true&number=${statement.accountNumber}&lender=${statement.lender}&page=1&start=1&limit=100`)
  const { results } : StatementLines = await response.json();
  return {...statement, data: results}
}

const getStatementLines = async (token: string, statements: CommissionStatement[]) => {
  return testData
  /*return await Promise.all(
    statements.map(statement=>getStatementLine(token, statement))
  )*/
}

const getLenders = async () => {
  //"https://m5api.connective.com.au/api/master/Services/ServiceProviderList5.jsp?serviceType=Residential%20Loans&partnerId=P202861&page=1&start=0&limit=25"
}

chrome.runtime.onMessage.addListener(
  (message, _sender, _sendResponse) => {
    switch (message.cmd) {
      case 'getLoanAccounts':
        getLoanAccounts(message.payload.token, message.payload.partnerId
        ).then((response)=>{
          _sendResponse({ status: 'success', payload: response });
        }).catch((e) => {
          _sendResponse({ status: 'error', payload: `failed to retrieve data: ${e}` });
        });
        break;
      case 'getStatementLines':
        getStatementLines(message.payload.creds.token, message.payload.statements
        ).then((response)=>{
          _sendResponse({ status: 'success', payload: response });
        }).catch((e) => {
          _sendResponse({ status: 'error', payload: `failed to retrieve data: ${e}` });
        });
        break;
      case 'analyseCommission':
        _sendResponse({ status: 'success', payload: analyseCommission(message.payload) });
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
