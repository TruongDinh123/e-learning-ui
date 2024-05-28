import {memo, useCallback, useEffect, useState} from 'react';
import {decrypt} from '../../../../utils';
import {Image} from 'antd';
import {useMediaQuery} from 'react-responsive';

const ModalContentMultipleChoice = ({quiz, quizItem}) => {
  const [quizAnswerDecrypt, setQuizAnswerDecrypt] = useState(null);
  const isDesktop = useMediaQuery({minWidth: 992});

  const getElements = useCallback(async () => {
    let answerDeCrypt = [];

    for (var i = 0; i < quiz[0].questions.length; i++) {
      const quizAnswer = await decrypt(quiz[0].questions[i].answer);

      answerDeCrypt.push(quizAnswer);
    }

    return answerDeCrypt;
  }, [quiz]);

  useEffect(() => {
    if (quiz) {
      getElements().then((res) => setQuizAnswerDecrypt(res));
    }
  }, [getElements, quiz]);

  return (
    <div className=''>
      <div className='flex flex-col items-center justify-center '>
        <div className='p-6 m-2 bg-white rounded shadow-md w-full sm:w-1/0.5 lg:w-1/0.5'>
          <h2 className='text-2xl font-bold text-center mb-5'>
            Đề thi: {quizItem.name}
          </h2>
          {quizItem.questions?.map((question, questionIndex) => {
            return (
              <ul key={questionIndex}>
                <li className='border p-3 mb-2 li-content'>
                  <div className='mb-2'>
                    <div>
                      <span className='font-bold'>
                        Câu {questionIndex + 1}:
                      </span>{' '}
                      <span
                        className={`overflow-hidden ${
                          isDesktop ? 'view ql-editor' : ''
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: `${question.question}`,
                        }}
                      />
                    </div>
                  </div>
                  {question?.image_url && (
                    <div className='mb-2'>
                      <Image
                        src={question.image_url}
                        alt={`Câu hỏi ${questionIndex + 1}`}
                        className='max-w-auto'
                      />
                    </div>
                  )}
                  {question.options.map((option, optionIndex) => (
                    <label className='block mb-2' key={optionIndex}>
                      <span className='font-mono'>
                        Câu {optionIndex + 1}: {option}
                      </span>
                    </label>
                  ))}
                  <span className='text-sm text-green-700 font-bold text-center mb-5'>
                    Đáp án:{' '}
                    {quizAnswerDecrypt && quizAnswerDecrypt[questionIndex]}
                  </span>
                </li>
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(ModalContentMultipleChoice);