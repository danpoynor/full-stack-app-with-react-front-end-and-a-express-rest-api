import { useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import CourseCard from '../CourseCard/CourseCard';
import useCourseAPI from '../../data/hooks/useCourseAPI';
import './Courses.css'

export default () => {
  const { data, error, isLoaded, getData } = useCourseAPI();

  useEffect(() => {
    getData({ path: '/courses' });
  }, []);

  if (error) return `Error: ${error.status} ${error.message}`;
  if (!isLoaded || !data) return <LoadingSpinner />;

  document.title = `Home: All Courses (${data.length} total)`;

  const newCourseListItem = (
    <li>
      <a className="course-card add" href="/courses/create">
        <p className="title">
          <svg version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 13 13"
            className="icon-add">
            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
          </svg>
          New Course
        </p>
      </a>
    </li>
  );

  return (
    <div className="wrap">
      {
        !data.length > 0 ?
          <>
            <p>No courses found</p>
            <ul className='courses'>
              {newCourseListItem}
            </ul>
          </>
          :
          <ul className='courses'>
            {
              data.map(course => (
                <li key={course.id.toString()}>
                  <CourseCard id={course.id.toString()} title={course.title} />
                </li>
              ))
            }
            {newCourseListItem}
          </ul>
      }
    </div>
  );
}
