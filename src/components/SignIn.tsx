// import React, { useEffect, useState } from 'react';
// import { Formik } from 'formik';
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
const SignInScreen = () : any => null;
/* const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [isLoading, setIsLoading] = useState(true); // Local signed-in state.
  const [userState, setUserState] = useState({
    loading: true,
    signedIn: false,
  });

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'popupLoad' }, (response) => {
      if (response.type === 'loggedIn') {
        setUserState({ ...userState, signedIn: true, loading: false });
      } else {
        setUserState({ ...userState, loading: false });
      }
    });
  }, []);

  if (userState.loading) {
    return <div>loading...</div>;
  } */

/* if (!userState.loading && !userState.signedIn) {
    return (
    <div>
      <h1>Sign in</h1>
      <Formik
       initialValues={{ email: '', password: '' }}
       validate={(values) => {
         const errors = {}; */
/* if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         } */
/* Object.keys(errors).reduce((obj,key)=>{
           return errors[key].length > 0? {...obj, [key]: errors[key]} : obj
         },{}) */
/* return errors;
       }}
       onSubmit={(values, { setSubmitting }) => {
         // setTimeout(() => {
         chrome.runtime.sendMessage({ type: 'loginAttempt', payload: values }, (response) => {
           console.log(response);
           if (response.type === 'Success') {
             setUserState({ ...userState, signedIn: true });
           }
           setSubmitting(false);
         });
         // , 4000);
       }}
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting, */
/* and other goodies */
/* }) => (
         <form onSubmit={handleSubmit}>
           <input
             type="email"
             name="email"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.email}
           />
           {errors.email && touched.email && errors.email}
           <input
             type="password"
             name="password"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.password}
           />
           {errors.password && touched.password && errors.password}
           <button type="submit" disabled={isSubmitting}>
             Submit
           </button>
         </form>
       )}
     </Formik>
    </div>
    );
  }
  if (!userState.loading && userState.signedIn) {
    return <div>logged in</div>;
  } */
// return null;
// Listen to the Firebase Auth state and set the local state.
/* useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  ); */

export default SignInScreen;
