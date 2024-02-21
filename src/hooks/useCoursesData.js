// Trong file e-learning-app/src/hooks/useCoursesData.js

import { useSelector } from 'react-redux';

const useCoursesData = () => {
  const courses = useSelector((state) => state.course.courses);
  return courses;
};

export default useCoursesData;