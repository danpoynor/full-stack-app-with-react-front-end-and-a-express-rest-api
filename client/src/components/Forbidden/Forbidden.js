import { Link, useLocation } from 'react-router-dom';

export default () => {
  // Get the message to show from the state passed in from the
  // navigateTo function, or use the default message.
  const location = useLocation();
  const messageText = location.state?.message || 'Oh oh! You don’t have access to the requested resource.';

  document.title = "Forbidden Resource";

  return (
    <div className="wrap">
      <h2>Forbidden</h2>
      <p>{messageText}</p>
      <p><Link to="/">Click here to visit the home page</Link></p>
    </div>
  );
}
