'use client';
import {Spin, Empty} from 'antd';
import {useEffect, useState} from 'react';
import AddCourse from './add-course/page';
import '../courses/page.css';
import {isAdmin} from '@/middleware';
import useCoursesData from '@/hooks/useCoursesData';
import 'react-quill/dist/quill.snow.css';
import CourseItem from './components/courseItem';
import SelectCourseBlock from './selectCourseBlock';

export default function Courses() {
  const coursesStore = useCoursesData();
  const [course, setCourses] = useState([]);
  const [updateCourse, setUpdateCourse] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // viewCourses api
  useEffect(() => {
    if (coursesStore.length === 0 && !isLoading) {
      setIsLoading(true);
      return;
    }
    const currentTeacherId = localStorage.getItem('x-client-id');
    let visibleCourses;
    if (isAdmin()) {
      visibleCourses = coursesStore;
    } else {
      visibleCourses = coursesStore.filter(
        (course) => course.teacher === currentTeacherId
      );
    }
    setCourses(visibleCourses);
  }, [coursesStore, isLoading]);

  return (
    <>
      <div className='max-w-screen-2xl mx-auto min-h-screen relative p-3'>
        <AddCourse refresh={() => setUpdateCourse(updateCourse + 1)} />

        <SelectCourseBlock />
        <div className='space-y-4'>
          <div className='grid scrollbar-thin sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3 grid-container-courses'>
            {course.map((courseItem, index) => (
              <CourseItem key={index} course={courseItem} />
            ))}
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center h-screen'>
              <Spin />
            </div>
          ) : (
            course?.length === 0 && (
              <Empty
                className='text-center text-sm text-muted-foreground mt-10'
                description='
                Không có khóa học nào
              '
              />
            )
          )}
        </div>
      </div>
    </>
  );
}
