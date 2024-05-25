'use client';

import useInitAdmin from '../../hooks/useInitAdmin';
import Courses from './courses/page';

const Admin = ({}) => {
  useInitAdmin();

  return (
    <Courses />
  )
}

export default Admin;
