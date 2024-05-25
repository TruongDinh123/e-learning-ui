'use client';
import {useSelector} from 'react-redux';
import {Input, Select, message} from 'antd';
import React, {useEffect, useState} from 'react';
import TableBlock from './TableBlock';

export default function ViewUsers() {
  //viewUsers api
  const allUsersStore = useSelector((state) => state?.user?.allUsers);
  const allRolesStore = useSelector((state) => state?.user?.allRoles);
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState(false);
  const {Option} = Select;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    !allUsersStore ? setIsLoading(true) : setIsLoading(false);
  }, [allUsersStore]);

  useEffect(() => {
    !allRolesStore ? setIsLoading(true) : setIsLoading(false);
  }, [allRolesStore]);

  return (
    <div className='p-3'>
      {contextHolder}
      <div className='flex flex-col md:flex-row md:items-center md:justify-start space-y-2 md:space-y-0 md:space-x-2'>
        <div className='flex flex-col'>
          <label
            htmlFor='userSearch'
            className='mb-1 text-sm font-medium text-gray-700'
          >
            Tìm kiếm người dùng
          </label>
          <Input
            title='Tìm kiếm người dùng'
            placeholder='Tìm kiếm người dùng'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='mb-2 sm:mb-0 w-full sm:w-64'
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='roleSelect'
            className='mb-1 text-sm font-medium text-gray-700'
          >
            Lọc theo vai trò
          </label>
          <Select
            showSearch
            placeholder='Lọc theo vai trò'
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            className='w-full sm:w-64 mb-2'
          >
            <Option value=''>Tất cả vai trò</Option>
            {allRolesStore &&
              allRolesStore.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              ))}
          </Select>
        </div>
      </div>

      <TableBlock
        filterRole={filterRole}
        searchTerm={searchTerm}
        isLoading={isLoading}
      />
    </div>
  );
}
