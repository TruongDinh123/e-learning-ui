import {Button, Menu, Popconfirm} from 'antd';
import UpdateQuiz from '../update-quiz/page';

const MenuBlock = ({quizItem, handleDeleteQuiz}) => {
  return (
    <Menu>
      <Menu.Item>
        <UpdateQuiz quizId={quizItem?._id} />
      </Menu.Item>
      <Menu.Item>
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
      </Menu.Item>
    </Menu>
  );
};

export default MenuBlock;
