import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Api, isValidApiResponse } from '../APIUtils';

export default () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getData = req => {
    Api({
      method: req.method,
      path: req.path,
      body: req.body,
      requiresAuth: req.requiresAuth || false,
      encodedCredentials: req.encodedCredentials || null
    })
      .then(async res => {
        if (await isValidApiResponse(res, [200, 201, 204, 400, 403, 404]) === false) {
          navigate('/error');
        } else if (res.status === 200) {
          // Ok
          setData(await res.json());
        } else if ([201, 204].includes(res.status)) {
          // 201 Created
          // 204 No Content (received on PUT or DELETE)
          const location = res.headers.get('Location');
          const message = `Course successfully ${res.status === 201 ? 'created' : 'updated'}.`;
          navigate(location, {
            state: {
              alertTheme: 'success',
              alertMessage: message
            }
          });
        } else if (res.status === 400) {
          // Bad Request
          await res.json().then(data => {
            setError(data.errors);
          });
        } else if (res.status === 403) {
          // Access Denied
          navigate('/forbidden');
        } else if (res.status === 404) {
          // Not Found
          navigate('/notfound', {
            state: {
              message: "Sorry! We could not find the course you were looking for."
            }
          })
        } else {
          console.error('res.status: ', res.status);
          setError(res.status);
        }
      })
    setData([]);
    setIsLoaded(true);
  }

  return { data, error, isLoaded, getData };
};
