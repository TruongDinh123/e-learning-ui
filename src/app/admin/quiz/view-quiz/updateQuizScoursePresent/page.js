'use client';

import {useSelector} from 'react-redux';
import SelectCourseBlock from './selectCourseBlock';
import SelectQuizBlock from './selectQuizBlock';
import {useState} from 'react';

const UpdateQuizScoursePresent = () => {
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const [courseCurrent, setCourseCurrent] = useState(coursePresent?._id);

  return (
    <div style={{overflow: 'auto', display: 'block'}}>
      <table id='choice-present-block' style={{width: '820px'}}>
        <tbody>
          <SelectCourseBlock
            courseCurrent={courseCurrent}
            setCourseCurrent={setCourseCurrent}
          />
          <SelectQuizBlock courseCurrent={courseCurrent} />
        </tbody>
      </table>
    </div>
  );
};

export default UpdateQuizScoursePresent;
