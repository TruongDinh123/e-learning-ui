import React, {memo, useEffect, useState} from 'react';
import {Button, Select, Space, Typography, message} from 'antd';
import useCoursesData from '../../../hooks/useCoursesData';
import {activeCoursePresent} from '../../../features/Courses/courseSlice';
import {useDispatch, useSelector} from 'react-redux';
const {Title} = Typography;

const SelectCourseBlock = () => {
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const [courseCurrent, setCourseCurrent] = useState(coursePresent?._id);
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

  const activeCoursePresentHandle = () => {
    if (courseCurrent) {
      setIsLoading(true);
      courseCurrent &&
        dispatch(
          activeCoursePresent({
            newCourseId: courseCurrent,
            oldCourseId: coursePresent?._id || null,
          })
        ).then((res) => {
          message.success('Đã cập nhật cuộc thi đại diện!', 1.5);
          setIsLoading(false)});
    }
  };

  useEffect(() => {
    coursePresent && setCourseCurrent(coursePresent._id);
  }, [coursePresent]);

  return (
    <Space
      direction='vertical'
      style={{
        marginBottom: '20px',
        marginTop: '14px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end'
      }}
      size='middle'
    >
      <Title level={4} className='mb-0' >Chọn cuộc thi đại diện</Title>
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

      <Button
        type='primary'
        onClick={activeCoursePresentHandle}
        className='me-3 custom-button'
        style={{width: '100%'}}
        loading={isLoading}
      >
        Cập nhật
      </Button>
    </Space>
  );
};
export default memo(SelectCourseBlock);
