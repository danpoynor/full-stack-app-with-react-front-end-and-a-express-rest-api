import config from '../config';

/**
 * isAuthorized: checks if user is authorized to perform API requests on resource.
 *
 * @param {*} user - authenticatedUser object from Context
 * @param {*} data - data object from Api request
 *
 * @returns {boolean} - true if user is authorized, false otherwise
 *
 * @example
 * isAuthorized(user, { requiresAuth: true }) // returns true
 *
 */

export const isAuthorized = ({ user, data }) => {
  if (user !== user.id && data && data.userId) {
    if (data.userId !== user.id) {
      return false;
    }
  }
  return true;
}

/* -------------------------------------------------------------------------- */

/**
 * Api: Fetch function
 *
 * @description Function is used to make API calls.
 *
 * @param {object} req - request object
 * @param {string} req.method - The HTTP method to use. Default is 'GET'.
 * @param {string} req.path - The path to the API endpoint, such as '/course'.
 * @param {object} req.body - The body of the request. Default is null.
 * @param {boolean} req.requiresAuth - Whether the request requires authentication. Default is false.
 * @param {object} req.encodedCredentials - The credentials to use for authentication. Value is comes from value stored in context.authenticatedUser after a user logs in. Default is null.
 *
 * @returns {Promise} - A promise that resolves to the response from the API.
 *
 * @example
 * const response = await APIUtils.fetch( { method: 'GET', path: 'users/1', body: userInfo, requiresAuth: false, encodedCredentials: null });
 * const response = await APIUtils.fetch( { method: 'PUT', path: 'courses/1', body: userInfo, requiresAuth: true, encodedCredentials: 'am9lQHNqb2VwYXNtaXRoLmNvbTpzd29yZA' });
 */

export const Api = async (req) => {
  const method = req.method || 'GET';
  const path = req.path || '';
  const requiresAuth = req.requiresAuth || false;
  const encodedCredentials = req.encodedCredentials || null;
  const url = config.apiBaseUrl + path;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  if (req.body !== null) {
    options.body = JSON.stringify(req.body);
  }

  if (requiresAuth) {
    options.headers['Authorization'] = `Basic ${encodedCredentials}`;
  }

  return fetch(url, options);
}

/* -------------------------------------------------------------------------- */

/**
 * isValidApiResponse: Test response from API
 *
 * @description Function to test for server responses, including:
 *              - 201/204 responses should include 'location' header.
 *              - 400 range errors should include 'content-type' json header.
 *              - 500 range errors responses.
 *
 * @param {object} res - The response object received from the API request.
 * @param {array} expectedStatusCodes - Array of expected status codes.
 *
 * @returns {boolean} - Returns true if the response is valid.
 */

export const isValidApiResponse = async (res, expectedStatusCodes) => {
  // If we have an array of expected status codes, and the response status code
  // is not in the array, then the response is invalid.
  if (expectedStatusCodes && !expectedStatusCodes.includes(res.status)) {
    return false;
  }

  // If response code is 201 (Created) or 204 (No Content),
  // res.header should have a location value.
  if (res.status === 201 || res.status === 204) {
    const location = await res.headers.get('location');
    if (!location || location.length === 0) {
      return false;
    }
  }

  // 400 Range: Client Error Response codes
  // should include a content type of 'application/json'.
  if (res.status >= 400 && res.status < 500) {
    const contentType = await res.headers.get('content-type');
    if (!contentType.includes('application/json')) {
      return false;
    }
  }

  // 500 Range: Server Error Response codes
  // NOTE: Since the received expectedStatusCodes array would most likely not
  // include 500 range errors as being expected, the first block above should
  // catch server errors so this will probably never be called.
  return !(res.status >= 500 && res.status < 600);
}
