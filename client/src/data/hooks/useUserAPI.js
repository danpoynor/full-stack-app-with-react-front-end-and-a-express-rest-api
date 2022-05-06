import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Api, isValidApiResponse } from '../APIUtils';

export default () => {
  const didMount = useRef(false);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getData = async req => {
    if (req) {
      Api({
        method: req.method || 'GET',
        path: req.path,
        body: req.body,
        requiresAuth: req.requiresAuth || false,
        encodedCredentials: req.encodedCredentials || null
      })
        .then(async res => {
          if (await isValidApiResponse(res, [200, 201, 204, 400, 401, 403, 404]) === false) {
            navigate('/error');
          } else if (res.status === 200) {
            // Ok
            setData(await res.json());
          } else if (res.status === 201) {
            // Created
            navigate('/signin', {
              state: {
                alertTheme: 'success',
                alertMessage: 'Account successfully created. You can now sign in.'
              }
            });
          } else if (res.status === 204) {
            // No Content (received on PUT)
            const location = res.headers.get('Location');
            navigate(location);
          } else if (res.status === 400) {
            // Bad Request
            await res.json().then(data => {
              setError(data.errors);
            });
          } else if (res.status === 401) {
            // Unauthorized (unauthenticated)
            await res.json().then(data => {
              // Pass server error message to signin page via Context data
              // setData(data);
              setError(data);
            });
          } else if (res.status === 403) {
            // Access Denied
            navigate('/forbidden');
          } else if (res.status === 404) {
            // Not Found
            navigate('/notfound', {
              state: {
                message: "Sorry! We could not find the user you were looking for."
              }
            })
          } else {
            console.error('res.status: ', res.status);
            setError(res.status);
          }
        })
        .catch(err => {
          console.error('err: ', err);
          setError(err);
        })
      setIsLoaded(true);
    }
  }

  useEffect((req) => {
    // Here I'm avoiding getData() being called more than once.
    // TODO: Might want to re-test if this is still needed.
    // NOTE: I'm using a useRef() to hold the value instead of useState() to
    // prevent a rerender when the didMount state changes.
    if (didMount.current) {
      getData(req).then();
    } else {
      didMount.current = true;
    }
  }, [data]);

  return { data, error, isLoaded, getData };
};
