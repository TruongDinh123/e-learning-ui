'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import {Table} from 'antd';
import React, {useEffect, useState} from 'react';
import {getAllRole} from '@/features/User/userSlice';
import {useMediaQuery} from 'react-responsive';
import {columns, dataInit} from './setting';

export default function ViewRoles() {
  const isMobile = useMediaQuery({query: '(max-width: 767px)'});
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const roles = useSelector((state) => state.user.allRoles);
  const isLoading = useSelector((state) => state.user.isLoading);

  //viewRoles api
  useEffect(() => {
    !roles && dispatch(getAllRole()).then(unwrapResult);
  }, [dispatch, roles]);

  useEffect(() => {
    if (roles) {
      setData(
        dataInit({
          roles,
          isMobile,
        })
      );
    }
  }, [isMobile, roles]);

  return (
    <div className='p-3'>
      <React.Fragment>
        {/* <CreateRole refresh={() => setUpdateRole(updateRole + 1)} /> */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={{pageSize: 5, position: ['bottomLeft']}}
          className='pt-3'
          loading={isLoading}
        />
      </React.Fragment>
    </div>
  );
}
