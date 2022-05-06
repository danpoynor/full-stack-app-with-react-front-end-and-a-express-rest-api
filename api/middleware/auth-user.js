const { User } = require('../models');
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

// NOTE: bcrypt vs bcryptjs
// https://github.com/kelektiv/node.bcrypt.js/issues/705
// https://github.com/kelektiv/node.bcrypt.js/wiki/bcrypt-vs-bcrypt.js
// In short bcryptjs is optimized bcrypt in plain JavaScript with zero dependencies.
// [bcrypt.js](https://github.com/dcodeIO/bcrypt.js#readme)

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
  let message; // store the message to display

  // Parse the user's credentials from the Authorization header with basic-auth
  const credentials = auth(req);

  // Check if the user's credentials are available
  if (credentials) {
    // TODO: Might eventually want to use userName when logging in instead of emailAddress.
    // const user = await User.findOne({ where: { userName: credentials.name } });
    const user = await User.findOne({ where: { emailAddress: credentials.name } });

    // Check if a user was successfully retrieved from the database
    if (user) {
      // NOTE: `compare() is async and should be more efficient than using compareSync().
      // https://github.com/dcodeIO/bcrypt.js#usage---async
      // Internally the compareSync() (or compare()) method hashes user's password
      // before comparing it to the stored hashed value.
      const authenticated = await bcrypt.compare(credentials.pass, user.confirmedPassword);

      // If the passwords match
      if (authenticated) {
        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        // Assign message for Authentication failure
        message = `Authentication failure for emailAddress: ${user.emailAddress}`;
      }
    } else {
      // Assign message no User found failure
      message = `User not found for emailAddress: ${credentials.emailAddress}`;
    }
  } else {
    // Assign message for no authentication header failure
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    // NOTE: The generic message returned to the response body is intentionally
    // vague because returning a more specific message, such as "Username not
    // found" or "Incorrect password" would help anyone to attempting to hack
    // a user account.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};
