"use client"

import {useSelector} from 'react-redux';
import SelectCourseBlock from './selectCourseBlock';
import SelectQuizBlock from './selectQuizBlock';
import {useState} from 'react';

const UpdateQuizScoursePresent = () => {
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const [courseCurrent, setCourseCurrent] = useState(coursePresent?._id);

  return (
    <table id='choice-present-block'>
      <SelectCourseBlock
        courseCurrent={courseCurrent}
        setCourseCurrent={setCourseCurrent}
      />
      <SelectQuizBlock courseCurrent={courseCurrent} />
    </table>
  );
};

export default UpdateQuizScoursePresent;
