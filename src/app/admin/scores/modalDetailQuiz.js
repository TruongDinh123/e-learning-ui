import {Button, Modal} from 'antd';
import {useMediaQuery} from 'react-responsive';
import ModalContentEssayQuiz from './modalContentEssayQuiz';

const ModalDetailQuiz = ({isModalOpen, handleCancel, scoreCurrentInfo}) => {
  const isDesktop = useMediaQuery({minWidth: 992});

  return (
    <Modal
      title={
        <h3 className='text-3xl font-bold text-indigo-600'>
          Bài tập {scoreCurrentInfo.quiz?.name}
        </h3>
      }
      width={800}
      open={isModalOpen}
      onCancel={handleCancel}
      loading={!!!scoreCurrentInfo}
      footer={[
        <Button key='cancel' onClick={handleCancel} style={{marginRight: 8}}>
          Cancel
        </Button>,
      ]}
    >
      {scoreCurrentInfo.quiz && scoreCurrentInfo.quiz.type === 'essay' ? (
        <ModalContentEssayQuiz />
      ) : (
        <div className='space-y-4 mb-5'>
          {scoreCurrentInfo.quiz.questions.map((question, index) => {
            const studentAnswer = scoreCurrentInfo.answers?.find((answer) =>
              answer?.hasOwnProperty(question?._id)
            );
            return (
              <div
                key={question._id}
                className='p-4 border rounded-lg shadow-sm'
              >
                <div className='mb-2'>
                  <span className='font-bold text-lg text-green-600'>
                    Câu {index + 1}:
                  </span>
                  <span
                    className={`block overflow-hidden ${
                      isDesktop ? 'ql-editor' : ''
                    } text-gray-700`}
                    dangerouslySetInnerHTML={{
                      __html: `${question.question}`,
                    }}
                  />
                </div>
                <ul className='list-disc pl-5 text-gray-600'>
                  {question.options.map((option, index) => (
                    <li key={index} className='text-sm'>
                      {index + 1}: {option}
                    </li>
                  ))}
                </ul>
                <div className='mt-2'>
                  <strong className='text-lg text-gray-800'>
                    Câu trả lời:{' '}
                    <span
                      className={`font-medium ${
                        studentAnswer ? 'text-blue-500' : 'text-red-500'
                      }`}
                    >
                      {studentAnswer
                        ? studentAnswer[question._id]
                        : 'Không có câu trả lời'}
                    </span>
                  </strong>
                </div>
              </div>
            );
          })}

          <div className='p-4 border rounded-lg shadow-sm'>
            <div className='mb-2'>
              <span className='font-bold text-lg text-green-600'>
                Câu {scoreCurrentInfo.quiz.questions.length + 1}:
              </span>
              <span
                className={`block overflow-hidden ${
                  isDesktop ? 'ql-editor' : ''
                } text-gray-700`}
              >
                Dự đoán số người tham dự:
              </span>
            </div>
            <div className='mt-2'>
              <strong className='text-lg text-gray-800'>
                Câu trả lời:
                <span className='font-medium text-blue-500'>
                  {scoreCurrentInfo?.predictAmount ?? '0'}
                </span>
              </strong>
            </div>
          </div>

     
        </div>
      )}
    </Modal>
  );
};

export default ModalDetailQuiz;
