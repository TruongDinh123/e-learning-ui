import React, {memo, useEffect, useState} from 'react';
import {Button, Select, Space, Typography, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import useCoursesData from '../../../../../hooks/useCoursesData';
import {activeCoursePresent} from '../../../../../features/Courses/courseSlice';
const {Title} = Typography;

const SelectCourseBlock = ({courseCurrent, setCourseCurrent}) => {
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const dispatch = useDispatch();
  const [selectData, setSelectData] = useState(null);
  const coursesStore = useCoursesData();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value) => {
    setCourseCurrent(value);
  };

  useEffect(() => {
    if (coursesStore) {
      const initData = coursesStore.map((courseItem) => ({
        label: courseItem.name,
        value: courseItem._id,
      }));

      setSelectData(initData);
    }
  }, [coursesStore]);

  useEffect(() => {
    coursePresent && setCourseCurrent(coursePresent._id);
  }, [coursePresent, setCourseCurrent]);

  return (
    <tr>
      <td>
        <Title level={5} className='mb-0'>
          Chọn cuộc thi đại diện
        </Title>
      </td>
      <td>
        <Select
          showSearch
          style={{
            width: 500,
          }}
          defaultValue={courseCurrent}
          value={courseCurrent}
          onChange={handleChange}
          placeholder='Search to Select'
          optionFilterProp='children'
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={selectData}
        />
      </td>
    </tr>
  );
};
export default memo(SelectCourseBlock);
