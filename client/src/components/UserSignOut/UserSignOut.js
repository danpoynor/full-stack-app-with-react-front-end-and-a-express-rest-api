import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from '../../Context';

export default () => {
  const context = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    context.actions.signOut();
    navigate('/', {
      state: {
        alertTheme: 'success',
        alertMessage: 'You have successfully signed out.'
      }
    })
  }, [context.actions, navigate]);

  return null;
}
