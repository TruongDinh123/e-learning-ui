import React, {memo, useEffect, useState} from 'react';
import {Select, Space, Typography} from 'antd';
import useCoursesData from '../../../../../hooks/useCoursesData';
const {Title} = Typography;

const SelectCourseBlock = ({coursesFilter, setCoursesFilter}) => {
  const [selectData, setSelectData] = useState(null);
  const coursesStore = useCoursesData();

  const handleChange = (value) => {
    setCoursesFilter(value);
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

  return (
    <Space
      direction='vertical'
      style={{
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'row',
      }}
      size='middle'
    >
      <Select
        showSearch
        mode="multiple"
        style={{
          width: 500,
        }}
        defaultValue={coursesFilter}
        onChange={handleChange}
        placeholder='Chọn cuộc thi'
        optionFilterProp='children'
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())
        }
        options={selectData}
      />
    </Space>
  );
};
export default memo(SelectCourseBlock);
