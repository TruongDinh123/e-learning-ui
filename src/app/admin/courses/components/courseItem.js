import {Button, Col, Dropdown, Image, Popconfirm, Space, message} from 'antd';
import {IMAGE_DEFAULT} from '../../../../constants';
import {useMediaQuery} from 'react-responsive';
import EditCourses from '../edit-course/Page';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {deleteCourse} from '@/features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import ActionsMenuItemCourse from './actionsMenuItemCourse';

const CourseItem = ({course}) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({query: '(max-width: 1280px)'});
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState({});
  const [messageApi] = message.useMessage();

  const handleDeleteCourse = (id) => {
    setLoadingStates((prev) => ({...prev, [id]: true}));
    dispatch(deleteCourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi.success('Khoá học đã được xoá.');
        }
      })
      .catch((error) => {
        console.log(error);
        message.error('Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại.');
      })
      .finally(() => {
        setLoadingStates((prev) => ({...prev, [id]: false}));
      });
  };

  return (
    <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 min-h-[100px]'>
      <div className='relative w-full aspect-video rounded-md overflow-hidden'>
        <Image
          width={330}
          height={186}
          fill
          className='object-cover'
          alt='Hình ảnh khóa học'
          fallback={IMAGE_DEFAULT}
          src={course?.image_url}
        />
      </div>
      <div className='flex flex-col pt-2'>
        <a
          className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'
          onClick={() => router.push(`/user/exem-online/${course?._id}`)}
        >
          {course.name}
        </a>

        {isMobile ? (
          <Dropdown
            overlay={
              <ActionsMenuItemCourse
                course={course}
                handleDeleteCourse={handleDeleteCourse}
                loadingStates={loadingStates}
              />
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
          <Col lg='12' className='mt-5'>
            <Space
              size='large'
              direction='vertical'
              className='lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between'
            >
              <Space wrap>
                <EditCourses id={course?._id} course={course} />
                <Popconfirm
                  title='Detele the Contest'
                  description='Confirm to delete the contest'
                  okText='Yes'
                  cancelText='No'
                  okButtonProps={{
                    style: {backgroundColor: 'red'},
                  }}
                  onConfirm={() => handleDeleteCourse(course?._id)}
                  style={{margin: 0}}
                >
                  <Button
                    danger
                    style={{margin: 0}}
                    loading={loadingStates[course?._id]}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </Space>
          </Col>
        )}
      </div>
    </div>
  );
};

export default CourseItem;
