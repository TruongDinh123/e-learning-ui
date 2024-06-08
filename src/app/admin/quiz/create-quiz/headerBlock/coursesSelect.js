"use client"

import {Form, Select} from 'antd';
import {useEffect, useState} from 'react';
import {isAdmin} from '../../../../../middleware';
import useCoursesData from '../../../../../hooks/useCoursesData';

const CoursesSelect = ({selectedCourse, setSelectedCourse}) => {
  const coursesStore = useCoursesData();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // viewCourses api
  useEffect(() => {
    if (coursesStore.length === 0 && !isLoading) {
      setIsLoading(true);
      return;
    }
    const currentTeacherId = localStorage.getItem('x-client-id');
    let visibleCourses;
    if (isAdmin()) {
      visibleCourses = coursesStore;
    } else {
      visibleCourses = coursesStore.filter(
        (course) => course.teacher === currentTeacherId
      );
    }
    visibleCourses = visibleCourses.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    setCourses(visibleCourses);
  }, [coursesStore, isLoading]);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  return (
    <Form.Item
      name='courseIds'
      label='Chọn cuộc thi:'
      rules={[
        {
          required: true,
          message: 'Vui lòng chọn cuộc thi',
        },
      ]}
      labelCol={{span: 24}}
      wrapperCol={{span: 24}}
    >
      <Select
        mode='multiple'
        placeholder='Chọn cuộc thi'
        onChange={handleCourseChange}
        defaultValue={selectedCourse}
        value={selectedCourse}
        style={{width: '100%'}}
        options={courses}
        // disabled={isQuizLimitReached}
      />
    </Form.Item>
  );
};

export default CoursesSelect;
