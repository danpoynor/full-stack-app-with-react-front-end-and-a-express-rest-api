import './CourseCard.css'

export default ({ id, title }) => {
  return (
    <a href={`/courses/${id}`} className="course-card">
      <p className='label'>Course</p>
      <p className='title'>{title}</p>
    </a>
  )
}
