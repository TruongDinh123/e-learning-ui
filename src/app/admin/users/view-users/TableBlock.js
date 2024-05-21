'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import {Table, message} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import {deleteUser, updateAllUser} from '@/features/User/userSlice';
import {columns, dataInit} from './setting';
import {useMediaQuery} from 'react-responsive';

const TableBlock = ({filterRole, searchTerm, isLoading}) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({query: '(max-width: 767px)'});
  const allUsersStore = useSelector((state) => state?.user?.allUsers);

  const [updateUser, setUpdateUser] = useState(0);
  const [data, setData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const optimisticUpdateUser = useCallback(
    (updatedUser) => {
      const updatedUsers = allUsersStore?.map((u) => {
        if (u._id === updatedUser._id) {
          return {...u, ...updatedUser};
        }
        return u;
      });

      dispatch(updateAllUser(updatedUsers));
    },
    [allUsersStore, dispatch]
  );

  //handleDeleteUser
  const handleDeleteUser = useCallback(
    (id) => {
      message.open({
        type: 'info',
        content: 'Đang xoá người dùng...',
      });

      dispatch(deleteUser(id))
        .then(unwrapResult)
        .then((res) => {
          if (!res.status) {
            message.error(
              'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.'
            );
          } else {
            message.success('Đã xoá người dùng.');
          }
        })
        .catch(() => {
          message.error('Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.');
        });
    },
    [dispatch]
  );

  useEffect(() => {
    if (allUsersStore) {
      const filteredUsersByRole = allUsersStore?.filter((u) => {
        if (!filterRole) return true;
        return u.roles.some((role) => role._id === filterRole);
      });

      //Tìm kiếm tên người dùng
      const filteredUsers = filteredUsersByRole.filter((u) => {
        return (
          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredUsers(filteredUsers);
    }
  }, [allUsersStore, filterRole, searchTerm]);

  useEffect(() => {
    if (filteredUsers && filteredUsers.length) {
      const dataBuild = dataInit({
        filteredUsers,
        isMobile,
        setUpdateUser,
        updateUser,
        optimisticUpdateUser,
        handleDeleteUser,
      });

      setData(dataBuild);
    }
  }, [
    filteredUsers,
    handleDeleteUser,
    isMobile,
    optimisticUpdateUser,
    updateUser,
  ]);

  return (
    <React.Fragment>
      <Table
        title={() => (
          <div className='flex justify-between'>
            <h1 className='text-3xl font-medium'>Danh sách người dùng</h1>
          </div>
        )}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
          position: ['bottomLeft'],
        }}
        className='grid-container'
        loading={isLoading}
      />
    </React.Fragment>
  );
};

export default TableBlock;
