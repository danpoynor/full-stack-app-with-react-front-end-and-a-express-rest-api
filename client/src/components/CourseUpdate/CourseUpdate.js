import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../Context';
import { isAuthorized } from "../../data/APIUtils";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import useCourseAPI from '../../data/hooks/useCourseAPI';
import Form from '../CourseForm/CourseForm';

export default () => {
  const id = useParams().id;
  const navigate = useNavigate();
  const context = useContext(Context);
  const { authenticatedUser } = context;
  const { data, error, isLoaded, getData } = useCourseAPI();
  const [didAuthorizationCheck, setDidAuthorizationCheck] = useState(false);

  useEffect(() => {
    // Get the course data on mount
    getData({ path: `/courses/${id}` });
  }, []);

  useEffect(() => {
    // When data value is updated (loaded), check if the user is authorized
    if (data.userId && didAuthorizationCheck === false) {
      if (isAuthorized({ user: authenticatedUser, data: data })) {
        // User is authorized to edit this course.
        setDidAuthorizationCheck(true);
      } else {
        // User is not authorized to edit this course.
        navigate('/forbidden', {
          state: {
            message: `Oh oh! You are not authorized to edit course ${data.id}: ${data?.title}.`
          }
        })
      }
    }
  }, [data]);

  if (error) return `Error: ${error.status} ${error.message}`;
  if (!isLoaded || !data || !didAuthorizationCheck) return <LoadingSpinner />;

  if (didAuthorizationCheck === false) {
    // First render - user is not authorized yet.
    // Handling the return(render)/authorization this way prevents
    // the empty form flashing quickly on the page before the user
    // is authorized and potentially being either redirected to
    // the forbidden page or seeing the content to edit.
    document.title = `Loading...`;
  } else {
    // After setDidAuthCheck state is updated (which causes
    // a second render) the user was either redirected to the
    // forbidden page, or is authorized to edit this course.
    document.title = `Update Course: ${data.title}`;
    return (
      <div className="wrap">
        <div>
          <h2>Update Course</h2>
          <Form courseData={data} />
        </div>
      </div>
    );
  }
}
