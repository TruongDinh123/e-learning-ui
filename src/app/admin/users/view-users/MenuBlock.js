'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import {Dropdown, Input, Menu, Select, Space, Spin, Table, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Button, Popconfirm} from 'antd';
import {
  deleteUser,
  getAllRole,
  getAllUser,
  updateAllUser,
} from '@/features/User/userSlice';
import EditUser from '../edit-user-modal/page';
import {useMediaQuery} from 'react-responsive';

const MenuBlock = ({
  filteredUsers,
  setUpdateUser,
  updateUser,
  optimisticUpdateUser,
  handleDeleteUser,
}) => {
  return (
    <Menu>
      {filteredUsers.map(
        (filteredUser, index) =>
          !filteredUser?.roles.some((role) => role.name === 'Super-Admin') && (
            <div key={index}>
              <Menu.Item>
                <EditUser
                  id={filteredUser?._id}
                  refresh={() => setUpdateUser(updateUser + 1)}
                  optimisticUpdateUser={optimisticUpdateUser}
                />
              </Menu.Item>

              <Menu.Item>
                <Popconfirm
                  title='Xóa người dùng'
                  description='Bạn có chắc muốn xóa người dùng?'
                  okText='Có'
                  okButtonProps={{style: {backgroundColor: 'red'}}}
                  cancelText='Không'
                  onConfirm={() => handleDeleteUser(filteredUser?._id)}
                >
                  <Button danger style={{width: '100%'}}>
                    Xóa
                  </Button>
                </Popconfirm>
              </Menu.Item>
            </div>
          )
      )}
    </Menu>
  );
};

export default MenuBlock;
