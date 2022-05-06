import { useContext } from "react";
import { Context } from '../Context';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default () => {
  const context = useContext(Context);
  const { authenticatedUser } = context;
  const location = useLocation();
  const action = location.pathname === '/courses/create'
    ? 'creating a new course'
    : 'updating a course';

  // If authenticatedUser from Context is null, redirect to signin page
  return authenticatedUser ? <Outlet /> : <Navigate to="/signin" state={
    {
      prevPath: location.pathname,
      alertTheme: 'warning',
      alertMessage: `You must signin before ${action}.`
    }
  } />;
};
