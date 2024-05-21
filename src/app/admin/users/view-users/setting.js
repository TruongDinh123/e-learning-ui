'use client';
import {Dropdown, Space,} from 'antd';
import React from 'react';
import {Button, Popconfirm} from 'antd';

import EditUser from '../edit-user-modal/page';
import '../view-users/page.css';
import MenuBlock from './MenuBlock';

export const dataInit = ({
  filteredUsers,
  isMobile,
  setUpdateUser,
  updateUser,
  optimisticUpdateUser,
  handleDeleteUser,
}) => {
  const data = filteredUsers.map((filteredUser, index) => {
    return {
      key: index + 1,
      lastName: filteredUser?.lastName,
      firstName: filteredUser?.firstName,
      email: filteredUser?.email,
      status: filteredUser?.status,
      roles: filteredUser?.roles?.map((role) => role.name),
      action: isMobile ? (
        <Dropdown
          overlay={
            <MenuBlock
              filteredUsers={filteredUsers}
              setUpdateUser={setUpdateUser}
              updateUser={updateUser}
              optimisticUpdateUser={optimisticUpdateUser}
              handleDeleteUser={handleDeleteUser}
            />
          }
          placement='bottomCenter'
        >
          <Button
            className='text-center justify-self-center'
            onClick={(e) => e.preventDefault()}
          >
            Chức năng
          </Button>
        </Dropdown>
      ) : (
        <Space size={'middle'}>
          {!filteredUser?.roles.some((role) => role.name === 'Super-Admin') && (
            <>
              <EditUser
                id={filteredUser?._id}
                refresh={() => setUpdateUser(updateUser + 1)}
                optimisticUpdateUser={optimisticUpdateUser}
              />
              <Popconfirm
                title='Xóa người dùng'
                description='Bạn có chắc muốn xóa người dùng?'
                okButtonProps={{style: {backgroundColor: 'red'}}}
                okText='Có'
                cancelText='Không'
                onConfirm={() => handleDeleteUser(filteredUser?._id)}
              >
                <Button danger style={{width: '100%'}}>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    };
  });


  return data;
};

export  const columns = [
  {
    title: 'SNo.',
    dataIndex: 'key',
  },
  {
    title: 'Họ',
    dataIndex: 'lastName',
    onFilter: (value, record) => record.lastName.indexOf(value) === 0,
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    sortDirections: ['descend'],
  },
  {
    title: 'Tên',
    dataIndex: 'firstName',
    onFilter: (value, record) => record.firstName.indexOf(value) === 0,
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    sortDirections: ['descend'],
  },
  {
    title: 'Email',
    dataIndex: 'email',
    onFilter: (value, record) => record.email.indexOf(value) === 0,
    sorter: (a, b) => a.email.localeCompare(b.email),
    sortDirections: ['descend'],
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    onFilter: (value, record) => record.status.indexOf(value) === 0,
    sorter: (a, b) => a.status.localeCompare(b.status),
    sortDirections: ['descend'],
  },
  {
    title: 'Vai trò',
    dataIndex: 'roles',
    onFilter: (value, record) => record.roles.indexOf(value) === 0,
    sorter: (a, b) => a.roles.join(', ').localeCompare(b.roles.join(', ')),
    sortDirections: ['descend'],
  },
  {
    title: 'Chức năng',
    dataIndex: 'action',
  },
];
