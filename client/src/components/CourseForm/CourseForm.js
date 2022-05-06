import { useContext, useEffect, useState } from "react";
import { Context } from '../../Context';
import FormWrapper from '../FormWrapper/FormWrapper';
import useCourseAPI from '../../data/hooks/useCourseAPI';

/**
 * CourseForm component
 *
 * @description
 * Used to render the form used when a user is creating a new course or updating an existing course.
 *
 * @param {object} [props]
 * @param {object} [props.courseData]
 *
 * @returns {JSX} JSX representation of the CourseForm component
 */

export default ({ courseData }) => {
  const context = useContext(Context);
  const { authenticatedUser } = context;
  const { error, getData } = useCourseAPI();
  const [course, setCourse] = useState(null);

  const handleSubmit = async () => {
    // If `course.id` value is already set from received courseData, then we're
    // updating an existing course. Otherwise, we're creating a new course.
    if (course.id) {
      getData({
        method: 'PUT',
        path: `/courses/${course.id}`,
        body: course,
        requiresAuth: true,
        encodedCredentials: authenticatedUser.encodedCredentials
      });
    } else {
      getData({
        method: 'POST',
        path: '/courses',
        body: course,
        requiresAuth: true,
        encodedCredentials: authenticatedUser.encodedCredentials
      });
    }
  };

  useEffect(() => {
    // After the initial return renders null, useEffect will run
    // and sets course values to the received courseData or the
    // default values if no courseData was received, and we're
    // creating a new course.
    setCourse({
      id: courseData?.id || null,
      title: courseData?.title || '',
      description: courseData?.description || '',
      estimatedTime: courseData?.estimatedTime || '',
      materialsNeeded: courseData?.materialsNeeded || '',
      userId: courseData?.userId || authenticatedUser.id,
      User: courseData?.User || authenticatedUser
    });
  }, [courseData]);

  // If course is null, wait till useEffect runs to render the form.
  if (!course) {
    return null;
  } else {
    return (
      <FormWrapper
        autoComplete="off"
        errors={error}
        formId="course-form"
        submit={handleSubmit}
        submitButtonText={course.id ? 'Update Course' : 'Create Course'}
        elements={() => ( // render prop ref: https://reactjs.org/docs/render-props.html
          <div className="main-flex">
            <div>
              <label htmlFor="title">Course Title: {course.id}</label>
              <input
                id="title"
                name="course[title]"
                placeholder="Enter course title"
                type="text"
                defaultValue={course.title}
                onChange={(e) => {
                  setCourse({ ...course, title: e.target.value });
                }} />
              <p>By {course.User.firstName} {course.User.lastName}</p>
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                name="course[description]"
                placeholder="Enter course description"
                defaultValue={course.description}
                onChange={(e) => {
                  setCourse({ ...course, description: e.target.value });
                }} />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimated[time]"
                placeholder="Enter estimated time"
                type="text"
                defaultValue={course.estimatedTime}
                onChange={(e) => {
                  setCourse({ ...course, estimatedTime: e.target.value });
                }} />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materials[needed]"
                placeholder="Enter materials needed"
                value={course.materialsNeeded}
                onChange={(e) => {
                  setCourse({ ...course, materialsNeeded: e.target.value });
                }} />
            </div>
          </div>
        )} />
    );
  }
}
