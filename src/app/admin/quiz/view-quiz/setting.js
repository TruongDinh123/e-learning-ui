import {Button, Col, Dropdown, Popconfirm, Space} from 'antd';
import MenuBlock from './menuBlock';
import UpdateQuiz from '../update-quiz/page';

export const columns = [
  {
    title: 'SNo.',
    dataIndex: 'key',
  },
  {
    title: 'Tên đề thi',
    dataIndex: 'name',
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Loại hình thức',
    dataIndex: 'type',
    render: (text) =>
      text === 'multiple_choice'
        ? 'Trắc Nghiệm'
        : text === 'essay'
        ? 'Tự luận'
        : text,
    onFilter: (value, record) => record.type.indexOf(value) === 0,
    sorter: (a, b) => a.type.localeCompare(b.type),
    sortDirections: ['descend'],
  },
  {
    title: 'Chi tiết câu hỏi',
    dataIndex: 'questions',
    onFilter: (value, record) => record.questions.indexOf(value) === 0,
    sorter: (a, b) => a.questions.length - b.questions.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Chức năng',
    dataIndex: 'action',
  },
];

export const initData = ({quiz, isMobile, router, handleDeleteQuiz}) => {
  let data = [];
  const dataItem = ({index, quizItem}) => ({
    key: index + 1,
    name: quizItem?.name,
    type: quizItem?.type,
    questions: (
      <Button
        className='me-3'
        style={{width: '100%'}}
        onClick={() =>
          router.push(`/admin/quiz/view-list-question/${quizItem?._id}`)
        }
      >
        Xem chi tiết
      </Button>
    ),
    action: isMobile ? (
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
              <Button danger style={{width: '100%'}}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      </Col>
    ),
  });

  quiz.forEach((quizItem, index) => {
    data.push(
      dataItem({
        index,
        quizItem,
      })
    );
  });

  return data;
};
