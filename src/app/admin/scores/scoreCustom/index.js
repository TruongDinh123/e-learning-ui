import {Button} from 'antd';
import { useState } from 'react';
import ModalBlock from './modalBlock';

const ScoreCustom = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <Button
        type='primary'
        htmlType='submit'
        className='custom-button mb-20'
        // loading={isScoresUsertestedLoading}
        onClick={() => setIsOpen(true)}
      >
        Cập nhật điểm cộng
      </Button>

      {isOpen && (
        <ModalBlock
          // isLoading={isLoading}
          // setIsLoading={setIsLoading}
          isOpen={isOpen}
          handleCancel={handleCancel}
        />
      )}

    </div>
  );
};

export default ScoreCustom;
