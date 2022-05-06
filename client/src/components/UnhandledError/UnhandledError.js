import { Link } from 'react-router-dom';

export default () => {

  document.title = "Internal Server Error"

  return (
    <div className="wrap">
      <h2 className="not-found">Internal Server Error</h2>
      <p className="not-found">Sorry! We just encountered an unexpected error.</p>
      <p><Link to="/">Click here to visit the home page</Link></p>
    </div>
  );
}
