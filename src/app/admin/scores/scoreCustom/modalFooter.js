import {Button, message} from 'antd';
import moment from 'moment';
import {Fragment, useState} from 'react';
import {useDispatch} from 'react-redux';
import { updateScoreCustom } from '../../../../features/Quiz/quizSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const ModalFooter = ({dateInit, handleCancel, handleRefresh}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    if (!dateInit) {
      message.error('Chưa nhập ngày bắt đầu hoặc ngày kết thúc');
      return;
    }
    setIsLoading(true);

    const startDate = dateInit[0];
    const endDate = moment(dateInit[1]).add(1, 'days').format('YYYY-MM-DD');

    dispatch(updateScoreCustom({startDate, endDate}))
      .then(unwrapResult)
      .then((res) => {
        message.success('Cập nhật điểm cộng thành công!');
        handleRefresh();
        setIsLoading(false);
        handleCancel();
      });
  };

  return (
    <Fragment>
      <Button key='cancle' type='default' onClick={handleCancel}>
        Hủy
      </Button>
      <Button
        key='ok'
        type='primary'
        onClick={handleOk}
        className='custom-button'
        loading={isLoading}
      >
        Cập nhật
      </Button>
    </Fragment>
  );
};

export default ModalFooter;
