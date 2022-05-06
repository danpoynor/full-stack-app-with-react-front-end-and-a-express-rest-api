import CourseForm from '../CourseForm/CourseForm';

// NOTE: Before reaching this page, the user has been authenticated
// by PrivateRoute.js as used in App.js

export default () => {

  document.title = "Create Course"

  return (
    <div className="wrap">
      <h2>Create Course</h2>
      <CourseForm />
    </div>
  )
}
