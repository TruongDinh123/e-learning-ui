import React, {memo, useEffect, useState} from 'react';
import {Select, Typography} from 'antd';
import {useSelector} from 'react-redux';
import useCoursesData from '../../../../../hooks/useCoursesData';
const {Title} = Typography;

const SelectCourseBlock = ({courseCurrent, setCourseCurrent}) => {
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const [selectData, setSelectData] = useState(null);
  const coursesStore = useCoursesData();

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
    <div className='mb-4'>
      <Title level={5} className='mb-2'>
        Chọn cuộc thi đại diện
      </Title>
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
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())
        }
        options={selectData}
      />
    </div>
  );
};
export default memo(SelectCourseBlock);
