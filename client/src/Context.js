import { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import useUserAPI from './data/hooks/useUserAPI';

export const Context = createContext({});

// NOTE: All consumers that are descendants of a Provider will re-render
// whenever the Provider's value prop changes.
export function Provider(props) {
  const cookie = Cookies.get('authenticatedUser');
  const [authenticatedUser, setAuthenticatedUser] = useState(cookie ? JSON.parse(cookie) : null);
  const [authenticationError, setAuthenticationError] = useState(null);
  const [encodedCredentials, setEncodedCredentials] = useState(null);
  const { data, error, getData } = useUserAPI();

  const signIn = async (credentials) => {
    // NOTE: btoa is deprecated in Node. Using the browsers built-in
    // `window.` version explicitly here.
    setEncodedCredentials(window.btoa(`${credentials.emailAddress}:${credentials.password}`));
    await getData({
      path: '/users',
      requiresAuth: true,
      encodedCredentials: window.btoa(`${credentials.emailAddress}:${credentials.password}`)
    });
  };

  const signOut = () => {
    setAuthenticatedUser(null);
    Cookies.remove('authenticatedUser');
  };

  const clearAuthenticationError = () => {
    setAuthenticationError(null);
  }

  useEffect(() => {
    // If getData() updated the data value with a new user,
    // then set the authenticatedUser value.
    if (data?.emailAddress) {
      data.encodedCredentials = encodedCredentials;
      setAuthenticatedUser(data);
      const cookieOptions = {
        expires: 1 // 1 day
      };
      Cookies.set('authenticatedUser', JSON.stringify(data), cookieOptions);
    }
  }, [data]);

  useEffect(() => {
    // If getData() updated the error value,
    // then set the authenticationError value
    // for the UserSignIn component to use.
    // TODO: Using the error value from signIn{getData(...)} above to set the
    // value of AuthenticationError seems like it could be handled better.
    // Perhaps there's a way for UserSignIn.js to receive the validation error
    // message directly without the need to set the value here in Context.js.
    setAuthenticationError(error);
  }, [error]);

  const value = {
    authenticatedUser,
    authenticationError,
    data,
    actions: {
      signIn: signIn,
      signOut: signOut,
      clearAuthenticationError: clearAuthenticationError
    }
  };

  return (
    <Context.Provider value={value}>{props.children}</Context.Provider>
  );
}
