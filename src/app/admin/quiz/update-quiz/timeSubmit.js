import {Button, Col, DatePicker, Form, Row, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {updateTimeSubmitQuiz} from '../../../../features/Quiz/quizSlice';

const TimeSubmit = ({quizId, form}) => {
  const dispatch = useDispatch();
  const isTimeSubmitLoading = useSelector(
    (state) => state.quiz.isTimeSubmitLoading
  );
  const updateTimeSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateTimeSubmitQuiz({
        quizId,
        submissionTime: form.getFieldValue('submissionTime'),
      })
    ).then(
      (res) =>
        res.payload.status === 200 &&
        message.success('Cập nhật thời gian nộp bài thành công!')
    );
  };

  return (
    <div>
      <Row gutter={2}>
        <Col className='gutter-row' span={9}>
          <Form.Item label='Thời hạn nộp' name='submissionTime'>
            <DatePicker
              showTime
              disabledDate={(current) => {
                // Không cho phép chọn ngày trước ngày hiện tại
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                return current && current.toDate() < currentDate;
              }}
            />
          </Form.Item>
        </Col>
        <Col className='gutter-row' span={6}>
          <Button
            type='primary'
            htmlType='submit'
            className='custom-button'
            loading={isTimeSubmitLoading}
            onClick={updateTimeSubmit}
          >
            Lưu thời hạn nộp
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default TimeSubmit;
