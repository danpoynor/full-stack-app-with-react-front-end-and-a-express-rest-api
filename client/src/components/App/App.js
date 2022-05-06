import { Routes, Route } from "react-router-dom";
import './App.css';

import Layout from '../Layout/Layout';
import CourseCreate from '../CourseCreate/CourseCreate';
import CourseDetail from '../CourseDetail/CourseDetail';
import CourseUpdate from '../CourseUpdate/CourseUpdate';
import Courses from '../Courses/Courses';
import NotFound from '../NotFound/NotFound';
import UnhandledError from '../UnhandledError/UnhandledError';
import Forbidden from '../Forbidden/Forbidden';
import PrivateRoute from '../PrivateRoute';
import UserSignIn from '../UserSignIn/UserSignIn';
import UserSignOut from '../UserSignOut/UserSignOut';
import UserSignUp from '../UserSignUp/UserSignUp';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Courses />} />
          <Route element={<PrivateRoute />}>
            <Route path="/courses/create" element={<CourseCreate />} />
            <Route path="/courses/:id/update" element={<CourseUpdate />} />
          </Route>
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/signout" element={<UserSignOut />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/error" element={<UnhandledError />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
