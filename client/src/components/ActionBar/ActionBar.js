import { useContext, useEffect, useRef, useState } from "react";
import { Context } from '../../Context';
import { Link, useLocation } from 'react-router-dom';
import useCourseAPI from '../../data/hooks/useCourseAPI';
import './ActionBar.css';

export default ({ data }) => {
  const didMount = useRef(false);
  const context = useContext(Context);
  const location = useLocation();
  const { authenticatedUser } = context;
  const { getData } = useCourseAPI();
  const [isAuthorizedToEdit, setIsAuthorizedToEdit] = useState(false);

  const confirmDelete = event => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse();
    }
  }

  const deleteCourse = () => {
    getData({
      method: 'DELETE',
      path: `/courses/${data.id}`,
      requiresAuth: true,
      encodedCredentials: authenticatedUser.encodedCredentials,
    });
  }

  useEffect(() => {
    // Wait until useEffect runs to render the ActionBar component.
    // NOTE: return should only render after the authenticatedUser has been
    // authorized to edit the course. If the component rendered with the
    // standard html, then user was not authorized, then the Update and Delete
    // buttons would appear which shifts the layout and looks janky.
    // To control this, the didmount ref was initialized without a value, so
    // it's falsey until didMount.current is set to true after useEffect()
    // initially runs.
    // NOTE: I'm using a useRef() to hold the value instead of useState()
    // to prevent a rerender when the didMount state changes.
    if (!didMount) {
       // Do nothing if initial render
    } else {
      if (data.userId && authenticatedUser?.id) {
        if (data.userId === authenticatedUser.id) {
          setIsAuthorizedToEdit(true);
        }
      }
      didMount.current = true;
    }
  }, [data]);

  return (
    <div className="action-bar">
      <div className="wrap">
        {isAuthorizedToEdit && (
          <>
            <Link
              className="btn"
              to="update"
              state={{
                prevPath: location.pathname
              }}
            >
              Update Course
            </Link>
            <button
              className="btn"
              type="button"
              onClick={confirmDelete}>
              Delete Course
            </button>
          </>
        )}
        <Link
          className="btn btn-secondary"
          to="/">
          Return to List
        </Link>
      </div>
    </div>
  )
}
