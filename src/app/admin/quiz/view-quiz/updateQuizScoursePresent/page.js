'use client';

import {useState} from 'react';
import {Button} from 'antd';
import ModalBlock from './modalBlock';

const UpdateQuizScoursePresent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div className='mb-4'>
      <Button
        type='primary'
        className='custom-button'
        onClick={() => setIsOpen(true)}
      >
        Chọn bài thi đại diện
      </Button>
      {isOpen && (
        <ModalBlock
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isOpen={isOpen}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UpdateQuizScoursePresent;
