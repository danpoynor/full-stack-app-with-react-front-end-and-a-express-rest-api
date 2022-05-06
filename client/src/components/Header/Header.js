import { useContext } from "react";
import { Context } from '../../Context';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './Header.css'

export default () => {
  const context = useContext(Context);
  const { authenticatedUser } = context;
  const location = useLocation();

  return (
    <header>
      <div className="wrap">
        <h1>{location.pathname === '/' ? 'Courses' : <Link to="/">Courses</Link>}</h1>
        <nav>
          {authenticatedUser ?
            <>
              <span>Welcome, {authenticatedUser.firstName} {authenticatedUser.lastName}!</span>
              <Link to="/signout">Sign Out</Link>
            </>
            :
            <>
              {location.pathname === '/signup'
                ? <span>Sign Up</span>
                : <Link to="/signup" state={{ prevPath: location.pathname }}>Sign Up</Link>}
              {location.pathname === '/signin'
                ? <span>Sign In</span>
                // Pass the current path to the SignIn component as a prop so
                // it can be used to redirect the user to the previous path
                // after a successful sign in.
                : <Link to="/signin" state={{ prevPath: location.pathname }}>Sign In</Link>}
            </>
          }
        </nav>
      </div>
    </header>
  );
};
