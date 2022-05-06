import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../Context';
import FormWrapper from '../FormWrapper/FormWrapper';

export default () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(Context);
  const { actions, authenticatedUser, authenticationError } = context;
  const [userInfo, setUserInfo] = useState({
    emailAddress: '',
    password: ''
  });
  let prevPath = location.state?.prevPath || '/';

  const handleSubmit = async () => {
    await actions.signIn({ emailAddress: userInfo.emailAddress, password: userInfo.password });
  };

  useEffect(() => {
    // If the Context > signIn() > getData() login request
    // updated the Context authenticatedUser state with user
    // data, then redirect them to the previous path.
    if (authenticatedUser?.emailAddress) {
      // Redirect the user to the page they were trying to access
      // before signing in, unless they were viewing certain pages.
      if (prevPath === '/error' || prevPath === '/forbidden' || prevPath === '/notfound' || prevPath === '/signup') {
        prevPath = '/';
      }
      navigate(prevPath, {
        replace: true,
        state: {
          alertTheme: 'success',
          alertMessage: 'You have successfully signed in!'
        }
      });
    }
  }, [authenticatedUser]);

  useEffect(() => {
    // On mount, if there's an authenticationError value in context
    // leftover from a previous failed attempt, then clear it, so
    // it's not displayed on subsequent renders by default.
    if (authenticationError?.message) {
      actions.clearAuthenticationError();
    }
  }, []);

  document.title = "User Sign-in";

  return (
    <div className="form-centered">
      <h2>Sign In</h2>
      <FormWrapper
        autoComplete="off"
        errors={[authenticationError?.message]}
        formId="signin-form"
        submit={handleSubmit}
        submitButtonText="Sign In"
        elements={() => (
          <>
            <label htmlFor="emailAddress">Email Address</label>
            <input
              name="emailAddress"
              placeholder="Enter your email address"
              type="email"
              value={userInfo.emailAddress}
              onChange={(e) => {
                setUserInfo({ ...userInfo, emailAddress: e.target.value });
              }} />
            <label htmlFor="password">Password</label>
            <input
              name="password"
              placeholder="Enter your password"
              type="password"
              value={userInfo.password}
              autoComplete="off"
              onChange={(e) => {
                setUserInfo({ ...userInfo, password: e.target.value });
              }} />
          </>
        )} />
      <p>Don't have a user account? Click here to <a href="/signup">sign up</a>!</p>
    </div>
  )
}
