import {Button, Modal, Spin} from 'antd';
import moment from 'moment';
import {Fragment} from 'react';
import {useSelector} from 'react-redux';
import ModalContentMultipleChoice from './modalContentMultipleChoice';

const ModalBlock = ({isModalOpen, setIsModalOpen}) => {
  const quiz = useSelector((state) => state.quiz.oneQuizInfo);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <Modal
        title={quiz?.map((quiz, quizIndex) => (
          <div className='bg-blue-100 p-4 rounded-md shadow-md' key={quizIndex}>
            <h2 className='text-2xl font-bold text-blue-700'>
              Tên khóa học: {quiz.courseIds[0]?.name}{' '}
              {quiz.lessonId?.courseId?.name}
            </h2>
            {quiz?.submissionTime && (
              <p className='text-blue-600'>
                Thời gian hoàn thành:{' '}
                {moment(quiz.submissionTime).format('DD/MM/YYYY HH:mm')}
              </p>
            )}
            <p className='text-blue-600'>
              Loại bài tập:{' '}
              {quiz.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
            </p>
          </div>
        ))}
        width={800}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' onClick={handleCancel} style={{marginRight: 8}}>
            Cancel
          </Button>,
        ]}
      >
        {quiz && (
          <div>
            {quiz.map((quizItem, quizIndex) => (
              <>
                {quizItem.type === 'multiple_choice' ? (
                  <ModalContentMultipleChoice quiz={quiz} quizItem={quizItem} />
                ) : (
                  <div className='grid-container bg-white shadow overflow-hidden sm:rounded-lg p-6'>
                    <div className='border-2 border-gray-300 p-4 rounded-md'>
                      <div className='flex items-center space-x-4'>
                        <div>
                          <h2 className='text-2xl font-bold mb-5 text-blue-600'>
                            {quizItem.essay.title}
                          </h2>
                          <div
                            className='mb-5 text-gray-700'
                            dangerouslySetInnerHTML={{
                              __html: quizItem.essay.content,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {quizItem.essay.attachment && (
                      <div>
                        <h3 className='text-lg font-bold mb-2'>
                          File đính kèm:
                        </h3>
                        <a
                          href={quizItem.essay.attachment}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-500 underline'
                        >
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </>
            ))}
          </div>
        )}
        {!quiz && (
          <div className='flex justify-center items-center h-screen'>
            <Spin />
          </div>
        )}
      </Modal>
    </Fragment>
  );
};

export default ModalBlock;