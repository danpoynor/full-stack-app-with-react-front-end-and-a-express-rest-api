import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ActionBar from '../ActionBar/ActionBar';
import useCourseAPI from '../../data/hooks/useCourseAPI';
import './CourseDetail.css'

export default () => {
  const id = useParams().id;
  const { data, error, isLoaded, getData } = useCourseAPI();

  useEffect(() => {
    getData({ path: `/courses/${id}` });
  }, [id]);

  if (error) return `Error: ${error.status} ${error.message}`;
  if (!isLoaded || !data) return <LoadingSpinner />;

  document.title = `Course Details: ${data.title}`;

  return (
    <div className="course-detail">
      <ActionBar data={data} />
      <div className="wrap">
        <h2>Course Detail</h2>
        <div className="main-flex">
          <div>
            <h3 className="course-detail-title">Course</h3>
            <h4 className="course-name">{data.title}</h4>
            <p>By {data.User?.firstName} {data.User?.lastName}</p>
            {
              !data.description ?
                <p>No description</p>
                :
                <ReactMarkdown>{data.description}</ReactMarkdown>
            }
          </div>
          <div>
            <h3 className="course-detail-title">Estimated Time</h3>
            <p>{data.estimatedTime}</p>
            <h3 className="course-detail-title">Materials Needed</h3>
            {
              !data.materialsNeeded ?
                <p>None</p>
                :
                <ReactMarkdown>{data.materialsNeeded}</ReactMarkdown>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
