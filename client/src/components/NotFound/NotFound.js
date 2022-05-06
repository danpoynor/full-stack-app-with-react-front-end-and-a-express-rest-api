import { Link, useLocation } from 'react-router-dom';

export default () => {
  // Get the message from the state passed in from state
  const location = useLocation();
  const messageText = location.state?.message || 'Sorry! We could not find the page you’re looking for.';

  document.title = "Not Found"

  return (
    <div className="wrap">
      <h2>404: Not Found</h2>
      {messageText ?
        <p>{messageText}</p>
        :
        <p>Sorry! We couldn't find what you're looking for.</p>
      }
      <p><Link to="/">Click here to visit the home page</Link></p>
    </div>
  );
}
