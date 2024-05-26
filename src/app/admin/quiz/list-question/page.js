import {Button} from 'antd';
import {useState} from 'react';
import ModalBlock from './modalBlock';

const ListQuestion = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className='me-3'
        style={{width: '100%'}}
        onClick={() => setIsModalOpen(true)}
      >
        Xem chi tiết
      </Button>

      {isModalOpen && (
        <ModalBlock isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </>
  );
};

export default ListQuestion;
