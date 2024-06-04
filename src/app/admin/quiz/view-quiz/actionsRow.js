import {Button, Col, Dropdown, Popconfirm, Space, message} from 'antd';
import {useCallback, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {deleteQuiz} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import MenuBlock from './menuBlock';
import UpdateQuiz from '../update-quiz/page';

const ActionsRow = ({quizItem}) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({query: '(max-width: 1280px)'});
  const [isLoading, setIsLoaing] = useState(false);

  const handleDeleteQuiz = useCallback(
    ({quizId}) => {
      setIsLoaing(true);
      dispatch(deleteQuiz({quizId}))
        .then(unwrapResult)
        .then((res) => {
          if (!res.status) {
            message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
          } else {
            message.success('Đã xoá thành công!', 1.5);
            setIsLoaing(false);
          }
        })
        .catch((error) => {
          console.log(error);
          message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
        });
    },
    [dispatch]
  );

  return isMobile ? (
    <Dropdown
      overlay={
        <MenuBlock quizItem={quizItem} handleDeleteQuiz={handleDeleteQuiz} />
      }
    >
      <Button
        className='ant-dropdown-link text-center justify-self-center'
        onClick={(e) => e.preventDefault()}
      >
        Chức năng
      </Button>
    </Dropdown>
  ) : (
    <Col lg='12'>
      <Space
        size='large'
        direction='vertical'
        className='lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between'
      >
        <Space wrap>
          <UpdateQuiz quizId={quizItem?._id} />
          <Popconfirm
            title='Xóa bài tập'
            description='Bạn có muốn xóa bài tập?'
            okText='Có'
            cancelText='Không'
            okButtonProps={{
              style: {backgroundColor: 'red'},
            }}
            onConfirm={() =>
              handleDeleteQuiz({
                quizId: quizItem?._id,
              })
            }
          >
            <Button danger style={{width: '100%'}} loading={isLoading}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      </Space>
    </Col>
  );
};

export default ActionsRow;
