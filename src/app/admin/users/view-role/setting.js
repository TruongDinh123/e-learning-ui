'use client';
import {Button, Dropdown, Menu, Space} from 'antd';
import React from 'react';
import EditRole from '../edit-role/page';

export const columns = [
  {
    title: 'SNo.',
    dataIndex: 'key',
  },
  {
    title: 'Tên vai trò',
    dataIndex: 'name',
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Chức năng',
    dataIndex: 'action',
  },
];

export const dataItemInit = ({
  index,
  role,
  isMobile,
}) => {
  const menu = (
    <Menu>
      <Menu.Item>
        <EditRole
          id={role?._id}
          roleName={role?.name}
        />
      </Menu.Item>
      {/* <Menu.Item>
        <DelRole
          idRole={role?._id}
          refresh={() => setUpdateRole(updateRole + 1)}
        />
      </Menu.Item> */}
    </Menu>
  );

  return {
    key: index + 1,
    name: role?.name,
    action: isMobile ? (
      <Dropdown overlay={menu} placement='bottomCenter'>
        <Button
          className='text-center justify-self-center'
          onClick={(e) => e.preventDefault()}
        >
          Chức năng
        </Button>
      </Dropdown>
    ) : (
      <Space size={'middle'}>
        <EditRole
          id={role?._id}
          roleName={role?.name}
          refresh={() => setUpdateRole(updateRole + 1)}
        />
        {/* <DelRole
          idRole={role?._id}
          refresh={() => setUpdateRole(updateRole + 1)}
        /> */}
      </Space>
    ),
  };
};

export const dataInit = ({roles, isMobile}) => {
  const data = roles.map((role, index) =>
    dataItemInit({
      index,
      role,
      isMobile,
    })
  );
  return data;
};
