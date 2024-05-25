import {Button, Menu, Popconfirm} from 'antd';
import EditCourses from '../edit-course/Page';
import {useRouter} from 'next/navigation';
import {memo} from 'react';

const ActionsMenuItemCourse = ({course, handleDeleteCourse, loadingStates}) => {
  const router = useRouter();

  return (
    <Menu>
      <Menu.Item>
        <EditCourses course={course} id={course?._id} />
      </Menu.Item>
      <Menu.Item>
        <Button
          className='me-3'
          style={{width: '100%'}}
          courseId={course?._id}
          onClick={() => router.push(`/user/exem-online/${course?._id}`)}
        >
          View Detail
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title='Xóa khóa học'
          description='Bạn muốn chắc xóa khóa học?'
          okText='Có'
          cancelText='Không'
          okButtonProps={{
            style: {backgroundColor: 'red'},
          }}
          onConfirm={() => handleDeleteCourse(course?._id)}
        >
          <Button
            danger
            style={{width: '100%'}}
            loading={loadingStates[course?._id]}
          >
            Xóa
          </Button>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
};

export default memo(ActionsMenuItemCourse);
