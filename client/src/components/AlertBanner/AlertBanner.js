import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './AlertBanner.css';

/**
 * Alert Banner component
 *
 * @description Used to display an alert banner notifying user of completion or
 * failure of certain actions. This component is persisted in the `<Layout />`
 * component and only appears when it receives `alertTheme` and `alertMessage`
 * values from `location.state`.
 *
 * @returns {JSX.Element}
 *
 * @example
 * navigate('/signin', {
 *  state: {
 *    alertTheme: 'success',
 *    alertMessage: 'Your account was successfully created. Please sign in!'
 *  }
 * });
 */

export default () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleDismiss = (event) => {
    event.preventDefault();
    const alertBanner = event.target.parentNode;
    alertBanner.classList.add('dismissed');
  };

  useEffect(() => {
    // Reset location.state so alert banner doesn't appear again on page reloads
    navigate(location.pathname, { state: null, replace: true });

    // Remove alert banners from the DOM if Escape key is pressed
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        document.querySelectorAll('.alert-banner').forEach(alertBanner => {
          alertBanner.classList.add('dismissed');
        })
      }
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [])

  if (location.state?.alertTheme && location.state?.alertMessage) {
    return (
      <div
        className={`alert-banner alert-${location.state.alertTheme} slide-down-from-top-center`}
        role="alert">
        <p>{location.state.alertMessage}</p>
        <button type="button"
          className="btn btn-secondary btn-small"
          onClick={handleDismiss}>
          Dismiss
        </button>
        <button type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleDismiss}>
          &times;
        </button>
      </div>
    );
  }

  return null;
}
