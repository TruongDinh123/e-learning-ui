'use client';

import {DatePicker, Modal, Typography} from 'antd';
import ModalFooter from './modalFooter';
import dayjs from 'dayjs';
import {useState} from 'react';

const {RangePicker} = DatePicker;
const {Title} = Typography;

const ModalBlock = ({isOpen, handleCancel}) => {
  const [dateInit, setDateInit] = useState('');

  const rangePickerHandle = (dates, dateStrings) => {
    setDateInit(dateStrings);
  };

  return (
    <Modal
      title='Cập nhật điểm cộng'
      open={isOpen}
      onCancel={handleCancel}
      maskClosable={false}
      width={400}
      footer={<ModalFooter dateInit={dateInit} handleCancel={handleCancel} />}
    >
      <Title level={5} className='mb-2'>
        Chọn bài thi đại diện
      </Title>
      <RangePicker
        onChange={rangePickerHandle}
        style={{width: '100%'}}
        placeholder={['Ngày thi bắt đầu', 'Ngày thi kết thúc']}
      />
    </Modal>
  );
};

export default ModalBlock;
